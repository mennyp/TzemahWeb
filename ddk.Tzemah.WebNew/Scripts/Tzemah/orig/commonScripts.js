function FieldDataHighlighter(a, b) {
    this.highlight = function (c) {
        c.length !== b.length && console.error("the lenght of the field dat columns " + b.length + " and length of row " + c.length);
        for (var d = 0; d < b.length; d++) try {
            var e = b[d].field,
                f = _.find(a, function (a) {
                    return a.ElementName === e
                });
            if ("undefined" != typeof f) {
                var g = f.symbols[c[d].innerText];
                "undefined" != typeof g && $(c[d]).css("background-color", g)
            }
        } catch (h) {
            console.error(h.stack)
        }
    }
}

function LabDataHighlighter(a, b) {
    var c = "red",
        d = "yellow",
        e = "Gainsboro";
    this.highlight = function (f) {
        f.length !== b.length && console.error("the lenght of the field dat columns " + b.length + " and length of row " + f.length);
        for (var g = 0; g < b.length; g++) try {
            var h = parseFloat(f[g].innerText);
            if (isNaN(h)) continue;
            var i = b[g].field,
                j = _.find(a, function (a) {
                    return a.ElementName === i
                });
            if ("undefined" != typeof j) {
                var k = null;
                h < j.Low && h > j.ErrorLow && (k = d), h > j.High && h < j.ErrorHigh && (k = c), (h < j.ErrorLow || h > j.ErrorHigh) && (k = e), null != k && $(f[g]).css("background-color", k)
            }
        } catch (l) {
            console.error(l.stack)
        }
    }
}

