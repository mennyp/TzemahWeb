function FieldDataHighlighter(arr, myColumns) {
    this.highlight = function (rows) {
        rows.length !== myColumns.length && console.error("the lenght of the field dat columns " + myColumns.length + " and length of row " + rows.length);
        for (var d = 0; d < myColumns.length; d++) try {
            var e = myColumns[d].field,
                f = _.find(arr, function (a) {
                    return a.ElementName === e
                });
            if ("undefined" != typeof f) {
                var g = f.symbols[rows[d].innerText];
                "undefined" != typeof g && $(rows[d]).css("background-color", g)
            }
        } catch (h) {
            console.error(h.stack)
        }
    }
}

function LabDataHighlighter(a, columns) {
    var red = "red",
        yellow = "yellow",
        gainsboro = "Gainsboro";
    this.highlight = function (rows) {
        rows.length !== columns.length && console.error("the lenght of the field dat columns " + columns.length + " and length of row " + rows.length);
        for (var col = 0; col < columns.length; col++) try {
            var text = parseFloat(rows[col].innerText);
            if (isNaN(text)) continue;
            var fieldEl = columns[col].field,
                j = _.find(a, function (a) {
                    return a.ElementName === fieldEl
                });
            if ("undefined" != typeof j) {
                var k = null;
                text < j.Low && text > j.ErrorLow && (k = yellow), text > j.High && text < j.ErrorHigh && (k = red), (text < j.ErrorLow || text > j.ErrorHigh) && (k = gainsboro), null != k && $(rows[col]).css("background-color", k)
            }
        } catch (l) {
            console.error(l.stack)
        }
    }
}

function MapAndDataSplitter(props, pitsPick) {
    var mapDataSplitter = $(props.frame).kendoSplitter({
        orientation: "vertical",
        panes: [{
            collapsible: !1
        }, {
            collapsible: !0,
            resizable: !0,
            collapsed: !1,
            size: 240,
            min: 240
        }]
    }).data("kendoSplitter");
    return $(pitsPick).on("pitsDisplayed", function (b, d) {
        d.length > 0 ? (mapDataSplitter.expand(props.bottomPane), mapDataSplitter.trigger("expand")) : (mapDataSplitter.collapse(props.bottomPane), mapDataSplitter.trigger("collapse"))
    }), mapDataSplitter
}

function ProgressIndicator(props, miliSecVal) {
    miliSecVal || (miliSecVal = 6e4);
    var c = 400; 
    this.showProgress = function () {
        $(props.window).show(c), setTimeout(this.hideProgress, miliSecVal)
    }, this.hideProgress = function () {
        $(props.window).hide(c)
    }
}

function RangesLegend(props) {
    function b() {
        reOpen.show()
    }
    var win = $("#" + props.window),
        reOpen = $("#" + props.reopen).bind("click", function () {
            win.data("kendoWindow").open(), reOpen.hide()
        });
    win.data("kendoWindow") || win.kendoWindow({
        visible: !1,
        height: "800px",
        title: "מקרא טווחים",
        actions: ["Minimize", "Maximize", "Close"],
        close: b
    })
}

function ViewPlotsPicker(props, layerDefPro, meshakimPicker) {
    return new PlotsPicker(props, layerDefPro, meshakimPicker, {
        pageSize: 50,
        height: 300,
        resizable: !0,
        toolbar: [{
            name: "clearSelection",
            text: "נקה בחירה"
        }, {
            template: '<h5 style="display:inline;padding-right:40%">חלקות</h5>'
        }],
        selectable: "multiple",
        sortable: {
            allowUnsort: !1
        },
        columns: [{
            field: "OBJECTID",
            title: "OBJECTID",
            width: 10,
            hidden: !0
        }, {
            field: "ID_UNIQUE",
            title: "מזהה ייחודי",
            width: 20
        }, {
            field: "PLOT_NO",
            title: "מספר חלקה",
            width: 20
        }, {
            field: "hebName",
            title: "משק",
            width: 20,
            filterable: !0
        }]
    })
}

