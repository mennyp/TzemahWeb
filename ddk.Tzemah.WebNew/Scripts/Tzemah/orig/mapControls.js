function ExtentManager(a, b) {
    var c, d;
    require(["esri/tasks/query", "esri/layers/FeatureLayer"], function (a, b) {
        c = a, d = b
    });
    var e, f = a.extent,
        g = a.getLayer("plots"),
        h = a.getLayer("pits");
    this.zoomToMeshakim = function (b) {
        if (null === b || "undefined" == typeof b || "undefined" == typeof b.length || 0 === b.length) return e = f, a.setExtent(f, !0), void g.setDefinitionExpression(g.defaultDefinitionExpression);
        if (b.length > 0) {
            var d = new c;
            d.where = "settleCode =" + b.join(" OR settleCode ="), g.setDefinitionExpression(d.where), g.queryFeatures(d, function (b) {
                var c = esri.graphicsExtent(b.features);
                c.expand(1.5), e = c, a.setExtent(c)
            }, function (a) {
                console.log("failed to zoom to extent")
            })
        }
    }, this.zoomToPlots = function (b) {
        if (null === b || "undefined" == typeof b || "undefined" == typeof b.length || 0 === b.length) return void a.setExtent(e ? e : f);
        if (b.length > 0) {
            var d = new c;
            d.objectIds = b, g.queryFeatures(d, function (b) {
                a.setExtent(esri.graphicsExtent(b.features).expand(1.2))
            }, function (a) {
                console.log("failed to zoom to extent")
            })
        }
    }, this.zoomToPits = function (b) {
        if (null === b || "undefined" == typeof b || "undefined" == typeof b.length || 0 === b.length) return void a.setExtent(e ? e : f);
        if (b.length > 0) {
            var d = new c;
            d.where = "objectid =" + b.join(" OR objectid="), h.queryFeatures(d, function (b) {
                var c = esri.graphicsExtent(b.features);
                a.setExtent(c.expand(1.2))
            }, function (a) {
                console.log("failed to zoom to extent")
            })
        }
    }
}

function MapControls(a, b, c) {
    function d() {
        var d = a.getLayer("depth1"),
            e = a.getLayer("depth2");
        d && e && (f = new SymbologyDrawer(d, e, a.getLayer("labels"), b.getLayerUrlById("geoService"), c))
    }

    function e(b, c) {
        var d = g.getDomain(c.name);
        return d && "codedValue" === d.type && _.each(c.elementValues, function (a) {
            a.elementText = d.getName(a.elementValue)
        }), _.map(c.elementValues, function (d) {
            var e = _.find(b, function (a) {
                return a.attributes.OBJECTID === d.PitId
            });
            e || console.error(d.PitId + " pitid could not be found in " + kendo.stringify(b));
            var f = new h(e.geometry.x, e.geometry.y, a.getLayer("depth1").spatialReference);
            return new i(f, null, {
                LabelData: c.alias + " : " + (d.elementText ? d.elementText : d.elementValue),
                Depth: d.DepthId,
                SymbologyValue: d.elementValue
            })
        })
    } {
        var f, g, h, i, j = a.getLayer("pits"),
            k = new ExtentManager(a),
            l = new SelectionManager(a);
        new SelectionTool({
            tool: "SelectPitsTool"
        }, a)
    }
    require(["esri/geometry/Point", "esri/graphic", "esri/layers/FeatureLayer"], function (a, c, d) {
        h = a, i = c;
        try {
            g = new d(b.getLayerUrlById("fieldData"), {
                mode: d.MODE_AUTO,
                outFields: ["*"],
                id: "fieldData"
            })
        } catch (e) {
            console.debug("field data as a feature layer prob"), console.dir(e)
        }
    }), require(["dojo/_base/lang"], function (b) {
        "undefined" == typeof a.getLayer("depth1") ? a.on("layers-add-result", b.hitch(this, d)) : d()
    }), this.getExtentManager = function () {
        return k
    }, this.getSelectionManager = function () {
        return l
    }, this.getMap = function () {
        return a
    }, this.filterPits = function (a) {
        j.setDefinitionExpression(a.length > 0 ? "objectid = " + a.join(" OR objectid = ") : "0=1")
    }, this.symbolizePitsWithData = function (a, b) {
        var c = e(a, b);
        f.drawFeatures(c)
    }, this.showAllPits = function () {
        j.setDefinitionExpression("")
    }
}

function SelectionManager(a) {
    var b, c, d, e, f, g;
    require(["esri/tasks/query", "esri/symbols/SimpleFillSymbol", "esri/Color", "esri/renderers/SimpleRenderer", "esri/layers/FeatureLayer", "esri/symbols/SimpleLineSymbol", "esri/symbols/SimpleMarkerSymbol"], function (a, h, i, j, k, l, m) {
        b = a, c = h, d = i, e = k, f = l, g = m
    });
    var h = a.getLayer("plots"),
        i = a.getLayer("pits");
    h.setSelectionSymbol(new c(c.STYLE_NULL, new f(f.STYLE_SOLID, new d([242, 9, 9]), 5), new d([107, 240, 244, .6]))), i.setSelectionSymbol(new g(g.STYLE_CROSS, 20, new f(f.STYLE_SOLID, new d([255, 0, 0]), 3), new d([0, 255, 0, .25]))), this.selectPlots = function (a) {
        if (null === a || "undefined" == typeof a || "undefined" == typeof a.length || 0 === a.length) return h.clearSelection(), void h.refresh();
        if (a.length > 0) {
            var c = new b;
            c.where = "objectid =" + a.join(" OR objectid="), h.selectFeatures(c, e.SELECTION_NEW, null, function (a) {
                console.log("failed to select plots")
            })
        }
    }, this.selectPits = function (a) {
        if (null === a || "undefined" == typeof a || "undefined" == typeof a.length || 0 === a.length) return i.clearSelection(), void i.refresh();
        if (a.length > 0) {
            var c = new b;
            c.where = "objectid =" + a.join(" OR objectid="), i.selectFeatures(c, e.SELECTION_NEW, null, function (a) {
                console.log("failed to select plots")
            })
        }
    }
}

