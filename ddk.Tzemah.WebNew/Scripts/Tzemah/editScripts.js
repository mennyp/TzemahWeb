function EditPits(props, layerDefPro, c) {
    "use strict";

    function clearProps() {
        dataProps.where = "",
        dataProps.objectIds = ""
    }

    function setDataProps(a) {
        clearProps(),
        dataProps.where = 0 === a.length ? "0=1" : "",
        dataProps.objectIds = a.join(","),
        o.trigger(p, [a])
    }

    function f() {
        o.trigger("pitsDisplayed", [
            [],
            []
        ]),
        o.trigger("hidden")
    }

    function g() {
        o.trigger("shown")
    }
    var query, queryTask, geometryService, k, geoService, kenGrid,
        dataProps = {
            f: "json",
            token: window.token,
            outFields: "*",
            where: "0=1"
        },
        o = $(this);
    require(["esri/tasks/query", "esri/tasks/QueryTask", "esri/tasks/GeometryService", "esri/config"], function (a, c, d, e) {
        query = a, queryTask = c, geometryService = d, k = e, geoService = new geometryService(layerDefPro.getLayerUrlById("geoService")), k.defaults.geometryService = geoService
    });
    var p = "pitsSelectedEvent";
    Object.defineProperty(this, "grid", {
        get: function () {
            return kenGrid.data("kendoGrid")
        },
        enumerable: !0
    });
    var dataSource = new kendo.data.DataSource({
        error: function (a) {
            console.log(a.errors)
        },
        transport: {
            read: {
                dataType: "json",
                url: layerDefPro.getLayerUrlById("pits") + "/query",
                data: dataProps,
                type: "POST"
            },
            create: {
                url: layerDefPro.getLayerUrlById("pits") + "/addFeatures",
                type: "POST"
            },
            update: {
                url: layerDefPro.getLayerUrlById("pits") + "/updateFeatures",
                type: "POST"
            },
            destroy: {
                url: layerDefPro.getLayerUrlById("pits") + "/deleteFeatures",
                type: "POST"
            },
            parameterMap: function (att, b) {
                if ("destroy" === b) {
                    var c = [];
                    return c.push(att.OBJECTID), {
                        objectIds: c.join(","),
                        f: "json",
                        token: window.token
                    }
                }
                if ("read" !== b && att) {
                    var features = [];
                    features.push({
                        attributes: att,
                        geometry: {
                            x: att.x,
                            y: att.y
                        }
                    });
                    var dataProps = {
                        features: kendo.stringify(features),
                        rollbackOnFailure: !1,
                        f: "json",
                        token: window.token
                    };
                    return dataProps
                }
                return att
            }
        },
        schema: {
            parse: function (a) {
                var fieldsArr = [],
                    features = a.features;
                if ("string" == typeof a) return kenGrid.data("kendoGrid").dataSource.read(), [];
                for (var d = 0; d < features.length; d++) {
                    var fields = {};
                    fields.OBJECTID = features[d].attributes.OBJECTID,
                    fields.SurveyId = features[d].attributes.SurveyId,
                    fields.PitNumberInSurvey = features[d].attributes.PitNumberInSurvey,
                    fields.Conclusions = features[d].attributes.Conclusions,
                    fields.x = features[d].geometry.x,
                    fields.y = features[d].geometry.y,
                    fieldsArr.push(fields)
                }
                return fieldsArr
            },
            model: {
                id: "OBJECTID",
                fields: {
                    OBJECTID: {
                        type: "number",
                        editable: !1,
                        defaultValue: ""
                    },
                    SurveyId: {
                        type: "number",
                        defaultValue: ""
                    },
                    x: {
                        type: "number",
                        defaultValue: ""
                    },
                    y: {
                        type: "number",
                        defaultValue: ""
                    },
                    PitNumberInSurvey: {
                        type: "string",
                        defaultValue: ""
                    },
                    Conclusions: {
                        type: "string"
                    }
                }
            }
        }
    });
    kenGrid = $(props.table).kendoGrid({
        toolbar: ["create"],
        editable: "popup",
        dataSource: dataSource,
        height: 200,
        sortable: {
            allowUnsort: !1
        },
        selectable: "multiple",
        columnMenu: !0,
        resizable: !0,
        columns: [{
            field: "OBJECTID",
            title: "מזהה בור",
            format: "{0:0}",
            width: 100
        }, {
            command: ["edit", "destroy"],
            title: "פעולות"
        }, {
            field: "SurveyId",
            title: "מס סקר"
        }, {
            field: "x",
            format: "{0:0}"
        }, {
            field: "y",
            format: "{0:0}"
        }, {
            field: "PitNumberInSurvey",
            title: "מספר בור בסקר"
        }, {
            field: "Conclusions",
            title: "הערות"
        }]
    }), kenGrid.data("kendoGrid").thead.kendoTooltip({
        filter: "th",
        content: function (a) {
            var b = a.target;
            return $(b).text()
        }
    }), kenGrid.data("kendoGrid").bind("change", function () {
        var a = [],
            b = this;
        this.select().each(function () {
            a.push(b.dataItem(this).OBJECTID)
        }), o.trigger(p, [a])
    }), dataSource.bind("change", function (a) {
        console.debug("pits data loaded with :" + a.items.length);
        var b = [],
            c = [];
        if (a.items.length > 0) {
            var d = this.data();
            _.each(d, function (a) {
                var d = a.OBJECTID;
                b.indexOf(d) < 0 && b.push(d);
                var e = a.SurveyId;
                c.indexOf(e) < 0 && c.push(e)
            })
        }
        o.trigger("pitsDisplayed", [b, c])
    }), $(c).on("shown", function () {
        console.debug("plots displayed")
    }), $(c).on("hidden", function () {
        f()
    }), c.grid.bind("change", function () {
        var a = [],
            c = this;
        if (this.select().each(function () {
                a.push(c.dataItem(this).OBJECTID)
        }), 0 === a.length) f();
        else {
            console.log("pits selected :" + a.length);
            try {
                var qry = new query;
                qry.returnGeometry = !0, qry.objectIds = a;
                var queryTsk = new queryTask(layerDefPro.getLayerUrlById("plots"));
                queryTsk.execute(qry, function (a) {
                    var qry = new query,
                        geoArr = _.map(a.features, function (feature) {
                            return feature.geometry
                        });
                    geoService.union(geoArr, function (a) {
                        qry.geometry = a;
                        var qryTask = new queryTask(layerDefPro.getLayerUrlById("pits"));
                        qryTask.executeForIds(qry, function (a) {
                            setDataProps(a), dataSource.read()
                        })
                    })
                })
            } catch (k) {
                console.log("could not query pits :" + k)
            }
            g()
        }
    }), this.setSurveyPicker = function (a) {
        $(a).on(a.updateEvent, function (a, b) {
            clearProps(), dataProps.where = 0 === b.length ? "0=1" : "SurveyId= " + b.join(" OR SurveyId="), dataSource.read()
        })
    }, f()
}