function MapAndDataSplitter(a, b) {
    var c = $(a.frame).kendoSplitter({
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
    return $(b).on("pitsDisplayed", function (b, d) {
        d.length > 0 ? (c.expand(a.bottomPane), c.trigger("expand")) : (c.collapse(a.bottomPane), c.trigger("collapse"))
    }), c
}

function ProgressIndicator(a, b) {
    b || (b = 6e4);
    var c = 400;
    this.showProgress = function () {
        $(a.window).show(c), setTimeout(this.hideProgress, b)
    }, this.hideProgress = function () {
        $(a.window).hide(c)
    }
}

function RangesLegend(a) {
    function b() {
        d.show()
    }
    var c = $("#" + a.window),
        d = $("#" + a.reopen).bind("click", function () {
            c.data("kendoWindow").open(), d.hide()
        });
    c.data("kendoWindow") || c.kendoWindow({
        visible: !1,
        height: "800px",
        title: "מקרא טווחים",
        actions: ["Minimize", "Maximize", "Close"],
        close: b
    })
}

function ViewPlotsPicker(a, b, c) {
    return new PlotsPicker(a, b, c, {
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

function AttachWindow(a, b, c) {
    function d() {
        g.show()
    }

    function e(a) {
        h.where = 0 === a.length ? "0=1" : "SurveyId= " + a.join(" OR SurveyId=")
    }
    var f = $(a.window),
        g = $(a.reopenAttach).bind("click", function () {
            f.data("kendoWindow").open(), g.hide()
        }),
        h = {
            f: "json",
            token: window.token,
            outFields: "*",
            where: "0=1"
        };
    f.data("kendoWindow") || f.kendoWindow({
        width: "50%",
        title: "מסמכים מצורפים",
        visible: !1,
        actions: ["Pin", "Minimize", "Maximize", "Close"],
        close: d
    }); {
        var i = new kendo.data.DataSource({
            transport: {
                read: {
                    dataType: "json",
                    url: b.getLayerUrlById("surveyAttachments") + "/query",
                    data: h,
                    type: "POST"
                }
            },
            schema: {
                parse: function (a) {
                    return _.map(a.features, function (a) {
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
        $(a.listView).kendoListView({
            dataSource: i,
            template: kendo.template($("#imageAttachTemplate").html())
        })
    }
    $(c).on("surveyUpdated", function (a, b) {
        e(b), i.read()
    }), this.getAttachUrls = function () {
        return _.map($(a.window + " a"), function (a) {
            return $(a).attr("href")
        })
    }
}

function DepthSelector(a) {
    "use strict";
    var b = "depthChanged",
        c = $(this);
    Object.defineProperty(this, "depthChangedEvent", {
        get: function () {
            return b
        },
        enumerable: !0
    }), $(a.buttonGroup + " button").click(function (a) {
        $("button", this.parentElement).removeClass("active"), $(this).addClass("active");
        var d = $(this).attr("depth").split(",");
        d = "" === d[0] ? [] : d, c.trigger(b, [d])
    }), this.resetSelection = function () {
        $(a.buttonGroup + " button").removeClass("active")
    }
}

function FieldDataPicker(a, b, c, d, e) {
    "use strict";

    function f() {
        m = {
            parse: function (a) {
                var b = [],
                    c = a.features;
                return b = _.map(c, function (a) {
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
        n = $(a.table).kendoGrid({
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
                var a = this.dataSource.data(),
                    b = this.columns,
                    c = new FieldDataHighlighter(q, b);
                $.each(a, function (a, b) {
                    var d = $('tr[data-uid="' + b.uid + '"] td');
                    0 !== d.length && c.highlight(d)
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
                    url: b.getLayerUrlById("fieldData") + "/query",
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
            p = this.data(), l = new FieldsToGridConverter(p, r), f()
        })
    }

    function j() {
        var a = new kendo.data.DataSource({
            transport: {
                read: {
                    dataType: "json",
                    url: b.getLayerUrlById("fieldDataTableColors") + "/query",
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
    e.bind("resize", function () {
        if (n) {
            var b = $(a.frame).height(),
                c = n.find(".k-grid-content"),
                d = n.find(".k-grid-content-locked"),
                e = n.find(".k-grid-header").height(),
                f = b - (e + 10);
            c.height(f), d.height(f), n.height(f)
        }
    }), $(d).on(d.depthChangedEvent, function (a, b) {
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
    }), $(c).on("pitsDisplayed", function (a, b) {
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

function FieldsToGridConverter(a, b) {
    "use strict";

    function c(a) {
        switch (a) {
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

    function d(a) {
        if ("DepthFrom" === a.name) return 60;
        if ("PitId" === a.name) return 70;
        if ("DepthId" === a.name || "DepthTo" === a.name) return 80;
        var b = c(a.type);
        return "number" === b ? 100 : "date" === b ? 60 : "string" === b ? a.hasOwnProperty("length") ? a.length : 100 : 60
    }

    function e(a, b) {
        "esriFieldTypeDate" === b.type && (a.format = "{0:d}")
    }
    this.fields = function () {
        var b = {};
        return _.each(a, function (a) {
            b[a.name] = {
                type: c(a.type),
                editable: a.editable
            }
        }), b
    }, this.columns = function () {
        var c = [];
        return _.each(a, function (a) {
            var f = {
                title: a.alias,
                field: a.name,
                width: d(a)
            };
            ("DepthId" === a.name || "DepthTo" === a.name || "DepthFrom" === a.name || "PitId" === a.name) && (f.locked = !0), "undefined" != typeof b && b.indexOf(a.name) > -1 && (f.hidden = !0), null != a.domain && "codedValue" === a.domain.type && (f.values = _.map(a.domain.codedValues, function (a) {
                return {
                    text: a.name,
                    value: a.code
                }
            })), null != a.domain && "range" === a.domain.type && (f.template = function (b) {
                var c = -1 === b[a.name] ? "" : b[a.name];
                return c
            }), e(f, a), c.push(f)
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

function LabDataPicker(a, b, c, d, e) {
    function f(b) {
        $(p).trigger("dataUpdated"), k = $(a.table).kendoGrid({
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
                    c = new LabDataHighlighter(o, b);
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
                    url: b.getLayerUrlById("labData") + "/query",
                    data: {
                        f: "json",
                        token: window.token,
                        outFields: "*",
                        where: "pitId=" + a.join(" OR pitId =")
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
                var b = [],
                    c = a.features;
                return b = _.map(c, function (a) {
                    var b = a.attributes;
                    return b.RecievalDate = new Date(b.RecievalDate), b
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
    var j, k, l, m, n = [],
        o = [],
        p = this,
        q = ["OBJECTID", "MagikFileId", "SurveyId", "JOBID", "SAMPLEID", "Megadel", "Gidul", "Variety", "RecievalDate", "GlobalID", "Pits_GlobalID", "Guid", "Guid_2"];
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
            n = this.data(), j = new FieldsToGridConverter(n, q), h()
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
            o = this.data()
        })
    }(), e.bind("resize", function () {
        if (k) {
            var b = $(a.frame).height(),
                c = k.find(".k-grid-content"),
                d = k.find(".k-grid-content-locked"),
                e = k.find(".k-grid-header").height(),
                f = b - (e + 10);
            c.height(f), d.height(f), k.height(f)
        }
    }), $(c).on("pitsDisplayed", function (a, b) {
        console.debug("labData sees unique pits : " + b.length + " | " + b.join(",")), b.length > 0 && "undefined" != typeof j && (k ? (l.transport.options.read.data.where = "pitId=" + b.join(" OR pitId ="), l.read()) : (l = g(b), f(l)), l.bind("change", function (a) {
            var b = i(this);
            $(p).trigger("pitsUpdated", [b])
        }))
    }), $(d).on(d.depthChangedEvent, function (a, b) {
        var c = k.data("kendoGrid").dataSource,
            d = _.map(b, function (a) {
                return {
                    field: "DepthId",
                    operator: "eq",
                    value: parseInt(a)
                }
            });
        c.filter({
            logic: "or",
            filters: d
        }), k.data(c).data("kendoGrid").refresh()
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

function MapWindow(a, b) {
    function c() {
        f.show()
    }

    function d() {
        $("#" + a.map).height("100%"), $("#" + a.map).width("100%"), g.resize(), g.reposition()
    }
    var e = $("#" + a.window),
        f = $("#" + a.reopen).bind("click", function () {
            e.data("kendoWindow").open(), f.hide()
        });
    e.data("kendoWindow") || e.kendoWindow({
        width: "50%",
        height: "50%",
        visible: !1,
        position: {
            top: "46%"
        },
        title: "מפה",
        actions: ["Pin", "Minimize", "Maximize", "Close"],
        close: c
    });
    var g = new b(a.map, {
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
    return e.data("kendoWindow").bind("resize", d), e.data("kendoWindow").bind("open", d), g
}

function MeshakimPicker(a, b) {
    return $(a).kendoMultiSelect({
        dataTextField: "hebName",
        dataValueField: "settleCode",
        dataSource: {
            transport: {
                read: {
                    dataType: "json",
                    url: b.getLayerUrlById("meshakim") + "/query",
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
                    for (var b = [], c = a.features, d = 0; d < c.length; d++) {
                        var e = {};
                        e.OBJECTID = c[d].attributes.OBJECTID, e.lamasCode = c[d].attributes.lamasCode, e.engName = c[d].attributes.engName, e.hebName = c[d].attributes.hebName, e.settleCode = c[d].attributes.settleCode, b.push(e)
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

function PitsPicker(a, b, c) {
    "use strict";

    function d(a) {
        var b = _.map(a.view(), function (a) {
            return a.OBJECTID
        }),
            c = _.uniq(b);
        return c
    }

    function e() {
        $(n).trigger("pitsDisplayed", [
            [],
            []
        ]), $(n).trigger("hidden"), r.hide()
    }

    function f() {
        $(n).trigger("shown"), r.show()
    }

    function g(a) {
        o.where = 0 === a.length ? "0=1" : "", o.objectIds = a.join(","), $(n).trigger(p, [a])
    }
    var h, i, j, k, l, m, n = this,
        o = {
            f: "json",
            token: window.token,
            outFields: "*",
            where: "0=1"
        };
    require(["esri/tasks/query", "esri/tasks/QueryTask", "esri/tasks/GeometryService", "esri/config"], function (a, c, d, e) {
        i = a, j = c, k = d, l = e, m = new k(b.getLayerUrlById("geoService")), l.defaults.geometryService = m
    });
    var p = "pitsUpdatedEvent",
        q = new kendo.data.DataSource({
            transport: {
                read: {
                    dataType: "json",
                    url: b.getLayerUrlById("pits") + "/query",
                    data: o,
                    type: "POST"
                }
            },
            schema: {
                parse: function (a) {
                    return h = a.features, _.map(h, function (a) {
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
        r = $(a.pitsTable).kendoGrid({
            dataSource: q,
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
    $(".k-grid-clearSelection", a.pitsTable).bind("click", function (a) {
        r.data("kendoGrid").clearSelection()
    }), $(c).on("plotsUpdated", function (a, c) {
        if (0 === c.length) e();
        else {
            console.log("plots selected :" + c.length);
            try {
                var d = new i;
                d.returnGeometry = !0, d.objectIds = c;
                var h = new j(b.getLayerUrlById("plots"));
                h.execute(d, function (a) {
                    var c = new i,
                        d = _.map(a.features, function (a) {
                            return a.geometry
                        });
                    m.union(d, function (a) {
                        c.geometry = a;
                        var d = new j(b.getLayerUrlById("pits"));
                        d.executeForIds(c, function (a) {
                            g(a), q.read()
                        })
                    })
                })
            } catch (a) {
                console.log("could not query pits :" + a)
            }
            f()
        }
    }), $(c).on("shown", function () {
        console.debug("plots shown")
    }), $(c).on("hidden", function () {
        e()
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
        $(n).trigger("pitsDisplayed", [b, c])
    }), this.selectedOnMap = function (a) {
        0 === a.length ? e() : (g(a), q.read(), f())
    }, this.getDisplayedPits = function () {
        return d(r.data("kendoGrid").dataSource)
    }, Object.defineProperty(this, "grid", {
        get: function () {
            return r.data("kendoGrid")
        }
    }), Object.defineProperty(this, "pits", {
        get: function () {
            return h
        }
    })
}

function PlotsPicker(a, b, c, d) {
    function e() {
        g.trigger("hidden"), i.hide()
    }

    function f() {
        g.trigger("shown"), i.show()
    }
    var g = $(this),
        h = new kendo.data.DataSource({
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
        });
    d.dataSource = h;
    var i = $(a.plotTable).kendoGrid(d);
    $(".k-grid-clearSelection", a.plotTable).bind("click", function (a) {
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
            h.filter({
                logic: "or",
                filters: b
            }), i.data(h).data("kendoGrid").refresh();
            var c = _.map(h.view(), function (a) {
                return a.OBJECTID
            });
            g.trigger("plotsUpdated", [c])
        }
    }, Object.defineProperty(this, "grid", {
        get: function () {
            return i.data("kendoGrid")
        }
    }), c.bind("change", function (a) {
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
            h.filter({
                logic: "or",
                filters: c
            }), i.data(h).data("kendoGrid").refresh(), f()
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

function ReportGenerator(a, b) {
    function c() {
        var a = this.checked,
            b = $(this).closest("tr");
        a ? b.addClass("k-state-selected") : b.removeClass("k-state-selected")
    }

    function d(a) {
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
                        Color: d($(f[g]).css("background-color"))
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
        return _.each(n.tbody.find("input:checked").closest("tr"), function (b) {
            var c = n.dataItem(b);
            a[c.Value] = !0
        }), a
    }

    function g(a) {
        m.showProgress(), $.ajax({
            type: "POST",
            url: "/Report/Generate",
            data: a,
            dataType: "application/json"
        }).done(function (a) {
            console.log("done"), console.dir(a)
        }).fail(function (a) {
            a = JSON.parse(a.responseText), console.dir(a)
        }).always(function () {
            m.hideProgress(), window.open("/Report/getreport", "_blank")
        })
    }

    function h() {
        var c = f(),
            d = {};
        if (c.pitDetails && (d.PitsTable = e(a.pitsPicker.grid)), c.labData && (d.LabDataTable = e(a.labDataPicker.grid)), c.fieldData && (d.FieldDataTable = e(a.fieldDataPicker.grid)), c.attachFiles && (d.AttachUrls = a.attachWindow.getAttachUrls()), c.map) {
            var h = b.on("print-complete", function (a) {
                h.remove(), d.ImageUrl = a.result.url, g(d)
            });
            i()
        } else g(d)
    }

    function i() {
        m.showProgress();
        var a = new j;
        a.label = "A4 Landscape", a.format = "JPG", a.layout = "A4 Landscape", a.layoutOptions = {
            titleText: "סקר קרקע",
            authorText: "צמח נסיונות",
            copyrightText: "צמח נסיונות",
            scalebarUnit: "Meters"
        }, b.printMap(a)
    } {
        var j, k = $("#" + a.window),
            l = $("#" + a.reopen).bind("click", function () {
                k.data("kendoWindow").center().open(), l.hide()
            }),
            m = new ProgressIndicator({
                window: "#" + a.progresIndicator
            }, 22e4);
        $("#" + a.window).kendoWindow({
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
                this.center(), $("#" + a.mapImage).attr("src", "/images/placeholder.jpg")
            }
        }).data("kendoWindow")
    }
    require(["esri/tasks/PrintTemplate"], function (a) {
        j = a
    });
    var n = $("#" + a.grid).kendoGrid({
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
    $(".k-grid-createReport", n.element).bind("click", h), $(".k-grid-generateMap", n.element).bind("click", i), n.table.on("click", ".checkbox", c), b.on("print-complete", function (b) {
        m.hideProgress(), $("#" + a.mapImage).attr("src", b.result.url)
    }), $(a.grid + " .k-grid .k-grid-header").hide()
}

function SurveysPicker(a, b, c) {
    "use strict";

    function d() {
        j.trigger("hidden"), j.hide()
    }

    function e() {
        j.trigger("shown"), j.show()
    }

    function f(a, b) {
        var c = [],
            d = a.select();
        return 0 !== d.length ? d.each(function () {
            c.push(a.dataItem(this)[b])
        }) : _.each(a.dataSource.view(), function (a) {
            c.push(a[b])
        }), c
    }

    function g() {
        var a = j.data("kendoGrid"),
            b = f(a, "OBJECTID");
        $(this).trigger("surveyUpdated", [b])
    }

    function h(a) {
        if (0 === a.length) d();
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
                i.filter({
                    logic: "or",
                    filters: b
                }), j.data(i).data("kendoGrid").refresh()
            } catch (c) {
                console.log("could not query pits :" + c)
            }
            e()
        }
    }
    var i = new kendo.data.DataSource({
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
            }
        },
        filter: {
            field: "OBJECTID",
            operator: "eq",
            value: 0
        },
        schema: {
            parse: function (a) {
                var b = a.features;
                return _.map(b, function (a) {
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
        j = $(a.table).kendoGrid({
            dataSource: i,
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
    $(".k-grid-clearSelection", a.table).bind("click", function (a) {
        j.data("kendoGrid").clearSelection()
    }), $(c).on("shown", function () {
        e()
    }), $(c).on("hidden", function () {
        d()
    }), c.grid.bind("change", function () {
        var a = this,
            b = f(a, "SurveyId");
        h(b)
    }), $(c).on("pitsDisplayed", function (a, b, c) {
        h(c)
    }), j.data("kendoGrid").bind("change", g.bind(this)), j.data("kendoGrid").dataSource.bind("change", g.bind(this))
}

function SymbologySelector(a, b, c, d) {
    var e = this,
        f = $("#" + a.dropDown).kendoDropDownList({
            dataTextField: "alias",
            dataValueField: "name",
            dataSource: b
        }).data("kendoDropDownList");
    return f.bind("change", function () {
        var a = this.dataItem(this.selectedIndex),
            b = c.getElementValues(a.name);
        $(e).trigger("symbologyElementSelected", [{
            elementValues: b,
            name: a.name,
            alias: a.alias
        }])
    }), $(e)
}

function Legend(a, b) {
    function c() {
        clearTimeout(e), e = setTimeout(function () {
            d && d.refresh()
        }, 500)
    }
    var d, e;
    require(["esri/dijit/Legend", "dojo/_base/array"], function (e, f) {
        d = new e({
            map: a
        }, b), d.startup(), a.on("layers-add-result,layer-add-result", c)
    }), this.refresh = function () {
        c()
    }
}

function DataFieldsRetriever(a, b) {
    var c, d, e = new kendo.data.DataSource({
        transport: {
            read: {
                dataType: "json",
                url: a,
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
            return Promise.resolve(d)
        }
    }), d = new Promise(function (a, d) {
        e.fetch(function () {
            var d = _.reject(this.data(), function (a) {
                return !b || -1 !== b.indexOf(a.name)
            });
            c = d, a(c)
        }).fail(function (a) {
            d(a)
        })
    }), Promise.resolve(d)
}

function ElementQuery(a, b, c) {
    function d() {
        return "(" + g + ">" + i + " and " + g + "<" + c + ")"
    }

    function e() {
        if (1 === j) {
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
    var g, h, i, j = arguments.length;
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
            if (1 === j) {
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
    function (a, b, c, d, e) {
    function f() {
        var a = _.find(e.credentials, function (a) {
            return "server" === a.scope
        });
        window.token = a.token
    }

    function g() {
        var a, d;
        i() ? (a = window.localStorage.getItem(cred), console.log("read cred from local storage")) : (console.log("read cred from cookie"), a = b(cred)), a && "null" !== a && a.length > 4 ? (d = c.parse(a), d.credentials.length > 0 && d.credentials[0].expires - (new Date).getTime() > 0 ? (e.initialize(d), f()) : console.debug("auth data expired, skipping")) : console.log("didn't find anything to load :("), e.on("credential-create", function (a) {
            console.log("credential-create"), console.dir(a), "server" === a.credential.scope && (window.token = a.credential.token)
        })
    }

    function h() {
        if (0 === e.credentials.length || e.credentials[0].expires - (new Date).getTime() < 0) return void console.debug("auth data expired or not existing, not saving");
        var a = c.stringify(e.toJson());
        i() ? (window.localStorage.setItem(cred, a), console.debug("wrote to local storage")) : (b(cred, a, {
            expires: e.credentials[0].expires
        }), console.debug("wrote a cookie :-/"))
    }

    function i() {
        try {
            return "localStorage" in window && null !== window.localStorage
        } catch (a) {
            return !1
        }
    }
    a.addOnWindowUnload(h);
    (new LayerDefProvider).getLayerUrlById("symbology");
    window.esriId = e, g()
});