function AttachWindow(props, layerDefPro, surveyPick) {
    function onClose() {
        attachmentsButton.show()
    }

    function e(val) {
        queryData.where = 0 === val.length ? "0=1" : "SurveyId= " + val.join(" OR SurveyId=")
    }
    var attachWindow = $(props.window),
        attachmentsButton = $(props.reopenAttach).bind("click", function () {
            attachWindow.data("kendoWindow").open(), attachmentsButton.hide()
        }),
        queryData = {
            f: "json",
            token: window.token,
            outFields: "*",
            where: "0=1"
        };
    attachWindow.data("kendoWindow") || attachWindow.kendoWindow({
        width: "50%",
        title: "מסמכים מצורפים",
        visible: !1,
        actions: ["Pin", "Minimize", "Maximize", "Close"],
        close: onClose
    }); {
        var kendoDataSource = new kendo.data.DataSource({
            transport: {
                read: {
                    dataType: "json",
                    url: layerDefPro.getLayerUrlById("surveyAttachments") + "/query",
                    data: queryData,
                    type: "POST"
                }
            },
            schema: {
                parse: function (res) {
                    return _.map(res.features, function (feature) {
                        return feature.attributes
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
        $(props.listView).kendoListView({
            dataSource: kendoDataSource,
            template: kendo.template($("#imageAttachTemplate").html())
        })
    }
    $(surveyPick).on("surveyUpdated", function (a, val) {
        e(val), kendoDataSource.read()
        }),
        this.getAttachUrls = function () {
        return _.map($(props.window + " a"), function (a) {
            return $(a).attr("href")
        })
    }
}

function DepthSelector(props) {
    "use strict";
    var b = "depthChanged",
        c = $(this);
    Object.defineProperty(this, "depthChangedEvent", {
        get: function () {
            return b
        },
        enumerable: !0
    }), $(props.buttonGroup + " button").click(function (a) {
        $("button", this.parentElement).removeClass("active"), $(this).addClass("active");
        var d = $(this).attr("depth").split(",");
        d = "" === d[0] ? [] : d,
            c.trigger(b, [d])
    }), this.resetSelection = function () {
        $(props.buttonGroup + " button").removeClass("active")
    }
}

function FieldDataPicker(props, layerDefPro, pitsPick, depthSel, mapDataSplit) {
    "use strict";

    function f() {
        m = {
            parse: function (a) {
                var fieldsArr = [],
                    c = a.features;
                return fieldsArr = _.map(c, function (a) {
                    return a.attributes
                })
            },
            model: {
                id: "OBJECTID",
                fields: l.fields()
            }
        }
    }

    function g(b) {
        n = $(props.table).kendoGrid({
            toolbar: [{
                template: '<h5 style="display:inline;padding-right:40%">נתוני שדה</h5>'
            }],
            dataSource: b,
            height: 200,
            sortable: {
                allowUnsort: !1
            },
            scrollable: !0,
            selectable: "multiple",
            columnMenu: !0,
            filterable: !0,
            columns: l.columns(),
            resizable: !0,
            dataBound: function () {
                var myData = this.dataSource.data(),
                    myColumns = this.columns,
                    fieldDataHighlight = new FieldDataHighlighter(q, myColumns);
                $.each(myData, function (a, b) {
                    var d = $('tr[data-uid="' + b.uid + '"] td');
                    0 !== d.length && fieldDataHighlight.highlight(d)
                })
            }
        }), n.data("kendoGrid").thead.kendoTooltip({
            filter: "th",
            content: function (a) {
                var b = a.target;
                return $(b).text()
            }
        })
    }

    function h(a) {
        var c = new kendo.data.DataSource({
            transport: {
                read: {
                    dataType: "json",
                    url: layerDefPro.getLayerUrlById("fieldData") + "/query",
                    data: {
                        f: "json",
                        outFields: "*",
                        token: window.token,
                        where: "pitId=" + a.join(" OR pitId =")
                    },
                    type: "POST"
                }
            },
            schema: m
        });
        return c
    }

    function i() {
        var a = new kendo.data.DataSource({
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
        a.fetch(function () {
            p = this.data(), l = new FieldsToGridConverter(p, r),
                f()
        })
    }

    function j() {
        var a = new kendo.data.DataSource({
            transport: {
                read: {
                    dataType: "json",
                    url: layerDefPro.getLayerUrlById("fieldDataTableColors") + "/query",
                    data: {
                        f: "json",
                        token: window.token,
                        outFields: "*",
                        where: "1=1"
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
                q = _.map(this.data(), function (a) {
                    return {
                        ElementName: a.ElementName,
                        symbols: JSON.parse(a.ColorJson)
                    }
                })
            } catch (a) {
                console.log(a)
            }
        })
    }

    function k(a) {
        var b = _.map(a.view(), function (a) {
            return a.PitId
        }),
            c = _.uniq(b);
        return c
    }
    var l, m, n, o, p = [],
        q = [],
        r = ["OBJECTID", "Guid", "GlobalID"],
        s = this;
    mapDataSplit.bind("resize", function () {
        if (n) {
            var b = $(props.frame).height(),
                c = n.find(".k-grid-content"),
                d = n.find(".k-grid-content-locked"),
                e = n.find(".k-grid-header").height(),
                f = b - (e + 10);
            c.height(f), d.height(f), n.height(f)
        }
    }), $(depthSel).on(depthSel.depthChangedEvent, function (a, b) {
        var c = _.map(b, function (a) {
            return {
                field: "DepthId",
                operator: "eq",
                value: parseInt(a)
            }
        });
        o.filter({
            logic: "or",
            filters: c
        }), n.data(o).data("kendoGrid").refresh()
    }), $(pitsPick).on("pitsDisplayed", function (a, b) {
        console.debug("fieldData sees unique pits : " + b.length + " | " + b.join(",")), b.length > 0 && "undefined" != typeof l && (n ? (o.transport.options.read.data.where = "pitId=" + b.join(" OR pitId ="), o.read()) : (o = h(b), g(o)), o.bind("change", function (a) {
            var b = k(this);
            $(s).trigger("pitsUpdated", [b])
        }))
    }), this.getDisplayedPits = function () {
        return k(o)
    }, this.resize = function () {
        n && n.data("kendoGrid").resize()
    }, this.getElementValues = function (a) {
        return _.map(o.view(), function (b) {
            return {
                elementValue: b[a],
                PitId: b.PitId,
                DepthId: b.DepthId
            }
        })
    }, Object.defineProperty(this, "isFiltered", {
        get: function () {
            return o && o.filter() && null !== o.filter()
        }
    }), Object.defineProperty(this, "grid", {
        get: function () {
            return n.data("kendoGrid")
        }
    }), i(), j()
}

function FieldsToGridConverter(esriFieldArr, fields) {
    "use strict";

    function getTypeByEsriFieldType(esriFieldType) {
        switch (esriFieldType) {
            case "esriFieldTypeInteger":
            case "esriFieldTypeSmallInteger":
            case "esriFieldTypeSingle":
            case "esriFieldTypeOID":
                return "number";
            case "esriFieldTypeString":
            case "esriFieldTypeGUID":
                return "string";
            case "esriFieldTypeDate":
                return "date";
            default:
                return "string"
        }
    }

    function getWidthByFieldType(esriField) {
        if ("DepthFrom" === esriField.name) return 60;
        if ("PitId" === esriField.name) return 70;
        if ("DepthId" === esriField.name || "DepthTo" === esriField.name) return 80;
        var b = getTypeByEsriFieldType(esriField.type);
        return "number" === b ? 100 : "date" === b ? 60 : "string" === b ? esriField.hasOwnProperty("length") ? esriField.length : 100 : 60
    }

    function e(a, b) {
        "esriFieldTypeDate" === b.type && (a.format = "{0:d}")
    }
    this.fields = function () {
        var b = {};
        return _.each(esriFieldArr, function (a) {
            b[a.name] = {
                type: getTypeByEsriFieldType(a.type),
                editable: a.editable
            }
        }), b
    }, this.columns = function () {
        var c = [];
        return _.each(esriFieldArr, function (esriField) {
            var f = {
                title: esriField.alias,
                field: esriField.name,
                width: getWidthByFieldType(esriField)
            };
            ("DepthId" === esriField.name || "DepthTo" === esriField.name || "DepthFrom" === esriField.name || "PitId" === esriField.name) && (f.locked = !0), "undefined" != typeof fields && fields.indexOf(esriField.name) > -1 && (f.hidden = !0), null != esriField.domain && "codedValue" === esriField.domain.type && (f.values = _.map(esriField.domain.codedValues, function (a) {
                return {
                    text: a.name,
                    value: a.code
                }
            })), null != esriField.domain && "range" === esriField.domain.type && (f.template = function (b) {
                var c = -1 === b[esriField.name] ? "" : b[esriField.name];
                return c
            }), e(f, esriField), c.push(f)
        }), c
    }
}

function LabAndFieldCoordinator() {
    var a, b;
    Object.defineProperty(this, "currentPits", {
        get: function () {
            return _.intersection(a, b)
        }
    }), this.fieldDataUpdated = function (a) {
        b = a
    }, this.labDataUpdated = function (b) {
        a = b
    }
}

function LabDataPicker(props, layerDefPro, pitsPick, depthSel, mapDataSplit) {
    function f(b) {
        $(p).trigger("dataUpdated"), k = $(props.table).kendoGrid({
            toolbar: [{
                template: '<h5 style="display:inline;padding-right:40%">נתוני מעבדה</h5>'
            }],
            dataSource: b,
            height: 200,
            sortable: {
                allowUnsort: !1
            },
            filterable: !0,
            scrollable: !0,
            selectable: "multiple",
            columnMenu: !0,
            columns: j.columns(),
            resizable: !0,
            dataBound: function () {
                var a = this.dataSource.data(),
                    b = this.columns,
                    c = new LabDataHighlighter(returnAttData, b);
                $.each(a, function (a, b) {
                    var d = $('tr[data-uid="' + b.uid + '"] td');
                    0 !== d.length && c.highlight(d)
                })
            }
        }), k.data("kendoGrid").thead.kendoTooltip({
            filter: "th",
            content: function (a) {
                var b = a.target;
                return $(b).text()
            }
        })
    }

    function g(a) {
        var c = new kendo.data.DataSource({
            transport: {
                read: {
                    dataType: "json",
                    url: layerDefPro.getLayerUrlById("labData") + "/query",
                    data: {
                        f: "json",
                        token: window.token,
                        outFields: "*",
                        where: "PitId=" + a.join(" OR PitId =")
                    },
                    type: "POST"
                }
            },
            schema: m
        });
        return c
    }

    function h() {
        m = {
            parse: function (a) {
                var fieldsArr = [],
                    c = a.features;
                return fieldsArr = _.map(c, function (a) {
                    var att = a.attributes;
                    att.RecievalDate = new Date(att.RecievalDate);
                    att.DigumDate = new Date(att.DigumDate);
                    att.FinishedDate = new Date(att.FinishedDate);
                    return att;
                })
            },
            model: {
                id: "OBJECTID",
                fields: j.fields()
            }
        }
    }

    function i(a) {
        var b = _.map(a.view(), function (a) {
            return a.PitId
        }),
            c = _.uniq(b);
        return c
    }
    var j, k, l, m, returnFieldsData = [],
        returnAttData = [],
        p = this,
        fieldArr = ["OBJECTID", "MagikFileId", "SurveyId", "JOBID", "SAMPLEID", "Megadel", "Gidul", "Variety", "RecievalDate", "GlobalID", "Pits_GlobalID", "Guid", "Guid_2"];
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
            returnFieldsData = this.data(),
                j = new FieldsToGridConverter(returnFieldsData, fieldArr),
                h()
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
                    return _.map(a.features, function (a) {
                        return a.attributes
                    })
                }
            }
        });
        dataSource.fetch(function () {
            returnAttData = this.data()
        })
    }(),
        mapDataSplit.bind("resize", function () {
        if (k) {
            var b = $(props.frame).height(),
                c = k.find(".k-grid-content"),
                d = k.find(".k-grid-content-locked"),
                e = k.find(".k-grid-header").height(),
                f = b - (e + 10);
            c.height(f), d.height(f), k.height(f)
        }
    }), $(pitsPick).on("pitsDisplayed", function (a, b) {
        console.debug("labData sees unique pits : " + b.length + " | " + b.join(",")), b.length > 0 && "undefined" != typeof j && (k ? (l.transport.options.read.data.where = "pitId=" + b.join(" OR pitId ="), l.read()) : (l = g(b), f(l)), l.bind("change", function (a) {
            var b = i(this);
            $(p).trigger("pitsUpdated", [b])
        }))
    }), $(depthSel).on(depthSel.depthChangedEvent, function (a, b) {
        var dataSource = k.data("kendoGrid").dataSource,
            d = _.map(b, function (a) {
                return {
                    field: "DepthId",
                    operator: "eq",
                    value: parseInt(a)
                }
            });
        dataSource.filter({
            logic: "or",
            filters: d
        }),
            k.data(dataSource).data("kendoGrid").refresh()
    }), this.getDisplayedPits = function () {
        return i(l)
    }, this.resize = function () {
        k && k.data("kendoGrid").resize()
    }, this.getElementValues = function (a) {
        return _.map(l.view(), function (b) {
            return {
                elementValue: b[a],
                PitId: b.PitId,
                DepthId: b.DepthId
            }
        })
    }, Object.defineProperty(this, "isFiltered", {
        get: function () {
            return l && l.filter() && null !== l.filter()
        }
    }), Object.defineProperty(this, "grid", {
        get: function () {
            return k.data("kendoGrid")
        }
    })
}

function MapWindow(props, mapClass) {
    function showReopen() {
        reOpen.show()
    }

    function d() {
        $("#" + props.map).height("100%"), $("#" + props.map).width("100%"), map.resize(), map.reposition()
    }
    var win = $("#" + props.window),
        reOpen = $("#" + props.reopen).bind("click", function () {
            win.data("kendoWindow").open(), reOpen.hide()
        });
    win.data("kendoWindow") || win.kendoWindow({
        width: "50%",
        height: "50%",
        visible: !1,
        position: {
            top: "46%"
        },
        title: "מפה",
        actions: ["Pin", "Minimize", "Maximize", "Close"],
        close: showReopen
    });
    var map = new mapClass(props.map, {
        center: [35.587, 32.719],
        zoom: 13,
        basemap: "satellite",
        autoResize: !0,
        fadeOnZoom: !0,
        logo: !1,
        showLabels: !0,
        spatialReference: {
            wkid: 2039
        }
    });
    return win.data("kendoWindow").bind("resize", d), win.data("kendoWindow").bind("open", d), map
}

function MeshakimPicker(mshkimTag, layerDefPro) {
    return $(mshkimTag).kendoMultiSelect({
        dataTextField: "hebName",
        dataValueField: "settleCode",
        dataSource: {
            transport: {
                read: {
                    dataType: "json",
                    url: layerDefPro.getLayerUrlById("meshakim") + "/query",
                    data: {
                        f: "json",
                        token: window.token,
                        outFields: "*",
                        where: "1=1"
                    },
                    type: "POST"
                }
            },
            schema: {
                parse: function (a) {
                    for (var fieldsArr = [], c = a.features, d = 0; d < c.length; d++) {
                        var e = {};
                        e.OBJECTID = c[d].attributes.OBJECTID,
                        e.lamasCode = c[d].attributes.lamasCode,
                        e.engName = c[d].attributes.engName,
                        e.hebName = c[d].attributes.hebName,
                        e.settleCode = c[d].attributes.settleCode,
                        fieldsArr.push(e)
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
                        lamasCode: {
                            type: "string"
                        },
                        engName: {
                            type: "string"
                        },
                        hebName: {
                            type: "string"
                        },
                        settleCode: {
                            type: "number"
                        }
                    }
                }
            }
        }
    })
}

function PitsPicker(props, layerDefPro, viewPlotPick) {
    "use strict";

    function getOIds(a) {
        var b = _.map(a.view(), function (a) {
            return a.OBJECTID
        }),
            c = _.uniq(b);
        return c
    }

    function gridHide() {
        $(n).trigger("pitsDisplayed", [
            [],
            []
        ]), $(n).trigger("hidden"), kenGrid.hide()
    }

    function gridShow() {
        $(n).trigger("shown"), kenGrid.show()
    }

    function setWhereProp(a) {
        dataProps.where = 0 === a.length ? "0=1" : "", dataProps.objectIds = a.join(","), $(n).trigger(p, [a])
    }
    var features, queryClass, QueryTaskClass, GeometryServiceClass, configClass, geoService, n = this,
        dataProps = {
            f: "json",
            token: window.token,
            outFields: "*",
            where: "0=1"
        };
    require(["esri/tasks/query", "esri/tasks/QueryTask", "esri/tasks/GeometryService", "esri/config"], function (a, c, d, e) {
        queryClass = a, QueryTaskClass = c, GeometryServiceClass = d, configClass = e,
            geoService = new GeometryServiceClass(layerDefPro.getLayerUrlById("geoService")),
            configClass.defaults.geometryService = geoService
    });
    var p = "pitsUpdatedEvent",
        dataSource = new kendo.data.DataSource({
            transport: {
                read: {
                    dataType: "json",
                    url: layerDefPro.getLayerUrlById("pits") + "/query",
                    data: dataProps,
                    type: "POST"
                }
            },
            schema: {
                parse: function (a) {
                    return features = a.features, _.map(features, function (a) {
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
                        PitNumberInSurvey: {
                            type: "string"
                        },
                        LegBorID: {
                            type: "number"
                        },
                        Conclusions: {
                            type: "string"
                        }
                    }
                }
            }
        }),
        kenGrid = $(props.pitsTable).kendoGrid({
            dataSource: dataSource,
            height: 200,
            sortable: {
                allowUnsort: !1
            },
            toolbar: [{
                name: "clearSelection",
                text: "נקה בחירה"
            }, {
                template: '<h5 style="display:inline;padding-right:40%">בורות</h5>'
            }],
            selectable: "multiple",
            columnMenu: !0,
            resizable: !0,
            columns: [{
                field: "OBJECTID",
                title: "מס בור",
                hidden: !1
            }, {
                field: "SurveyId",
                title: "מס סקר",
                filterable: !0
            }, {
                field: "PitNumberInSurvey",
                title: "מס בור בסקר"
            }, {
                field: "LegBorID",
                title: "מס הסטורי"
            }, {
                field: "Conclusions",
                title: "הערות"
            }]
        });
    $(".k-grid-clearSelection", props.pitsTable).bind("click", function (a) {
        kenGrid.data("kendoGrid").clearSelection()
    }), $(viewPlotPick).on("plotsUpdated", function (a, objectIdsArr) {
        if (0 === objectIdsArr.length) gridHide();
        else {
            console.log("plots selected :" + objectIdsArr.length);
            try {
                var query = new queryClass;
                query.returnGeometry = !0, query.objectIds = objectIdsArr;
                var queryTask = new QueryTaskClass(layerDefPro.getLayerUrlById("plots"));
                queryTask.execute(query, function (a) {
                    var query = new queryClass,
                        geoArr = _.map(a.features, function (a) {
                            return a.geometry
                        });
                    geoService.union(geoArr, function (a) {
                        query.geometry = a;
                        var queryTask = new QueryTaskClass(layerDefPro.getLayerUrlById("pits"));
                        queryTask.executeForIds(query, function (a) {
                            setWhereProp(a), dataSource.read()
                        })
                    })
                })
            } catch (a) {
                console.log("could not query pits :" + a)
            }
            gridShow()
        }
    }), $(viewPlotPick).on("shown", function () {
        console.debug("plots shown")
    }), $(viewPlotPick).on("hidden", function () {
        gridHide()
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
        $(n).trigger("pitsDisplayed", [b, c])
    }), this.selectedOnMap = function (a) {
        0 === a.length ? gridHide() : (setWhereProp(a), dataSource.read(), gridShow())
    }, this.getDisplayedPits = function () {
        return getOIds(kenGrid.data("kendoGrid").dataSource)
    }, Object.defineProperty(this, "grid", {
        get: function () {
            return kenGrid.data("kendoGrid")
        }
    }), Object.defineProperty(this, "pits", {
        get: function () {
            return features
        }
    })
}

function PlotsPicker(props, layerDefPro, meshakimPicker, dataInfoForGrid) {
    function e() {
        g.trigger("hidden"), i.hide()
    }

    function f() {
        g.trigger("shown"), i.show()
    }
    var g = $(this),
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
            sort: {
                field: "PLOT_NO",
                dir: "asc"
            },
            filter: {
                field: "settleCode",
                operator: "eq",
                value: 26
            },
            schema: {
                parse: function (a) {
                    for (var fieldsArr = [], c = a.features, d = 0; d < c.length; d++) {
                        var e = {};
                        e.OBJECTID = c[d].attributes.OBJECTID,
                        e.ID_UNIQUE = c[d].attributes.ID_UNIQUE,
                        e.PLOT_NO = c[d].attributes.PLOT_NO,
                        e.hebName = c[d].attributes.hebName,
                        e.settleCode = c[d].attributes.settleCode,
                        fieldsArr.push(e)
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
        });
    dataInfoForGrid.dataSource = dataSource;
    var i = $(props.plotTable).kendoGrid(dataInfoForGrid);
    $(".k-grid-clearSelection", props.plotTable).bind("click", function (a) {
        i.data("kendoGrid").clearSelection()
    }), this.selectedOnMap = function (a) {
        if (0 === a.length) e();
        else {
            f();
            var b = _.map(a, function (a) {
                return {
                    field: "OBJECTID",
                    operator: "eq",
                    value: parseInt(a)
                }
            });
            dataSource.filter({
                logic: "or",
                filters: b
            }), i.data(dataSource).data("kendoGrid").refresh();
            var c = _.map(dataSource.view(), function (a) {
                return a.OBJECTID
            });
            g.trigger("plotsUpdated", [c])
        }
    }, Object.defineProperty(this, "grid", {
        get: function () {
            return i.data("kendoGrid")
        }
    }), meshakimPicker.bind("change", function (a) {
        var b = $(this).val();
        if (null == b) e();
        else {
            var c = _.map(b, function (a) {
                return {
                    field: "settleCode",
                    operator: "eq",
                    value: parseInt(a)
                }
            });
            dataSource.filter({
                logic: "or",
                filters: c
            }), i.data(dataSource).data("kendoGrid").refresh(), f()
        }
    }), this.grid.bind("change", function (a) {
        var b = [],
            c = this;
        this.select().each(function () {
            b.push(c.dataItem(this).OBJECTID)
        }), g.trigger("plotsUpdated", [b])
    })
}

function QueriesBuilderWindow(a, b) {
    function c() {
        e.show()
    }
    var d = $(a.window),
        e = $(a.reopenAttach).bind("click", function () {
            d.data("kendoWindow").open(), e.hide()
        }),
        f = new kendo.data.DataSource({
            transport: {
                read: {
                    dataType: "json",
                    url: b.getLayerUrlById("fieldData"),
                    data: {
                        f: "pjson"
                    },
                    type: "GET"
                }
            },
            schema: {
                parse: function (a) {
                    return a.fields
                }
            }
        }),
        g = ["OBJECTID", "PitId", "DepthId", "DepthFrom", "DepthTo"];
    f.fetch(function () {
        var b = this.data(),
            c = _.reject(b, function (a) {
                return !g || -1 !== g.indexOf(a.name)
            });
        $(a.fieldQueries.query1).queryPicker({
            elementsData: c
        }), $(a.fieldQueries.query2).queryPicker({
            elementsData: c
        }), $(a.fieldQueries.query3).queryPicker({
            elementsData: c
        })
    });
    var h = ["OBJECTID", "MagikFileId", "SurveyId", "JOBID", "SAMPLEID", "Megadel", "Gidul", "Variety", "RecievalDate", "PitId", "DepthId", "DepthFrom", "DepthTo", "SampleRemark"],
        i = new kendo.data.DataSource({
            transport: {
                read: {
                    dataType: "json",
                    url: b.getLayerUrlById("labData"),
                    data: {
                        f: "pjson"
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
    i.fetch(function () {
        var b = this.data(),
            c = _.reject(b, function (a) {
                return !h || -1 !== h.indexOf(a.name)
            });
        $(a.labQueries.query1).queryPicker({
            elementsData: c
        }), $(a.labQueries.query2).queryPicker({
            elementsData: c
        }), $(a.labQueries.query3).queryPicker({
            elementsData: c
        })
    }), d.data("kendoWindow") || d.kendoWindow({
        visible: !1,
        width: "880px",
        title: "בניית שאילתות",
        actions: ["Minimize", "Maximize", "Close"],
        close: c
    }), $(a.splitter).kendoSplitter({
        panes: [{
            collapsible: !0,
            min: "420px"
        }, {
            collapsible: !0,
            size: "50%",
            min: "400px"
        }]
    }).data("kendoSplitter")
}

function ReportGenerator(props, printer) {
    function setClass() {
        var a = this.checked,
            b = $(this).closest("tr");
        a ? b.addClass("k-state-selected") : b.removeClass("k-state-selected")
    }

    function getRGBbyRegAxe(a) {
        var b = a.match(/^rgba\((\d+),\s*(\d+),\s*(\d+),\s*(\d+)\)$/);
        return b || (b = a.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/)), b ? {
            Red: b[1],
            Green: b[2],
            Blue: b[3]
        } : {
            Red: 0,
            Green: 0,
            Blue: 0
        }
    }

    function e(a) {
        var b = [];
        _.each(a.dataItems(), function (c) {
            for (var e = [], f = $('tr[data-uid="' + c.uid + '"] td'), g = 0; g < a.columns.length; g++) {
                var h = a.columns[g];
                if (!h.hidden) {
                    var i = c[h.field];
                    if (h.values) {
                        var j = _.find(h.values, function (a) {
                            return a.value === i
                        });
                        j && (i = j.text)
                    } ("-" === i || -1 === i) && (i = ""), e.push({
                        Value: i,
                        Color: getRGBbyRegAxe($(f[g]).css("background-color"))
                    })
                }
            }
            b.push(e)
        });
        var c = [];
        return _.each(a.columns, function (a) {
            a.hidden || c.push(a.title)
        }), {
            Header: c,
            TableData: b
        }
    }

    function f() {
        var a = {};
        return _.each(kenGrid.tbody.find("input:checked").closest("tr"), function (b) {
            var c = kenGrid.dataItem(b);
            a[c.Value] = !0
        }), a
    }

    function generateReportService(data) {
        progress.showProgress(), $.ajax({
            type: "POST",
            url: "/Report/Generate",
            data: data,
            dataType: "application/json"
        }).done(function (a) {
            console.log("done"), console.dir(a)
        }).fail(function (a) {
            a = JSON.parse(a.responseText), console.dir(a)
        }).always(function () {
            progress.hideProgress(), window.open("/Report/getreport", "_blank")
        })
    }

    function h() {
        var c = f(),
            reportServiceData = {};
        if (c.pitDetails && (reportServiceData.PitsTable = e(props.pitsPicker.grid)),
            c.labData && (reportServiceData.LabDataTable = e(props.labDataPicker.grid)),
            c.fieldData && (reportServiceData.FieldDataTable = e(props.fieldDataPicker.grid)),
            c.attachFiles && (reportServiceData.AttachUrls = props.attachWindow.getAttachUrls()),
                c.map) {
            var h = printer.on("print-complete", function (a) {
                h.remove(), reportServiceData.ImageUrl = a.result.url, generateReportService(reportServiceData)
            });
            printMap()
        } else generateReportService(reportServiceData)
    }

    function printMap() {
        progress.showProgress();
        var a = new PrintTemplateClass;
        a.label = "A4 Landscape", a.format = "JPG", a.layout = "A4 Landscape", a.layoutOptions = {
            titleText: "סקר קרקע",
            authorText: "צמח נסיונות",
            copyrightText: "צמח נסיונות",
            scalebarUnit: "Meters"
        }, printer.printMap(a)
    } {
        var PrintTemplateClass,
            k = $("#" + props.window),
            l = $("#" + props.reopen).bind("click", function () {
                k.data("kendoWindow").center().open(), l.hide()
            }),
            progress = new ProgressIndicator({
                window: "#" + props.progresIndicator
            }, 22e4);
        $("#" + props.window).kendoWindow({
            width: "80%",
            height: "80%",
            visible: !1,
            modal: !0,
            title: "בחר רכיבי דוח",
            actions: ["Minimize", "Maximize", "Close"],
            close: function () {
                l.show()
            },
            open: function () {
                this.center(), $("#" + props.mapImage).attr("src", "/images/placeholder.jpg")
            }
        }).data("kendoWindow")
    }
    require(["esri/tasks/PrintTemplate"], function (a) {
        PrintTemplateClass = a
    });
    var kenGrid = $("#" + props.grid).kendoGrid({
        toolbar: [{
            name: "createReport",
            text: "צור דוח"
        }, {
            name: "generateMap",
            text: "תצוגת מפה"
        }],
        dataSource: [{
            Part: "מפה",
            Value: "map"
        }, {
            Part: "פרטי בורות",
            Value: "pitDetails"
        }, {
            Part: "נתוני מעבדה",
            Value: "labData"
        }, {
            Part: "נתוני שדה",
            Value: "fieldData"
        }, {
            Part: "קבצים מצורפים",
            Value: "attachFiles"
        }],
        scrollable: !0,
        columns: [{
            template: "<input type='checkbox' class='checkbox'  checked='checked'/>",
            width: 30,
            title: "attach"
        }, {
            field: "Part",
            title: "Part"
        }]
    }).data("kendoGrid");
    $(".k-grid-createReport", kenGrid.element).bind("click", h), $(".k-grid-generateMap", kenGrid.element).bind("click", printMap), kenGrid.table.on("click", ".checkbox", setClass), printer.on("print-complete", function (b) {
        progress.hideProgress(), $("#" + props.mapImage).attr("src", b.result.url)
    }), $(props.grid + " .k-grid .k-grid-header").hide()
}

function SurveysPicker(props, layerDefPro, pitsPick) {
    "use strict";

    function hideGrid() {
        kenGrid.trigger("hidden"), kenGrid.hide()
    }

    function showGrid() {
        kenGrid.trigger("shown"), kenGrid.show()
    }

    function getObjIdArr(a, b) {
        var c = [],
            d = a.select();
        return 0 !== d.length ? d.each(function () {
            c.push(a.dataItem(this)[b])
        }) : _.each(a.dataSource.view(), function (a) {
            c.push(a[b])
        }), c
    }

    function runSurveyUpdated() {
        var a = kenGrid.data("kendoGrid"),
            b = getObjIdArr(a, "OBJECTID");
        $(this).trigger("surveyUpdated", [b])
    }

    function UpdateDataSourceFilter(objIds) {
        if (0 === objIds.length) hideGrid();
        else {
            console.log("pits selected :" + objIds.length);
            try {
                var b = _.map(objIds, function (a) {
                    return {
                        field: "OBJECTID",
                        operator: "eq",
                        value: parseInt(a)
                    }
                });
                dataSource.filter({
                    logic: "or",
                    filters: b
                }), kenGrid.data(dataSource).data("kendoGrid").refresh()
            } catch (c) {
                console.log("could not query pits :" + c)
            }
            showGrid()
        }
    }
    var dataSource = new kendo.data.DataSource({
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
            }
        },
        filter: {
            field: "OBJECTID",
            operator: "eq",
            value: 0
        },
        schema: {
            parse: function (a) {
                var features = a.features;
                return _.map(features, function (a) {
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
    }),
        kenGrid = $(props.table).kendoGrid({
            dataSource: dataSource,
            toolbar: [{
                name: "clearSelection",
                text: "נקה בחירה"
            }, {
                template: '<h5 style="display:inline;padding-right:40%">סקרים</h5>'
            }],
            pageSize: 50,
            height: "10em",
            sortable: {
                allowUnsort: !1
            },
            selectable: "multiple",
            resizable: !0,
            columnMenu: !0,
            columns: [{
                field: "OBJECTID",
                title: "מס סקר"
            }, {
                field: "Name",
                title: "שם סקר"
            }, {
                field: "Date",
                title: "תאריך",
                format: "{0:d}"
            }, {
                field: "Comment",
                title: "הערות"
            }]
        });
    $(".k-grid-clearSelection", props.table).bind("click", function (a) {
        kenGrid.data("kendoGrid").clearSelection()
    }), $(pitsPick).on("shown", function () {
        showGrid()
    }), $(pitsPick).on("hidden", function () {
        hideGrid()
    }), pitsPick.grid.bind("change", function () {
        var a = this,
            b = getObjIdArr(a, "SurveyId");
        UpdateDataSourceFilter(b)
    }), $(pitsPick).on("pitsDisplayed", function (a, b, c) {
        UpdateDataSourceFilter(c)
    }), kenGrid.data("kendoGrid").bind("change", runSurveyUpdated.bind(this)), kenGrid.data("kendoGrid").dataSource.bind("change", runSurveyUpdated.bind(this))
}

function SymbologySelector(props, dataSource, dataPick) {
    var e = this,
        f = $("#" + props.dropDown).kendoDropDownList({
            dataTextField: "alias",
            dataValueField: "name",
            dataSource: dataSource
        }).data("kendoDropDownList");
    return f.bind("change", function () {
        var a = this.dataItem(this.selectedIndex),
            b = dataPick.getElementValues(a.name);
        $(e).trigger("symbologyElementSelected", [{
            elementValues: b,
            name: a.name,
            alias: a.alias
        }])
    }), $(e)
}

function Legend(map, name) {
    function legendRefresh() {
        clearTimeout(e), e = setTimeout(function () {
            legend && legend.refresh()
        }, 500)
    }
    var legend, e;
    require(["esri/dijit/Legend", "dojo/_base/array"], function (legendClass, arrayClass) {
        legend = new legendClass({
            map: map
        }, name), legend.startup(), map.on("layers-add-result,layer-add-result", legendRefresh)
    }), this.refresh = function () {
        legendRefresh()
    }
}

function DataFieldsRetriever(LayerUrl, fields) {
    var c, promise1, kendoDataSource = new kendo.data.DataSource({
        transport: {
            read: {
                dataType: "json",
                url: LayerUrl,
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
    return Object.defineProperty(this, "fields", {
        get: function () {
            return Promise.resolve(promise1)
        }
    }), promise1 = new Promise(function (a, d) {
        kendoDataSource.fetch(function () {
            var d = _.reject(this.data(), function (a) {
                return !fields || -1 !== fields.indexOf(a.name)
            });
            c = d, a(c)
        }).fail(function (a) {
            d(a)
        })
    }), Promise.resolve(promise1)
}

function ElementQuery(a, b, c) {
    function d() {
        return "(" + g + ">" + i + " and " + g + "<" + c + ")"
    }

    function e() {
        if (1 === argLength) {
            var e = a;
            return "" !== e ? "(" + e + ")" : ""
        }
        return $.isNumeric(b) ? d() : c ? "(" + g + h + c + ")" : ""
    }

    function f() {
        switch (h) {
            case ">":
                return "gt";
            case "=":
                return "eq";
            case "<":
                return "lt"
        }
        return console.error("condition for query was not returned " + b), ""
    }
    var g, h, i, argLength = arguments.length;
    Object.defineProperty(this, "queryString", {
        get: function () {
            return e()
        }
    }), Object.defineProperty(this, "element", {
        get: function () {
            return g
        }
    }), Object.defineProperty(this, "condition", {
        get: function () {
            return f()
        }
    }), Object.defineProperty(this, "value", {
        get: function () {
            return i
        }
    }),
        function () {
            if ($.isNumeric(b)) return g = a, void (i = b);
            if (1 === argLength) {
                var d = a.split(/[>,=,<]/);
                g = d[0], h = a[g.length], i = d[1]
            } else g = a, i = c, h = b
        }()
}

function QueryAgregator(a) {
    "use strict";
    var b = {},
        c = this;
    Object.defineProperty(this, "queryString", {
        get: function () {
            var a = [];
            for (var c in b) b.hasOwnProperty(c) && a.push(b[c]);
            return a.join(" and ")
        }
    }),
        function () {
            a && a.length > 0 && _.each(a, function (a) {
                a.on("queryUpdated", function (a, d) {
                    d.enabled ? b[$(this).attr("id")] = d.query.queryString : delete b[$(this).attr("id")], $(c).trigger("queryUpdated")
                })
            })
        }()
}
$.widget("ddk.queryPicker", {
    options: {},
    _create: function () {
        function a(a) {
            var b = m + "-dropDown";
            $("#" + m).append($("<input>", {
                id: b
            }).css("width", "150px")), i = $("#" + b).kendoDropDownList({
                optionLabel: "בחר ערך",
                dataTextField: "name",
                dataValueField: "code",
                dataSource: a.domain.codedValues,
                change: e
            }).data("kendoDropDownList")
        }

        function b() {
            q = !1, $("#" + n).removeClass("active")
        }

        function c() {
            b();
            var a = this.dataItem(this.selectedIndex),
                c = "50px",
                d = "5px";
            e(), $("#" + m).empty();
            var f = parseInt(a.value);
            if ((0 === f || 1 === f || 2 === f) && $("#" + m).append($("<input>", {
                id: m + "-singleValue"
            }).on("input", function (a) {
                    $("#" + p).val(h.value() + s.text() + $(this).val())
            }).css("width", c)), 3 === f) {
                var g = $("<input>", {
                    id: m + "-valueFrom"
                }).css("width", c);
                $("#" + m).append(g), g.before($("<label />").attr("for", m + "-valueFrom").text("From:").css("margin", d));
                var i = $("<input>", {
                    id: m + "-valueTo"
                }).css("width", c);
                $("#" + m).append(i), i.before($("<label />").attr("for", m + "-valueTo").text("To:").css("margin", d))
            }
        }

        function d() {
            b();
            var c = this.dataItem(this.selectedIndex);
            $("#" + m).empty(), c.domain && "codedValue" === c.domain.type ? (j = !0, s.enable(!1), s.value(2), a(c)) : (j = !1, s.enable("" !== c.name)), e()
        }

        function e() {
            var a = "",
                b = h.value();
            i && (a = i.value());
            var c = "" === s.value() ? "" : s.text();
            $("#" + p).val(b + c + a)
        }

        function f() {
            return new ElementQuery(h.value(), s.text(), j ? i.value() : $("#" + m + "-singleValue").val())
        }

        function g() {
            q = !q, q ? $("#" + n).addClass("active") : $("#" + n).removeClass("active"), this.element.trigger("queryUpdated", [{
                query: f(),
                enabled: q
            }])
        } {
            var h, i, j, k = this.element.attr("id") + "-elementSelector",
                l = this.element.attr("id") + "-conditionSelector",
                m = this.element.attr("id") + "-valuesSelector",
                n = this.element.attr("id") + "-queryButton",
                o = this.element.attr("id") + "-symbologyButton",
                p = this.element.attr("id") + "-queryWindowText",
                q = !1;
            this.options
        }
        this.element.append($("<input>", {
            id: k
        }).css("width", "130px")), this.element.append($("<input>", {
            id: l
        }).css("width", "105px")), this.element.append($("<div/>", {
            id: m
        }).css("display", "inline")), this.element.wrapInner($("<div/>,")).addClass("input-group"), this.element.append($("<div>", {
            id: this.element.attr("id") + "-commands"
        }).addClass("input-group"));
        var r = $("#" + this.element.attr("id") + "-commands");
        r.append($("<button>", {
            id: n,
            click: g.bind(this)
        }).attr("type", "button").addClass("btn depthButton").html('<span class="glyphicon glyphicon-hourglass" aria-hidden="true"></span>')), $("#" + n).wrap("<span class='input-group-btn'></span>"), r.append($("<input>", {
            id: p
        }).addClass("form-control").attr("placeholder", "resulting query...")), r.append($("<button>", {
            id: o,
            click: function () { }.bind(this)
        }).attr("type", "button").addClass("btn depthButton").html('<span class="glyphicon glyphicon-pushpin" aria-hidden="true"></span>')), $("#" + o).wrap("<span class='input-group-btn'></span>");
        var s = $("#" + l).kendoDropDownList({
            enable: !1,
            optionLabel: "בחר השוואה",
            dataTextField: "text",
            dataValueField: "value",
            dataSource: [{
                text: "<",
                value: "0"
            }, {
                text: ">",
                value: "1"
            }, {
                text: "=",
                value: "2"
            }, {
                text: "טווח",
                value: "3"
            }],
            change: c
        }).data("kendoDropDownList");
        h = $("#" + k).kendoDropDownList({
            optionLabel: "בחר פרמטר",
            dataTextField: "alias",
            dataValueField: "name",
            dataSource: this.options.elementsData,
            change: d
        }).data("kendoDropDownList")
    }
});

var cred = "esri_jsapi_meilod_data_" + location.hostname;
    require(["dojo/_base/unload", "dojo/cookie", "dojo/json", "dojo/_base/lang", "esri/IdentityManager", "dojo/domReady!"],
    function (unloadClass, cookieClass, jsonClass, langClass, identityManagerClass) {
    function f() {
        var a = _.find(identityManagerClass.credentials, function (a) {
            return "server" === a.scope
        });
        window.token = a.token
    }

    function g() {
        var a, d;
        i() ? (a = window.localStorage.getItem(cred), console.log("read cred from local storage")) : (console.log("read cred from cookie"), a = cookieClass(cred)), a && "null" !== a && a.length > 4 ? (d = jsonClass.parse(a), d.credentials.length > 0 && d.credentials[0].expires - (new Date).getTime() > 0 ? (identityManagerClass.initialize(d), f()) : console.debug("auth data expired, skipping")) : console.log("didn't find anything to load :("), identityManagerClass.on("credential-create", function (a) {
            console.log("credential-create"), console.dir(a), "server" === a.credential.scope && (window.token = a.credential.token)
        })
    }

    function onWindowUload() {
        if (0 === identityManagerClass.credentials.length || identityManagerClass.credentials[0].expires - (new Date).getTime() < 0) return void console.debug("auth data expired or not existing, not saving");
        var a = jsonClass.stringify(identityManagerClass.toJson());
        i() ? (window.localStorage.setItem(cred, a), console.debug("wrote to local storage")) : (cookieClass(cred, a, {
            expires: identityManagerClass.credentials[0].expires
        }), console.debug("wrote a cookie :-/"))
    }

    function i() {
        try {
            return "localStorage" in window && null !== window.localStorage
        } catch (a) {
            return !1
        }
    }
    unloadClass.addOnWindowUnload(onWindowUload);
    (new LayerDefProvider).getLayerUrlById("symbology");
    window.esriId = identityManagerClass, g()
});