function EditPlotsPicker(props, layerDefPro, c) {
    var d = $(this),
        dataSource = new kendo.data.DataSource({
            transport: {
                read: {
                    dataType: "json",
                    url: layerDefPro.getLayerUrlById("plots") + "/query",
                    data: {
                        f: "json",
                        token: window.token,
                        outFields: "*",
                        where: "1=1",
                        returnGeometry: !0
                    },
                    type: "POST"
                }
            },
            filter: {
                field: "settleCode",
                operator: "eq",
                value: 26
            },
            schema: {
                parse: function (a) {
                    for (var fieldsArr = [], features = a.features, d = 0; d < features.length; d++) {
                        var fields = {};
                        fields.OBJECTID = features[d].attributes.OBJECTID,
                        fields.ID_UNIQUE = features[d].attributes.ID_UNIQUE,
                        fields.PLOT_NO = features[d].attributes.PLOT_NO,
                        fields.hebName = features[d].attributes.hebName,
                        fields.settleCode = features[d].attributes.settleCode,
                        fieldsArr.push(fields)
                    }
                    return fieldsArr
                },
                model: {
                    id: "OBJECTID",
                    fields: {
                        OBJECTID: {
                            type: "number",
                            editable: !1
                        },
                        ID_UNIQUE: {
                            type: "string"
                        },
                        hebName: {
                            type: "string"
                        },
                        PLOT_NO: {
                            type: "number"
                        },
                        settleCode: {
                            type: "number"
                        }
                    }
                }
            }
        }),
        f = $(props.table).kendoGrid({
            height: 150,
            dataSource: dataSource,
            toolbar: [{
                name: "clearSelection",
                text: "נקה"
            }],
            sortable: {
                allowUnsort: !1
            },
            resizable: !0,
            selectable: "multiple",
            columns: [{
                field: "OBJECTID",
                title: "OBJECTID",
                hidden: !0
            }, {
                field: "ID_UNIQUE",
                title: "מזהה ייחודי"
            }, {
                field: "PLOT_NO",
                title: "מספר חלקה"
            }, {
                field: "hebName",
                title: "משק",
                filterable: !0
            }]
        });
    $(".k-grid-clearSelection", props.table).bind("click", function (a) {
        f.data("kendoGrid").clearSelection()
    }), $(props.table).parents().resize(function () {
        f.data("kendoGrid").resize()
    }), c.bind("change", function (a) {
        var b = $(this).val(),
            c = [];
        null == b ? f.trigger("hidden") : (c = _.map(b, function (a) {
            return {
                field: "settleCode",
                operator: "eq",
                value: parseInt(a)
            }
        }), f.trigger("shown")), dataSource.filter({
            logic: "or",
            filters: c
        }), f.data(dataSource).data("kendoGrid").refresh()
    }), Object.defineProperty(this, "grid", {
        get: function () {
            return f.data("kendoGrid")
        }
    }), this.grid.bind("change", function (a) {
        var b = [],
            c = this;
        this.select().each(function () {
            b.push(c.dataItem(this).OBJECTID)
        }), d.trigger("plotsUpdated", [b])
    })
}

