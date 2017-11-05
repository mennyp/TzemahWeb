function EditPits(a, b, c) {
    "use strict";

    function d() {
        n.where = "", n.objectIds = ""
    }

    function e(a) {
        d(), n.where = 0 === a.length ? "0=1" : "", n.objectIds = a.join(","), o.trigger(p, [a])
    }

    function f() {
        o.trigger("pitsDisplayed", [
            [],
            []
        ]), o.trigger("hidden")
    }

    function g() {
        o.trigger("shown")
    }
    var h, i, j, k, l, m, n = {
        f: "json",
        token: window.token,
        outFields: "*",
        where: "0=1"
    },
        o = $(this);
    require(["esri/tasks/query", "esri/tasks/QueryTask", "esri/tasks/GeometryService", "esri/config"], function (a, c, d, e) {
        h = a, i = c, j = d, k = e, l = new j(b.getLayerUrlById("geoService")), k.defaults.geometryService = l
    });
    var p = "pitsSelectedEvent";
    Object.defineProperty(this, "grid", {
        get: function () {
            return m.data("kendoGrid")
        },
        enumerable: !0
    });
    var q = new kendo.data.DataSource({
        error: function (a) {
            console.log(a.errors)
        },
        transport: {
            read: {
                dataType: "json",
                url: b.getLayerUrlById("pits") + "/query",
                data: n,
                type: "POST"
            },
            create: {
                url: b.getLayerUrlById("pits") + "/addFeatures",
                type: "POST"
            },
            update: {
                url: b.getLayerUrlById("pits") + "/updateFeatures",
                type: "POST"
            },
            destroy: {
                url: b.getLayerUrlById("pits") + "/deleteFeatures",
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
                        attributes: a,
                        geometry: {
                            x: a.x,
                            y: a.y
                        }
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
            parse: function (a) {
                var b = [],
                    c = a.features;
                if ("string" == typeof a) return m.data("kendoGrid").dataSource.read(), [];
                for (var d = 0; d < c.length; d++) {
                    var e = {};
                    e.OBJECTID = c[d].attributes.OBJECTID, e.SurveyId = c[d].attributes.SurveyId, e.PitNumberInSurvey = c[d].attributes.PitNumberInSurvey, e.Conclusions = c[d].attributes.Conclusions, e.x = c[d].geometry.x, e.y = c[d].geometry.y, b.push(e)
                }
                return b
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
    m = $(a.table).kendoGrid({
        toolbar: ["create"],
        editable: "popup",
        dataSource: q,
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
    }), m.data("kendoGrid").thead.kendoTooltip({
        filter: "th",
        content: function (a) {
            var b = a.target;
            return $(b).text()
        }
    }), m.data("kendoGrid").bind("change", function () {
        var a = [],
            b = this;
        this.select().each(function () {
            a.push(b.dataItem(this).OBJECTID)
        }), o.trigger(p, [a])
    }), q.bind("change", function (a) {
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
                var d = new h;
                d.returnGeometry = !0, d.objectIds = a;
                var j = new i(b.getLayerUrlById("plots"));
                j.execute(d, function (a) {
                    var c = new h,
                        d = _.map(a.features, function (a) {
                            return a.geometry
                        });
                    l.union(d, function (a) {
                        c.geometry = a;
                        var d = new i(b.getLayerUrlById("pits"));
                        d.executeForIds(c, function (a) {
                            e(a), q.read()
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
            d(), n.where = 0 === b.length ? "0=1" : "SurveyId= " + b.join(" OR SurveyId="), q.read()
        })
    }, f()
}

function EditPlotsPicker(a, b, c) {
    var d = $(this),
        e = new kendo.data.DataSource({
            transport: {
                read: {
                    dataType: "json",
                    url: b.getLayerUrlById("plots") + "/query",
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
                    for (var b = [], c = a.features, d = 0; d < c.length; d++) {
                        var e = {};
                        e.OBJECTID = c[d].attributes.OBJECTID, e.ID_UNIQUE = c[d].attributes.ID_UNIQUE, e.PLOT_NO = c[d].attributes.PLOT_NO, e.hebName = c[d].attributes.hebName, e.settleCode = c[d].attributes.settleCode, b.push(e)
                    }
                    return b
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
        f = $(a.table).kendoGrid({
            height: 150,
            dataSource: e,
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
    $(".k-grid-clearSelection", a.table).bind("click", function (a) {
        f.data("kendoGrid").clearSelection()
    }), $(a.table).parents().resize(function () {
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
        }), f.trigger("shown")), e.filter({
            logic: "or",
            filters: c
        }), f.data(e).data("kendoGrid").refresh()
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

function EditSurveys(a, b, c) {
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

    function e(a, b) {
        var c = [],
            d = a.select();
        if (0 !== d.length) d.each(function () {
            c.push(a.dataItem(this)[b])
        });
        else {
            var e = [],
                f = a.dataSource.filter();
            if (!f) return c;
            _.map(f.filters, function (a) {
                return a.value
            }).sort();
            var g = _.difference(e, h).length + _.difference(h, e).length === 0;
            f.filters.length > 0 && !g && (h = e, _.each(a.dataSource.view(), function (a) {
                c.push(a[b])
            }))
        }
        return c
    }

    function f() {
        var a = g.data("kendoGrid"),
            b = e(a, "OBJECTID");
        b.length > 0 && $(this).trigger(i, [b])
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
                    url: b.getLayerUrlById("surveys") + "/query",
                    data: {
                        f: "json",
                        token: window.token,
                        outFields: "*",
                        where: "1=1"
                    },
                    type: "POST"
                },
                create: {
                    url: b.getLayerUrlById("surveys") + "/addFeatures",
                    type: "POST"
                },
                update: {
                    url: b.getLayerUrlById("surveys") + "/updateFeatures",
                    type: "POST"
                },
                destroy: {
                    url: b.getLayerUrlById("surveys") + "/deleteFeatures",
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
                    var b = [];
                    return a.features && (b = a.features), "string" == typeof a ? (g.data("kendoGrid").dataSource.read(), []) : _.map(b, function (a) {
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
    }), g = $(a.table).kendoGrid({
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

function AttachmentAddWindow(a, b, c) {
    function d() {
        g.show()
    } {
        var e = new ProgressIndicator({
            window: "#" + a.progresIndicator
        }),
            f = $("#" + a.window),
            g = $("#" + a.reopen).bind("click", function () {
                f.data("kendoWindow").open(), g.hide()
            }),
            h = {
                f: "json",
                token: window.token,
                outFields: "*",
                where: "0=1"
            },
            i = $("#" + a.attachFileInput),
            j = $("#" + a.selectionWindow).kendoWindow({
                width: "30%",
                height: "30%",
                visible: !1,
                modal: !0,
                title: "בחר קובץ",
                actions: ["Pin", "Minimize", "Maximize", "Close"],
                close: function () {
                    i.val(""), $("#" + a.surveyId).val("")
                }
            }).data("kendoWindow"),
            k = new kendo.data.DataSource({
                transport: {
                    read: function (a) {
                        $.ajax({
                            dataType: "json",
                            url: b.getLayerUrlById("surveyAttachments") + "/query",
                            data: h,
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
                            f: "json"
                        };
                        $.ajax({
                            url: b.getLayerUrlById("surveyAttachments") + "/deleteFeatures",
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
                        }).fail(function (a) {
                            console.error(a)
                        }).always(function () {
                            setTimeout(function () {
                                k.read()
                            }, 1e3)
                        })
                    }
                },
                schema: {
                    parse: function (a) {
                        return "string" == typeof a ? (k.data("kendoGrid").dataSource.read(), []) : _.map(a.features, function (a) {
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
        $("#" + a.listView).kendoListView({
            selectable: "single",
            dataSource: k,
            template: kendo.template($("#attachmentEditTemplate").html())
        }).data("kendoListView")
    }
    $("#" + a.fileInput).click(function (c) {
        function d() {
            i.replaceWith(i = i.clone(!0))
        }

        function f(c, f) {
            var g = this.files[0],
                h = $("#" + a.surveyId).val();
            if (isNaN(h) || "" === h) return d(), void alert("הסקר אינו מספר");
            e.showProgress();
            var i = new FileReader;
            i.onload = function (a) {
                e.showProgress(), $.ajax({
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
                    if ("OK" !== a.result) return e.hideProgress(), void alert("בעיה בשמירת הקובץ");
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
                        url: b.getLayerUrlById("surveyAttachments") + "/addFeatures",
                        type: "POST",
                        data: d
                    }).done(function (a) {
                        console.log(a), a = JSON.parse(a), alert(a.addResults[0].success ? "הקובץ נוסף בהצלחה" : "בעיה בהוספת הקובץ בטבלה\n" + a.addResults[0].error.description)
                    })
                }).fail(function (a) {
                    console.error(a), alert("בעיה בהוספת הקובץ")
                }).always(function () {
                    e.hideProgress(), d(), j.close(), setTimeout(function () {
                        k.read()
                    }, 1e3)
                })
            }, i.readAsDataURL(g)
        }
        j.center().open(), i.one("change", f)
    }), f.data("kendoWindow") || f.kendoWindow({
        width: "50%",
        height: "50%",
        visible: !1,
        position: {
            top: "26%"
        },
        title: "קבצים מקושרים",
        actions: ["Pin", "Minimize", "Maximize", "Close"],
        close: d
    }), $(c).on(c.updateEvent, function (a, b) {
        h.where = 0 === b.length ? "0=1" : "SurveyId= " + b.join(" OR SurveyId="), k.read()
    })
}

function DataTableEditor(a, b, c) {
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
                    url: a + "/query",
                    data: {
                        f: "json",
                        token: window.token,
                        outFields: "*",
                        where: "pitId=" + c.join(" OR pitId =")
                    },
                    type: "POST"
                },
                create: {
                    url: a + "/addFeatures",
                    type: "POST"
                },
                update: {
                    url: a + "/updateFeatures",
                    type: "POST"
                },
                destroy: {
                    url: a + "/deleteFeatures",
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

function EditFormControls(a) {
    var b = new MeshakimPicker("#meshakim", a),
        c = new EditPlotsPicker({
            table: "#plots"
        }, a, b),
        d = new EditPits({
            table: "#pits"
        }, a, c),
        e = new EditSurveys({
            table: "#surveys"
        }, a, d);
    d.setSurveyPicker(e);
    new FieldDataEditor({
        table: "#fieldData",
        frame: "#fieldDetailsPane"
    }, a, d, $("#verticalEdit").data("kendoSplitter")), new LabDataEditor({
        table: "#labData",
        frame: "#labDetailsPane"
    }, a, d, $("#verticalEdit").data("kendoSplitter")),
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
    }, a), new AttachmentAddWindow({
        window: "addAttachmentWindow",
        reopen: "addAttachment",
        listView: "attachListView",
        selectionWindow: "attachSelectionWindow",
        attachFileInput: "attachFileInput",
        surveyId: "surveyIdForAttach",
        fileInput: "attachAdd",
        progresIndicator: "hider"
    }, a, e);
    this.getMeshakimPicker = function () {
        return b
    }, this.getPlotsPicker = function () {
        return c
    }, this.getPitsPicker = function () {
        return d
    }
}

function FieldDataEditor(a, b, c, d) {
    "use strict";

    function e() {
        var e = {
            parse: function (a) {
                var b = a.features;
                if ("string" == typeof a) {
                    var c = JSON.parse(a);
                    return c = c[Object.keys(c)[0]][0], c.success || alert(c.error.description), h.readData(), []
                }
                return _.map(b, function (a) {
                    return a.attributes
                })
            },
            model: {
                id: "OBJECTID",
                fields: f.fields()
            }
        };
        h = new DataTableEditor(b.getLayerUrlById("fieldData"), e, a), d.bind("resize", h.resizeGrid), h.registerPitSelectionChannges(c, f, h, j)
    }
    var f, g, h, i = [],
        j = [],
        k = ["OBJECTID", "Guid", "GlobalID"];
    ! function () {
        var a = new kendo.data.DataSource({
            transport: {
                read: {
                    dataType: "json",
                    url: b.getLayerUrlById("fieldData"),
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
        a.fetch(function () {
            i = this.data(), f = new FieldsToGridConverter(i, k), e()
        })
    }(),
    function () {
        var a = new kendo.data.DataSource({
            transport: {
                read: {
                    dataType: "json",
                    url: b.getLayerUrlById("fieldDataTableColors") + "/query",
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
        a.fetch(function () {
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
    }(), d.bind("resize", function () {
        if (g) {
            var b = $(a.frame).height(),
                c = g.find(".k-grid-content"),
                d = g.find(".k-grid-header").height(),
                e = g.find(".k-grid-toolbar").height(),
                f = b - (e + d + 10);
            c.height(f), g.height(f)
        }
    })
}

function LabDataEditor(a, b, c, d) {
    "use strict";

    function e() {
        var e = {
            parse: function (a) {
                var b = a.features;
                if ("string" == typeof a) {
                    var c = JSON.parse(a);
                    return c = c[Object.keys(c)[0]][0], c.success || alert(c.error.description), g.readData(), []
                }
                return _.map(b, function (a) {
                    var b = a.attributes;
                    return b.RecievalDate = new Date(b.RecievalDate), b
                })
            },
            model: {
                id: "OBJECTID",
                fields: f.fields()
            }
        };
        g = new DataTableEditor(b.getLayerUrlById("labData"), e, a), d.bind("resize", g.resizeGrid), g.registerPitSelectionChannges(c, f, g, i)
    }
    var f, g, h = [],
        i = [],
        j = ["GlobalID", "Pits_GlobalID", "Guid", "Guid_2"];
    ! function () {
        var a = new kendo.data.DataSource({
            transport: {
                read: {
                    dataType: "json",
                    url: b.getLayerUrlById("labData"),
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
        a.fetch(function () {
            h = this.data(), f = new FieldsToGridConverter(h, j), e()
        })
    }(),
    function () {
        var a = new kendo.data.DataSource({
            transport: {
                read: {
                    dataType: "json",
                    url: b.getLayerUrlById("labDataRanges") + "/query",
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
        a.fetch(function () {
            i = this.data()
        })
    }()
}

function LabDataImport(a, b) {
    "use strict";

    function c() {
        m.show()
    }

    function d(a) {
        var c = [],
            d = h.data("kendoGrid").dataSource.data().toJSON();
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
            url: b.getLayerUrlById("labData") + "/addFeatures",
            data: e,
            dataType: "json",
            success: function (a) {
                var b = a.addResults[0].error;
                return b ? void alert(b.description) : a.addResults.length !== c.length ? void alert("ייתכן שלא כל הנתונים משנרו נא לוודא") : (h.data("kendoGrid").dataSource.data([]), void l.data("kendoWindow").close())
            }
        }).fail(function (a) {
            alert("הנתונים לא נשמרו במלואם - נא לוודא")
        })
    }

    function e() {
        var b = g.columns();
        b.unshift({
            command: ["edit", "destroy"],
            title: "פעולות",
            width: "200px"
        }), h = $(a.table).kendoGrid({
            toolbar: [{
                name: "import",
                text: "ייבא"
            }, {
                name: "saveToDb",
                text: "שמור"
            }],
            editable: "popup",
            pageSize: 50,
            height: .98 * $(a.frame).height(),
            sortable: {
                allowUnsort: !1
            },
            columnMenu: !0,
            columns: b,
            resizable: !0,
            dataBound: function () {
                var a = this.dataSource.data(),
                    b = this.columns,
                    c = new LabDataHighlighter(k, b);
                $.each(a, function (a, b) {
                    var d = $('tr[data-uid="' + b.uid + '"] td');
                    0 !== d.length && c.highlight(d)
                })
            }
        }), $(".k-grid-import", a.table).bind("click", function (a) {
            n["import"](g)
        }), $(".k-grid-saveToDb", a.table).bind("click", d)
    }

    function f() {
        i = {
            parse: function (a) {
                var b = a.features;
                return "string" == typeof a ? (h.data("kendoGrid").dataSource.read(), []) : _.map(b, function (a) {
                    var b = a.attributes;
                    return b.RecievalDate = new Date(b.RecievalDate), b
                })
            },
            model: {
                id: "OBJECTID",
                fields: g.fields()
            }
        }
    }
    var g, h, i, j = [],
        k = [],
        l = $("#" + a.window),
        m = $("#" + a.reopen).bind("click", function () {
            l.data("kendoWindow").open(), m.hide()
        }),
        n = new LabDataImportProcessManager(a, b),
        o = [, "Guid", "Guid_2"],
        p = function () {
            var a = new kendo.data.DataSource({
                transport: {
                    read: {
                        dataType: "json",
                        url: b.getLayerUrlById("labData"),
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
            return a.fetch(function () {
                j = this.data(), g = new FieldsToGridConverter(j, o), f()
            })
        }(),
        q = function () {
            var a = new kendo.data.DataSource({
                transport: {
                    read: {
                        dataType: "json",
                        url: b.getLayerUrlById("labDataRanges") + "/query",
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
            return a.fetch(function () {
                k = this.data()
            })
        }();
    $.when(q, p).then(function () {
        e()
    }), l.data("kendoWindow") || l.kendoWindow({
        width: "99%",
        height: "50%",
        visible: !1,
        position: {
            top: "26%"
        },
        title: "ייבוא נתוני מעבדה",
        actions: ["Pin", "Minimize", "Maximize", "Close"],
        close: c
    })
}

function LabDataImportProcessManager(a, b) {
    "use strict";

    function c(b) {
        if ("OK" !== b.status) return console.error(b), void alert("the file result came in bad");
        var c = [];
        _.each(b.result, function (a) {
            _.each(a.Properties, function (b, c) {
                a[c] = b
            }), delete a.Properties, _.each(g.columns(), function (b) {
                a.hasOwnProperty(b.field) || (a[b.field] = "")
            }), a.RecievalDate = new Date(moment(a.RecievalDate, "DD/M/YYYY").format()), c.push(a)
        }), $(a.table).data("kendoGrid").dataSource.data(c)
    }

    function d(a) {
        var c = new kendo.data.DataSource({
            transport: {
                read: {
                    dataType: "json",
                    url: b.getLayerUrlById("pits") + "/query",
                    data: {
                        f: "json",
                        token: window.token,
                        outFields: "*",
                        where: "surveyId = " + a
                    },
                    type: "POST"
                }
            },
            schema: {
                parse: function (a) {
                    for (var b = [], c = a.features, d = 0; d < c.length; d++) {
                        var e = {};
                        e.OBJECTID = c[d].attributes.OBJECTID, e.SurveyId = c[d].attributes.SurveyId, e.PitNumberInSurvey = c[d].attributes.PitNumberInSurvey, e.Conclusions = c[d].attributes.Conclusions, b.push(e)
                    }
                    return b
                }
            }
        }),
            d = new Promise(function (a, b) {
                c.read().then(function () {
                    var b = c.data(),
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

    function f(b) {
        var c = $("#" + a.fileDisplayArea),
            d = this.files[0],
            e = /text.*/;
        if (d.type.match(e)) {
            var f = new FileReader;
            f.onload = function (a) {
                c.text(f.result)
            }, f.readAsText(d, "CP1255")
        } else c.innerText = "File not supported!"
    }
    var g, h = $("#" + a.importWindow).kendoWindow({
        width: "80%",
        height: "80%",
        modal: !0,
        visible: !1,
        resizable: !1,
        title: "ייבוא נתוני מעבדה",
        actions: ["Close"],
        close: function () { }
    }).data("kendoWindow"),
        i = new ProgressIndicator({
            window: "#" + a.progresIndicator
        });
    this["import"] = function (b) {
        g = b, h.center().open();
        var j = document.getElementById(a.fileInput),
            k = $("#" + a.fileDisplayArea);
        j.addEventListener("change", f), $("#" + a.parse).one("click", function () {
            var g = k.text(),
                l = $("#" + a.surveyId).val();
            return isNaN(l) || "" === l ? void alert("הסקר אינו מספר") : void d(l).then(function (a) {
                var d = {
                    PitIds: a,
                    ColumnsToLabelsTranslation: e(b),
                    MagikFileData: g,
                    SurveyId: l
                };
                return $.isEmptyObject(a) ? void alert("לא מוגדרים לסקר בורות") : (i.showProgress(), void $.ajax({
                    type: "POST",
                    url: "/MagikImport",
                    data: d,
                    dataType: "json",
                    success: function (a) {
                        c(a), h.close(), j.removeEventListener("change", f)
                    }
                }).fail(function (a) {
                    console.error(a)
                }).always(function () {
                    i.hideProgress()
                }))
            })
        })
    }
}

function EditEventsProxy(a, b) {
    var c = a.getMeshakimPicker(),
        d = a.getPlotsPicker(),
        e = b.getSelectionManager(),
        f = b.getExtentManager(),
        g = a.getPitsPicker();
    c.bind("change", function (a) {
        var b = $(this).val();
        f.zoomToMeshakim(b), console.log("meshakim updated : " + b)
    }), $(d).on("plotsUpdated", function (a, b) {
        f.zoomToPlots(b), e.selectPlots(b), console.log("plots updated : " + b), e.selectPits([])
    }), g.grid.bind("change", function (a) {
        var b = [],
            c = this;
        this.select().each(function () {
            b.push(c.dataItem(this).OBJECTID)
        }), e.selectPits(b), console.log("pits selected : " + b), f.zoomToPits(b)
    }), g.grid.bind("change", function (a) {
        var b = [],
            c = this;
        this.select().each(function () {
            b.push(c.dataItem(this).OBJECTID)
        }), e.selectPits(b), console.log("pits selected : " + b)
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
    }, require(["esri/map", "esri/layers/FeatureLayer", "esri/config", "dojo/on", "dojo/domReady!"], function (b, c, d, e) {
        d.defaults.io.proxyUrl = "/proxy/proxy.ashx", d.defaults.io.alwaysUseProxy = !1, a.map = new MapWindow({
            map: "map",
            reopen: "reopenMap",
            window: "mapWindow"
        }, b);
        var f = a.config.layerDefProvider.getMapLayers(),
            g = _.map(f, function (a) {
                return new c(a.url, {
                    mode: c.MODE_SNAPSHOT,
                    outFields: ["*"],
                    id: a.id
                })
            });
        a.map.addLayers(g), e.once("layers-add-result", function () {
            a.formControls = new EditFormControls(a.config.layerDefProvider), a.mapControls = new MapControls(a.map, a.config.layerDefProvider), a.eventsProxy = new EditEventsProxy(a.formControls, a.mapControls)
        })
    }), a
}();