function PitsSelect(a) {
    var b, c;
    require(["dojo/on", "esri/toolbars/draw", "esri/layers/FeatureLayer", "dojo/dom", "esri/tasks/query"], function (d, e, f, g, h) {
        function i(b) {
            var d = (new Date).getTime() - c;
            if (c && !(d > 500)) {
                var e = _.map(b.features, function (a) {
                    return a.attributes.OBJECTID
                });
                a.table.selectedOnMap(e)
            }
        } ! function () {
            b = new e(a.map);
            var f = new h;
            d(b, "DrawEnd", function (d) {
                b.deactivate(), f.geometry = d, c = (new Date).getTime(), a.layer.queryFeatures(f, i), a.map.setExtent(d, !0)
            })
        }(), d(g.byId(a.button), "click", function () {
            b.activate(e.EXTENT)
        })
    })
}

function PlotsSelect(a) {
    var b, c;
    require(["dojo/on", "esri/toolbars/draw", "esri/layers/FeatureLayer", "dojo/dom", "esri/tasks/query"], function (d, e, f, g, h) {
        function i(b) {
            var d = (new Date).getTime() - c;
            if (c && !(d > 500)) {
                var e = _.map(b.features, function (a) {
                    return a.attributes.OBJECTID
                });
                a.table.selectedOnMap(e)
            }
        } ! function () {
            b = new e(a.map);
            var g = new h;
            d(b, "DrawEnd", function (d) {
                b.deactivate(), g.geometry = d, c = (new Date).getTime(), a.layer.selectFeatures(g, f.SELECTION_NEW)
            })
        }(), a.layer.on("selection-complete", i), d(g.byId(a.button), "click", function () {
            b.activate(e.EXTENT)
        })
    })
}

function SelectionTool(a, b) {
    function c() {
        g = !g;
        var c = "#" + a.tool + " .innerButton";
        g ? $(c).addClass("active") : $(c).removeClass("active"), b.setMapCursor(g ? "crosshair" : "default")
    }

    function d() { }

    function e() { }

    function f(a) {
        c(), g ? d() : e()
    }
    var g = !1;
    $("#" + a.tool).on("click", f)
}

function SymbologyDrawer(a, b, c, d, e) {
    function f(a, b, c) {
        var d = _.filter(a, function (a) {
            return a.attributes.Depth === c
        }),
            e = _.map(d, function (a) {
                return a.attributes.SymbologyValue
            });
        b.renderer.setColorInfo({
            field: "SymbologyValue",
            minDataValue: _.min(e),
            maxDataValue: _.max(e),
            colors: b.renderer.colorInfo.colors
        })
    }

    function g(a) {
        var b = new Promise(function (b, c) {
            var d = new m;
            d.geometries = _.map(a, function (a) {
                return a.geometry
            }), d.outSR = app.map.spatialReference, l.project(d, function (c) {
                for (var d = 0; d < a.length; d++) a[d].geometry = c[d];
                b(a)
            })
        });
        return b
    }
    var h, i, j, k, l, m, n, o;
    require(["esri/graphic", "esri/geometry/Point", "esri/symbols/SimpleMarkerSymbol", "esri/Color", "esri/tasks/ProjectParameters", "esri/tasks/GeometryService", "esri/renderers/ClassBreaksRenderer", "esri/symbols/SimpleFillSymbol", "esri/renderers/SimpleRenderer"], function (c, e, f, g, p, q, r, s, t) {
        h = c, i = e, j = f, k = g, m = p, n = r, o = s, l = new q(d);
        var u = (new j).setStyle(j.STYLE_SQUARE).setSize(20),
            v = (new j).setStyle(j.STYLE_SQUARE).setSize(8),
            w = new t(u);
        w.setColorInfo({
            field: "SymbologyValue",
            minDataValue: 0,
            maxDataValue: 10,
            colors: [new k([255, 255, 255]), new k([255, 0, 0])]
        });
        var x = new t(v);
        x.setColorInfo({
            field: "SymbologyValue",
            minDataValue: 0,
            maxDataValue: 10,
            colors: [new k([255, 255, 255]), new k([0, 0, 255])]
        }), a.setRenderer(x), b.setRenderer(w)
    }), $("#clearSymbology").on("click", function () {
        a.clear(), b.clear(), a.refresh(), b.refresh(), c.refresh()
    }), this.drawFeatures = function (d) {
        f(d, a, 1), f(d, b, 2), a.clear(), b.clear(), g(d).then(function (d) {
            _.each(d, function (c) {
                return 1 === c.attributes.Depth ? void a.add(c) : 2 === c.attributes.Depth ? void b.add(c) : void console.error("feature has no suitable depth and is not drawn\n" + kendo.stringify(c))
            }), c.refresh(), e.refresh()
        })
    }
}