function EditSurveys(props, layerDefPro, c) {
    "use strict";

    function d(a) {
        if (0 === a.length) j.filter({
            logic: "or",
            filters: []
        });
        else {
            console.log("pits selected :" + a.length);
            try {
                var b = _.map(a, function (a) {
                    return {
                        field: "OBJECTID",
                        operator: "eq",
                        value: parseInt(a)
                    }
                });
                j.filter({
                    logic: "or",
                    filters: b
                })
            } catch (c) {
                console.log("could not query pits :" + c)
            }
        }
        g.data(j).data("kendoGrid").refresh()
    }

    function getGridValsArr(kenGrid, fieldName) {
        var c = [],
            d = kenGrid.select();
        if (0 !== d.length) d.each(function () {
            c.push(kenGrid.dataItem(this)[fieldName])
        });
        else {
            var e = [],
                f = kenGrid.dataSource.filter();
            if (!f) return c;
            _.map(f.filters, function (a) {
                return a.value
            }).sort();
            var g = _.difference(e, h).length + _.difference(h, e).length === 0;
            f.filters.length > 0 && !g && (h = e, _.each(kenGrid.dataSource.view(), function (a) {
                c.push(a[fieldName])
            }))
        }
        return c
    }

    function f() {
        var kenGrid = g.data("kendoGrid"),
            objectIdsArr = getGridValsArr(kenGrid, "OBJECTID");
        objectIdsArr.length > 0 && $(this).trigger(i, [objectIdsArr])
    }
    var g, h, i = "surveyUpdated",
        j = new kendo.data.DataSource({
            sort: {
                field: "OBJECTID",
                dir: "desc"
            },
            transport: {
                read: {
                    dataType: "json",
                    url: layerDefPro.getLayerUrlById("surveys") + "/query",
                    data: {
                        f: "json",
                        token: window.token,
                        outFields: "*",
                        where: "1=1"
                    },
                    type: "POST"
                },
                create: {
                    url: layerDefPro.getLayerUrlById("surveys") + "/addFeatures",
                    type: "POST"
                },
                update: {
                    url: layerDefPro.getLayerUrlById("surveys") + "/updateFeatures",
                    type: "POST"
                },
                destroy: {
                    url: layerDefPro.getLayerUrlById("surveys") + "/deleteFeatures",
                    type: "POST"
                },
                parameterMap: function (a, b) {
                    if ("destroy" === b) {
                        var c = [];
                        return c.push(a.OBJECTID), {
                            objectIds: c.join(","),
                            f: "json",
                            token: window.token
                        }
                    }
                    if ("read" !== b && a) {
                        var d = [];
                        d.push({
                            attributes: a
                        });
                        var e = {
                            features: kendo.stringify(d),
                            rollbackOnFailure: !1,
                            f: "json",
                            token: window.token
                        };
                        return e
                    }
                    return a
                }
            },
            schema: {
                data: function (a) {
                    return a
                },
                parse: function (a) {
                    var fieldsArr = [];
                    return a.features && (fieldsArr = a.features), "string" == typeof a ? (g.data("kendoGrid").dataSource.read(), []) : _.map(fieldsArr, function (a) {
                        var b = a.attributes;
                        return b.Date = new Date(b.Date), b
                    })
                },
                model: {
                    id: "OBJECTID",
                    fields: {
                        OBJECTID: {
                            type: "number",
                            editable: !1
                        },
                        Name: {
                            type: "string"
                        },
                        Date: {
                            type: "date"
                        },
                        Comment: {
                            type: "string"
                        }
                    }
                }
            }
        });
    Object.defineProperty(this, "updateEvent", {
        get: function () {
            return i
        },
        enumerable: !0
    }), g = $(props.table).kendoGrid({
        toolbar: ["create"],
        editable: "popup",
        dataSource: j,
        height: 200,
        sortable: {
            allowUnsort: !1
        },
        selectable: "multiple",
        columnMenu: !0,
        resizable: !0,
        filterable: {
            extra: !1
        },
        batch: !1,
        columns: [{
            field: "OBJECTID",
            title: "מס סקר",
            width: 80
        }, {
            field: "Name",
            title: "שם סקר",
            width: 150
        }, {
            field: "Date",
            title: "תאריך",
            format: "{0:d}",
            width: 100
        }, {
            field: "Comment",
            title: "הערות",
            width: 300
        }, {
            command: ["edit", "destroy"],
            width: 180
        }]
    }), g.data("kendoGrid").thead.kendoTooltip({
        filter: "th",
        content: function (a) {
            var b = a.target;
            return $(b).text()
        }
    }), $(c).on("shown", function () {
        g.trigger("shown")
    }), $(c).on("hidden", function () {
        g.trigger("hidden")
    }), c.grid.bind("change", function () {
        var a = [],
            b = this,
            c = this.select();
        0 !== c.length ? c.each(function () {
            a.push(b.dataItem(this).SurveyId)
        }) : _.each(this.dataSource.data(), function (b) {
            a.push(b.SurveyId)
        }), d(a)
    }), $(c).on("pitsDisplayed", function (a, b, c) {
        d(c)
    }), g.data("kendoGrid").bind("change", f.bind(this)), g.data("kendoGrid").dataSource.bind("change", f.bind(this))
}

function AttachmentAddWindow(props, layerDefPro, editSurvay) {
    function showReopen() {
        reOpen.show()
    } {
        var progress = new ProgressIndicator({
            window: "#" + props.progresIndicator
        }),
            win = $("#" + props.window),
            reOpen = $("#" + props.reopen).bind("click", function () {
                win.data("kendoWindow").open(), reOpen.hide()
            }),
            surveyAttachData = {
                f: "json",
                token: window.token,
                outFields: "*",
                where: "0=1"
            },
            attachFileInputElement = $("#" + props.attachFileInput),
            kendoWinSelFile = $("#" + props.selectionWindow).kendoWindow({
                width: "30%",
                height: "30%",
                visible: !1,
                modal: !0,
                title: "בחר קובץ",
                actions: ["Pin", "Minimize", "Maximize", "Close"],
                close: function () {
                    attachFileInputElement.val(""), $("#" + props.surveyId).val("")
                }
            }).data("kendoWindow"),
            dataSource = new kendo.data.DataSource({
                transport: {
                    read: function (a) {
                        $.ajax({
                            dataType: "json",
                            url: layerDefPro.getLayerUrlById("surveyAttachments") + "/query",
                            data: surveyAttachData,
                            type: "POST",
                            success: function (b) {
                                a.success(b)
                            },
                            error: function (b) {
                                a.error(b)
                            }
                        })
                    },
                    destroy: function (a) {
                        var c = [];
                        c.push(a.data.OBJECTID);
                        var d = {
                            objectIds: c.join(","),
                            f: "json",
                            token: window.token
                        };
                        $.ajax({
                            url: layerDefPro.getLayerUrlById("surveyAttachments") + "/deleteFeatures",
                            type: "POST",
                            data: d
                        }).then(function (b) {
                            return console.debug("table delete result " + kendo.stringify(b)), $.ajax({
                                url: "/edit/deleteAttachment",
                                type: "POST",
                                data: a.data
                            })
                        }).done(function (a) {
                            console.log("deleted " + kendo.stringify(a))
                        }).fail(function (err) {
                            console.error(err)
                        }).always(function () {
                            setTimeout(function () {
                                dataSource.read()
                            }, 1e3)
                        })
                    }
                },
                schema: {
                    parse: function (a) {
                        return "string" == typeof a ? (dataSource.data("kendoGrid").dataSource.read(), []) : _.map(a.features, function (a) {
                            return a.attributes
                        })
                    },
                    model: {
                        id: "OBJECTID",
                        fields: {
                            OBJECTID: {
                                type: "number",
                                editable: !1
                            },
                            SurveyId: {
                                type: "number"
                            },
                            AttachmentUrl: {
                                type: "string"
                            }
                        }
                    }
                }
            });
        $("#" + props.listView).kendoListView({
            selectable: "single",
            dataSource: dataSource,
            template: kendo.template($("#attachmentEditTemplate").html())
        }).data("kendoListView")
    }
    $("#" + props.fileInput).click(function (c) {
        function d() {
            attachFileInputElement.replaceWith(attachFileInputElement = attachFileInputElement.clone(!0))
        }

        function f(c, f) {
            var g = this.files[0],
                h = $("#" + props.surveyId).val();
            if (isNaN(h) || "" === h) return d(), void alert("הסקר אינו מספר");
            progress.showProgress();
            var i = new FileReader;
            i.onload = function (a) {
                progress.showProgress(), $.ajax({
                    data: {
                        document: a.target.result.split(",")[1],
                        surveyId: h,
                        fileName: g.name,
                        fileType: g.type,
                        processData: !1,
                        contentType: !1
                    },
                    url: "/edit/saveAttachment",
                    type: "POST"
                }).then(function (a) {
                    if ("OK" !== a.result) return progress.hideProgress(), void alert("בעיה בשמירת הקובץ");
                    var c = [];
                    c.push({
                        attributes: {
                            SurveyId: h,
                            AttachmentUrl: a.fileName,
                            FileType: g.type
                        }
                    });
                    var d = {
                        features: kendo.stringify(c),
                        rollbackOnFailure: !1,
                        f: "json",
                        token: window.token
                    };
                    return $.ajax({
                        url: layerDefPro.getLayerUrlById("surveyAttachments") + "/addFeatures",
                        type: "POST",
                        data: d
                    }).done(function (a) {
                        console.log(a), a = JSON.parse(a), alert(a.addResults[0].success ? "הקובץ נוסף בהצלחה" : "בעיה בהוספת הקובץ בטבלה\n" + a.addResults[0].error.description)
                    })
                }).fail(function (a) {
                    console.error(a), alert("בעיה בהוספת הקובץ")
                }).always(function () {
                    progress.hideProgress(), d(), kendoWinSelFile.close(), setTimeout(function () {
                        dataSource.read()
                    }, 1e3)
                })
            }, i.readAsDataURL(g)
        }
        kendoWinSelFile.center().open(), attachFileInputElement.one("change", f)
    }), win.data("kendoWindow") || win.kendoWindow({
        width: "50%",
        height: "50%",
        visible: !1,
        position: {
            top: "26%"
        },
        title: "קבצים מקושרים",
        actions: ["Pin", "Minimize", "Maximize", "Close"],
        close: showReopen
    }), $(editSurvay).on(editSurvay.updateEvent, function (a, b) {
        surveyAttachData.where = 0 === b.length ? "0=1" : "SurveyId= " + b.join(" OR SurveyId="),
            dataSource.read()
    })
}

function DataTableEditor(layerUrl, b, c) {
    var d, e, f = this;
    this.resizeGrid = function () {
        if (d) {
            var a = $(c.frame).height(),
                b = d.find(".k-grid-content"),
                e = d.find(".k-grid-content-locked"),
                f = d.find(".k-grid-header").height(),
                g = d.find(".k-grid-toolbar").height(),
                h = a - (g + f + 10);
            b.height(h), e.height(h), d.height(h)
        }
    }, this.readData = function () {
        e.read()
    }, this.tableCreate = function (a, b, g) {
        var h = a.columns();
        return h.unshift({
            command: ["edit", "destroy"],
            title: "פעולות",
            width: "200px"
        }), d = $(c.table).kendoGrid({
            toolbar: ["create"],
            editable: "inline",
            dataSource: e,
            height: $(c.frame).height() - 60,
            sortable: {
                allowUnsort: !1
            },
            selectable: "multiple",
            columnMenu: !0,
            columns: h,
            resizable: !0,
            dataBound: function () {
                var a = this.dataSource.data(),
                    c = this.columns,
                    d = new b(g, c);
                $.each(a, function (a, b) {
                    var c = $('tr[data-uid="' + b.uid + '"] td');
                    0 !== c.length && d.highlight(c)
                }), f.resizeGrid()
            }
        }), d.data("kendoGrid").thead.kendoTooltip({
            filter: "th",
            content: function (a) {
                var b = a.target;
                return $(b).text()
            }
        }), d
    }, this.dataSourceWithPits = function (c) {
        return e = new kendo.data.DataSource({
            transport: {
                read: {
                    dataType: "json",
                    url: layerUrl + "/query",
                    data: {
                        f: "json",
                        token: window.token,
                        outFields: "*",
                        where: "pitId=" + c.join(" OR pitId =")
                    },
                    type: "POST"
                },
                create: {
                    url: layerUrl + "/addFeatures",
                    type: "POST"
                },
                update: {
                    url: layerUrl + "/updateFeatures",
                    type: "POST"
                },
                destroy: {
                    url: layerUrl + "/deleteFeatures",
                    type: "POST"
                },
                parameterMap: function (a, b) {
                    if ("destroy" === b) {
                        var c = [];
                        return c.push(a.OBJECTID), {
                            objectIds: c.join(","),
                            f: "json",
                            token: window.token
                        }
                    }
                    if ("read" !== b && a) {
                        var d = [];
                        d.push({
                            attributes: a
                        }), delete a.Guid;
                        for (var e in a) a.hasOwnProperty(e) && -1 !== e.search(new RegExp("GlobalID"), "i") && delete a[e];
                        var f = {
                            features: kendo.stringify(d),
                            rollbackOnFailure: !1,
                            f: "json",
                            token: window.token
                        };
                        return f
                    }
                    return a
                }
            },
            schema: b
        })
    }, this.registerPitSelectionChannges = function (a, b, c, e) {
        $(a).on("pitsDisplayed pitsSelectedEvent", function (a, f) {
            if (console.debug("fieldData sees unique pits : " + f.length + " | " + f.join(",")), "undefined" != typeof b) {
                var g;
                d ? (g = d.data("kendoGrid").dataSource, g.transport.options.read.data.where = "pitId=" + f.join(" OR pitId ="), g.read()) : (g = c.dataSourceWithPits(f), d = c.tableCreate(b, FieldDataHighlighter, e))
            }
        })
    }
}

function EditFormControls(layerDefPro) {
    var meshakimPicker = new MeshakimPicker("#meshakim", layerDefPro),
        editPlotsPicker = new EditPlotsPicker({
            table: "#plots"
        }, layerDefPro, meshakimPicker),
        editPits = new EditPits({
            table: "#pits"
        }, layerDefPro, editPlotsPicker),
        editSurvay = new EditSurveys({
            table: "#surveys"
        }, layerDefPro, editPits);
    editPits.setSurveyPicker(editSurvay);
    new FieldDataEditor({
        table: "#fieldData",
        frame: "#fieldDetailsPane"
    }, layerDefPro, editPits, $("#verticalEdit").data("kendoSplitter")),
        new LabDataEditor({
        table: "#labData",
        frame: "#labDetailsPane"
    }, layerDefPro, editPits, $("#verticalEdit").data("kendoSplitter")),
    new LabDataImport({
        table: "#labImportGrid",
        window: "labImportWindow",
        reopen: "openImport",
        importWindow: "importWindow",
        fileInput: "fileInput",
        parse: "sendToParsing",
        fileDisplayArea: "fileDisplayArea",
        surveyId: "surveyIdToImport",
        progresIndicator: "hider"
    }, layerDefPro), new AttachmentAddWindow({
        window: "addAttachmentWindow",
        reopen: "addAttachment",
        listView: "attachListView",
        selectionWindow: "attachSelectionWindow",
        attachFileInput: "attachFileInput",
        surveyId: "surveyIdForAttach",
        fileInput: "attachAdd",
        progresIndicator: "hider"
    }, layerDefPro, editSurvay);
    this.getMeshakimPicker = function () {
        return meshakimPicker
    }, this.getPlotsPicker = function () {
        return editPlotsPicker
    }, this.getPitsPicker = function () {
        return editPits
    }
}

function FieldDataEditor(props, layerDefPro, editPits, kenSplitter) {
    "use strict";

    function setParseModel() {
        var parseModel = {
            parse: function (a) {
                var features = a.features;
                if ("string" == typeof a) {
                    var c = JSON.parse(a);
                    return c = c[Object.keys(c)[0]][0], c.success || alert(c.error.description), dataTableEditor.readData(), []
                }
                return _.map(features, function (a) {
                    return a.attributes
                })
            },
            model: {
                id: "OBJECTID",
                fields: fieldsToGridConverter.fields()
            }
        };
        dataTableEditor = new DataTableEditor(layerDefPro.getLayerUrlById("fieldData"), parseModel, props),
            kenSplitter.bind("resize", dataTableEditor.resizeGrid),
            dataTableEditor.registerPitSelectionChannges(editPits, fieldsToGridConverter, dataTableEditor, j)
    }
    var fieldsToGridConverter, g, dataTableEditor, data = [],
        j = [],
        fieldNamesArr = ["OBJECTID", "Guid", "GlobalID"];
    ! function () {
        var dataSource = new kendo.data.DataSource({
            transport: {
                read: {
                    dataType: "json",
                    url: layerDefPro.getLayerUrlById("fieldData"),
                    data: {
                        f: "pjson",
                        token: window.token
                    },
                    type: "GET"
                }
            },
            schema: {
                parse: function (a) {
                    return a.fields
                }
            }
        });
        dataSource.fetch(function () {
            data = this.data(),
                fieldsToGridConverter = new FieldsToGridConverter(data, fieldNamesArr),
                setParseModel()
        })
    }(),
    function () {
        var dataSource = new kendo.data.DataSource({
            transport: {
                read: {
                    dataType: "json",
                    url: layerDefPro.getLayerUrlById("fieldDataTableColors") + "/query",
                    data: {
                        f: "json",
                        outFields: "*",
                        where: "1=1",
                        token: window.token
                    },
                    type: "POST"
                }
            },
            schema: {
                parse: function (a) {
                    return _.map(a.features, function (a) {
                        return a.attributes
                    })
                }
            }
        });
        dataSource.fetch(function () {
            try {
                j = _.map(this.data(), function (a) {
                    return {
                        ElementName: a.ElementName,
                        symbols: JSON.parse(a.ColorJson)
                    }
                })
            } catch (a) {
                console.log(a)
            }
        })
    }(), kenSplitter.bind("resize", function () {
        if (g) {
            var b = $(props.frame).height(),
                c = g.find(".k-grid-content"),
                d = g.find(".k-grid-header").height(),
                e = g.find(".k-grid-toolbar").height(),
                f = b - (e + d + 10);
            c.height(f), g.height(f)
        }
    })
}

function LabDataEditor(props, layerDefPro, kenSplitter, labDataImport) {
    "use strict";

    function e() {
        var parseModel = {
            parse: function (a) {
                var features = a.features;
                if ("string" == typeof a) {
                    var c = JSON.parse(a);
                    return c = c[Object.keys(c)[0]][0], c.success || alert(c.error.description), dataTableEditor.readData(), []
                }
                return _.map(features, function (a) {
                    var att = a.attributes;
                    return att.RecievalDate = new Date(att.RecievalDate), att
                })
            },
            model: {
                id: "OBJECTID",
                fields: f.fields()
            }
        };
        dataTableEditor = new DataTableEditor(layerDefPro.getLayerUrlById("labData"), parseModel, props),
            labDataImport.bind("resize", dataTableEditor.resizeGrid),
            dataTableEditor.registerPitSelectionChannges(kenSplitter, f, dataTableEditor, propsData)
    }
    var f, dataTableEditor, h = [],
        propsData = [],
        fieldNamesArr = ["GlobalID", "Pits_GlobalID", "Guid", "Guid_2"];
    ! function () {
        var dataSource = new kendo.data.DataSource({
            transport: {
                read: {
                    dataType: "json",
                    url: layerDefPro.getLayerUrlById("labData"),
                    data: {
                        f: "pjson",
                        token: window.token
                    },
                    type: "GET"
                }
            },
            schema: {
                parse: function (a) {
                    return a.fields
                }
            }
        });
        dataSource.fetch(function () {
            h = this.data(), f = new FieldsToGridConverter(h, fieldNamesArr), e()
        })
    }(),
    function () {
        var dataSource = new kendo.data.DataSource({
            transport: {
                read: {
                    dataType: "json",
                    url: layerDefPro.getLayerUrlById("labDataRanges") + "/query",
                    data: {
                        f: "json",
                        outFields: "*",
                        where: "1=1",
                        token: window.token
                    },
                    type: "POST"
                }
            },
            schema: {
                parse: function (a) {
                    return _.map(a.features, function (feature) {
                        return feature.attributes
                    })
                }
            }
        });
        dataSource.fetch(function () {
            propsData = this.data()
        })
    }()
}

function LabDataImport(props, layerDefPro) {
    "use strict";

    function showReopen() {
        reOpen.show()
    }

    function d(a) {
        var c = [],
            d = kenGrid.data("kendoGrid").dataSource.data().toJSON();
        _.each(d, function (a) {
            Utils.cleanGuidFromObject(a), c.push({
                attributes: a
            })
        });
        var e = {
            features: kendo.stringify(c),
            rollbackOnFailure: !0,
            f: "json",
            token: window.token
        };
        $.ajax({
            type: "POST",
            url: layerDefPro.getLayerUrlById("labData") + "/addFeatures",
            data: e,
            dataType: "json",
            success: function (a) {
                var b = a.addResults[0].error;
                return b ? void alert(b.description) : a.addResults.length !== c.length ? void alert("ייתכן שלא כל הנתונים משנרו נא לוודא") : (kenGrid.data("kendoGrid").dataSource.data([]),
                    void win.data("kendoWindow").close())
            }
        }).fail(function (a) {
            alert("הנתונים לא נשמרו במלואם - נא לוודא")
        })
    }

    function e() {
        var cols = g.columns();
        cols.unshift({
            command: ["edit", "destroy"],
            title: "פעולות",
            width: "200px"
        }), kenGrid = $(props.table).kendoGrid({
            toolbar: [{
                name: "import",
                text: "ייבא"
            }, {
                name: "saveToDb",
                text: "שמור"
            }],
            editable: "popup",
            pageSize: 50,
            height: .98 * $(props.frame).height(),
            sortable: {
                allowUnsort: !1
            },
            columnMenu: !0,
            columns: cols,
            resizable: !0,
            dataBound: function () {
                var a = this.dataSource.data(),
                    b = this.columns,
                    c = new LabDataHighlighter(data, b);
                $.each(a, function (a, b) {
                    var d = $('tr[data-uid="' + b.uid + '"] td');
                    0 !== d.length && c.highlight(d)
                })
            }
        }), $(".k-grid-import", props.table).bind("click", function (a) {
            labDataImportProcessMng["import"](g)
        }), $(".k-grid-saveToDb", props.table).bind("click", d)
    }

    function setParseModel() {
        parseModel = {
            parse: function (a) {
                var features = a.features;
                return "string" == typeof a ? (kenGrid.data("kendoGrid").dataSource.read(), []) : _.map(features, function (feature) {
                    var att = feature.attributes;
                    return att.RecievalDate = new Date(att.RecievalDate), att
                })
            },
            model: {
                id: "OBJECTID",
                fields: g.fields()
            }
        }
    }
    var g, kenGrid, parseModel, j = [],
        data = [],
        win = $("#" + props.window),
        reOpen = $("#" + props.reopen).bind("click", function () {
            win.data("kendoWindow").open(), reOpen.hide()
        }),
        labDataImportProcessMng = new LabDataImportProcessManager(props, layerDefPro),
        sourceFields = [, "Guid", "Guid_2"],
        p = function () {
            var dataSource = new kendo.data.DataSource({
                transport: {
                    read: {
                        dataType: "json",
                        url: layerDefPro.getLayerUrlById("labData"),
                        data: {
                            f: "pjson",
                            token: window.token
                        },
                        type: "GET"
                    }
                },
                schema: {
                    parse: function (a) {
                        return a.fields
                    }
                }
            });
            return dataSource.fetch(function () {
                j = this.data(), g = new FieldsToGridConverter(j, sourceFields), setParseModel()
            })
        }(),
        q = function () {
            var dataSource = new kendo.data.DataSource({
                transport: {
                    read: {
                        dataType: "json",
                        url: layerDefPro.getLayerUrlById("labDataRanges") + "/query",
                        data: {
                            f: "json",
                            outFields: "*",
                            where: "1=1",
                            token: window.token
                        },
                        type: "POST"
                    }
                },
                schema: {
                    parse: function (a) {
                        return _.map(a.features, function (a) {
                            return a.attributes
                        })
                    }
                }
            });
            return dataSource.fetch(function () {
                data = this.data()
            })
        }();
    $.when(q, p).then(function () {
        e()
    }), win.data("kendoWindow") || win.kendoWindow({
        width: "99%",
        height: "50%",
        visible: !1,
        position: {
            top: "26%"
        },
        title: "ייבוא נתוני מעבדה",
        actions: ["Pin", "Minimize", "Maximize", "Close"],
        close: showReopen
    })
}

function LabDataImportProcessManager(props, layerDefPro) {
    "use strict";

    function onSuccess(b) {
        if ("OK" !== b.status) return console.error(b), void alert("the file result came in bad");
        var c = [];
        _.each(b.result, function (a) {
            _.each(a.Properties, function (b, c) {
                a[c] = b
            }), delete a.Properties, _.each(g.columns(), function (b) {
                a.hasOwnProperty(b.field) || (a[b.field] = "")
            }), a.RecievalDate = new Date(moment(a.RecievalDate, "DD/M/YYYY").format()), c.push(a)
        }), $(props.table).data("kendoGrid").dataSource.data(c)
    }

    function d(serveyVal) {
        var dataSource = new kendo.data.DataSource({
            transport: {
                read: {
                    dataType: "json",
                    url: layerDefPro.getLayerUrlById("pits") + "/query",
                    data: {
                        f: "json",
                        token: window.token,
                        outFields: "*",
                        where: "surveyId = " + serveyVal
                    },
                    type: "POST"
                }
            },
            schema: {
                parse: function (a) {
                    for (var fieldsArr = [], features = a.features, index = 0; index < features.length; index++) {
                        var pitsProps = {};
                        pitsProps.OBJECTID = features[index].attributes.OBJECTID,
                        pitsProps.SurveyId = features[index].attributes.SurveyId,
                        pitsProps.PitNumberInSurvey = features[index].attributes.PitNumberInSurvey,
                        pitsProps.Conclusions = features[index].attributes.Conclusions,
                        fieldsArr.push(pitsProps)
                    }
                    return fieldsArr
                }
            }
        }),
            d = new Promise(function (a, b) {
                dataSource.read().then(function () {
                    var b = dataSource.data(),
                        d = {};
                    _.each(b, function (a) {
                        d[a.PitNumberInSurvey] = a.OBJECTID
                    }), a(d)
                })
            });
        return d
    }

    function e(a) {
        var b = {};
        return _.each(a.columns(), function (a) {
            "" !== a.title && (b[a.title] = a.field)
        }), b
    }

    function setFileDisplayAreaText() {
        var fileDisplayAreaElement = $("#" + props.fileDisplayArea),
            d = this.files[0],
            e = /text.*/;
        //if (d.type.match(e)) {
        //    var fileReader = new FileReader;
        //    fileReader.onload = function (a) {
        //        fileDisplayAreaElement.text(fileReader.result)
        //    }, fileReader.readAsText(d, "CP1255")
        //} else fileDisplayAreaElement.innerText = "File not supported!"
            var fileReader = new FileReader;
            fileReader.onload = function (a) {
                fileDisplayAreaElement.text(fileReader.result)
            }, fileReader.readAsText(d, "CP1255")
    }
    var g,
        h = $("#" + props.importWindow).kendoWindow({
        width: "80%",
        height: "80%",
        modal: !0,
        visible: !1,
        resizable: !1,
        title: "ייבוא נתוני מעבדה",
        actions: ["Close"],
        close: function () { }
    }).data("kendoWindow"),
        progress = new ProgressIndicator({
            window: "#" + props.progresIndicator
        });
    this["import"] = function (b) {
        g = b, h.center().open();
        var fileInputElement = document.getElementById(props.fileInput),
            fileDisplayAreaElement = $("#" + props.fileDisplayArea);
        fileInputElement.addEventListener("change", setFileDisplayAreaText),
            $("#" + props.parse).one("click", function () {
            var fileDisplayAreaText = fileDisplayAreaElement.text(),
                serveyVal = $("#" + props.surveyId).val();
            return isNaN(serveyVal) || "" === serveyVal ? void alert("הסקר אינו מספר") : void d(serveyVal).then(function (pitsIds) {
                var pitsProps = {
                    PitIds: pitsIds,
                    ColumnsToLabelsTranslation: e(b),
                    MagikFileData: fileDisplayAreaText,
                    SurveyId: serveyVal
                };
                return $.isEmptyObject(pitsIds) ? void alert("לא מוגדרים לסקר בורות") : (progress.showProgress(),
                    void $.ajax({
                    type: "POST",
                    url: "/MagikImport",
                    data: pitsProps,
                    dataType: "json",
                    success: function (a) {
                        onSuccess(a),
                        h.close(),
                        fileInputElement.removeEventListener("change", setFileDisplayAreaText)
                    }
                }).fail(function (a) {
                    console.error(a)
                }).always(function () {
                    progress.hideProgress()
                }))
            })
        })
    }
}

function EditEventsProxy(formC, mapC) {
    var meshakimPick = formC.getMeshakimPicker(),
        plotsPick = formC.getPlotsPicker(),
        selectionMng = mapC.getSelectionManager(),
        extentMng = mapC.getExtentManager(),
        pitsPick = formC.getPitsPicker();
    meshakimPick.bind("change", function (a) {
        var b = $(this).val();
        extentMng.zoomToMeshakim(b), console.log("meshakim updated : " + b)
    }), $(plotsPick).on("plotsUpdated", function (a, b) {
        extentMng.zoomToPlots(b), selectionMng.selectPlots(b), console.log("plots updated : " + b), selectionMng.selectPits([])
    }), pitsPick.grid.bind("change", function (a) {
        var b = [],
            c = this;
        this.select().each(function () {
            b.push(c.dataItem(this).OBJECTID)
        }), selectionMng.selectPits(b), console.log("pits selected : " + b), extentMng.zoomToPits(b)
    }), pitsPick.grid.bind("change", function (a) {
        var b = [],
            c = this;
        this.select().each(function () {
            b.push(c.dataItem(this).OBJECTID)
        }), selectionMng.selectPits(b), console.log("pits selected : " + b)
    }), $("#loadingScreen").hide()
}
Utils = {
    cleanGuidFromObject: function (a) {
        for (var b in a) a.hasOwnProperty(b) && (b.includes("GlobalID") || b.includes("Guid")) && delete a[b]
    }
}, window.app = function () {
    var a = {
        debug: {
            attach: !1
        }
    };
    return a.config = {
            layerDefProvider: new LayerDefProvider
        }, require(["esri/map", "esri/layers/FeatureLayer", "esri/config", "dojo/on", "dojo/domReady!"], function (mapClass, featureLayerClass, dojoOnClass, domReadyClass) {
            dojoOnClass.defaults.io.proxyUrl = "/proxy/proxy.ashx", dojoOnClass.defaults.io.alwaysUseProxy = !1, a.map = new MapWindow({
                map: "map",
                reopen: "reopenMap",
                window: "mapWindow"
            }, mapClass);
            var f = a.config.layerDefProvider.getMapLayers(),
                featureLayersArr = _.map(f, function (a) {
                    return new featureLayerClass(a.url, {
                        mode: featureLayerClass.MODE_SNAPSHOT,
                        outFields: ["*"],
                        id: a.id
                    })
                });
            a.map.addLayers(featureLayersArr), domReadyClass.once("layers-add-result", function () {
                a.formControls = new EditFormControls(a.config.layerDefProvider),
                a.mapControls = new MapControls(a.map, a.config.layerDefProvider),
                a.eventsProxy = new EditEventsProxy(a.formControls, a.mapControls)
            })
        }), a
}();