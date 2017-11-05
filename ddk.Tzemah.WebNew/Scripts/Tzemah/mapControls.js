function ExtentManager(_map, b) {
    var queryClass, featureLayerClass;
    require(["esri/tasks/query", "esri/layers/FeatureLayer"], function (a, b) {
        queryClass = a, featureLayerClass = b
    });
    var newExtent,
        mapExtent = _map.extent,
        plotsLayer = _map.getLayer("plots"),
        pitsLayer = _map.getLayer("pits");
    this.zoomToMeshakim = function (val) {
        if (null === val || "undefined" == typeof val || "undefined" == typeof val.length || 0 === val.length) return newExtent = mapExtent, _map.setExtent(mapExtent, !0), void plotsLayer.setDefinitionExpression(plotsLayer.defaultDefinitionExpression);
        if (val.length > 0) {
            var query = new queryClass;
            query.where = "settleCode =" + val.join(" OR settleCode ="), plotsLayer.setDefinitionExpression(query.where), plotsLayer.queryFeatures(query, function (res) {
                var graphicExtent = esri.graphicsExtent(res.features);
                graphicExtent.expand(1.5), newExtent = graphicExtent, _map.setExtent(graphicExtent)
            }, function (a) {
                console.log("failed to zoom to extent")
            })
        }
    }, this.zoomToPlots = function (val) {
        if (null === val || "undefined" == typeof val || "undefined" == typeof val.length || 0 === val.length) return void _map.setExtent(newExtent ? newExtent : mapExtent);
        if (val.length > 0) {
            var query = new queryClass;
            query.objectIds = val, plotsLayer.queryFeatures(query, function (res) {
                _map.setExtent(esri.graphicsExtent(res.features).expand(1.2))
            }, function (a) {
                console.log("failed to zoom to extent")
            })
        }
    }, this.zoomToPits = function (val) {
        if (null === val || "undefined" == typeof val || "undefined" == typeof val.length || 0 === val.length) return void _map.setExtent(newExtent ? newExtent : mapExtent);
        if (val.length > 0) {
            var query = new queryClass;
            query.where = "objectid =" + val.join(" OR objectid="), pitsLayer.queryFeatures(query, function (res) {
                var c = esri.graphicsExtent(res.features);
                _map.setExtent(c.expand(1.2))
            }, function (a) {
                console.log("failed to zoom to extent")
            })
        }
    }
}

function MapControls(map, layerDef, legend) {
    function drawSymbolToDepthLayers() {
        var depth1Layer = map.getLayer("depth1"),
            depth2Layer = map.getLayer("depth2");
        depth1Layer && depth2Layer && (symDrawer = new SymbologyDrawer(depth1Layer, depth2Layer, map.getLayer("labels"), layerDef.getLayerUrlById("geoService"), legend))
    }

    function graphicPits(pits, c) {
        var d = fieldDataFeatureLayer.getDomain(c.name);
        return d && "codedValue" === d.type && _.each(c.elementValues, function (a) {
            a.elementText = d.getName(a.elementValue)
        }), _.map(c.elementValues, function (d) {
            var graphic = _.find(pits, function (a) {
                return a.attributes.OBJECTID === d.PitId
            });
            graphic || console.error(d.PitId + " pitid could not be found in " + kendo.stringify(pits));
            var point = new pointClass(graphic.geometry.x, graphic.geometry.y, map.getLayer("depth1").spatialReference);
            return new graphicClass(point, null, {
                LabelData: c.alias + " : " + (d.elementText ? d.elementText : d.elementValue),
                Depth: d.DepthId,
                SymbologyValue: d.elementValue
            })
        })
    } {
        var symDrawer, fieldDataFeatureLayer, pointClass, graphicClass, pitsLayer = map.getLayer("pits"),
            extentMng = new ExtentManager(map),
            selectionMng = new SelectionManager(map);
        new SelectionTool({
            tool: "SelectPitsTool"
        }, map)
    }
    require(["esri/geometry/Point", "esri/graphic", "esri/layers/FeatureLayer"], function (a, c, featureLayerClass) {
        pointClass = a, graphicClass = c;
        try {
            fieldDataFeatureLayer = new featureLayerClass(layerDef.getLayerUrlById("fieldData"), {
                mode: featureLayerClass.MODE_AUTO,
                outFields: ["*"],
                id: "fieldData"
            })
        } catch (e) {
            console.debug("field data as a feature layer prob"), console.dir(e)
        }
    }), require(["dojo/_base/lang"], function (langClass) {
        "undefined" == typeof map.getLayer("depth1") ? map.on("layers-add-result", langClass.hitch(this, drawSymbolToDepthLayers)) : drawSymbolToDepthLayers()
    }), this.getExtentManager = function () {
        return extentMng
    }, this.getSelectionManager = function () {
        return selectionMng
    }, this.getMap = function () {
        return map
    }, this.filterPits = function (a) {
        pitsLayer.setDefinitionExpression(a.length > 0 ? "objectid = " + a.join(" OR objectid = ") : "0=1")
    }, this.symbolizePitsWithData = function (pits, b) {
        var graphic = graphicPits(pits, b);
        symDrawer.drawFeatures(graphic)
    }, this.showAllPits = function () {
        pitsLayer.setDefinitionExpression("")
    }
}

function SelectionManager(map) {
    var queryClass, simpleFillSymbolClass, colorClass, featureLayerClass, simpleLineSymbolClass, simpleMarkerSymbolClass;
    require(["esri/tasks/query", "esri/symbols/SimpleFillSymbol", "esri/Color", "esri/renderers/SimpleRenderer", "esri/layers/FeatureLayer", "esri/symbols/SimpleLineSymbol", "esri/symbols/SimpleMarkerSymbol"], function (a, h, i, simpleRendererClass, k, l, m) {
        queryClass = a, simpleFillSymbolClass = h, colorClass = i, featureLayerClass = k, simpleLineSymbolClass = l, simpleMarkerSymbolClass = m
    });
    var plotLayer = map.getLayer("plots"),
        pitsLayer = map.getLayer("pits");
    plotLayer.setSelectionSymbol(new simpleFillSymbolClass(simpleFillSymbolClass.STYLE_NULL, new simpleLineSymbolClass(simpleLineSymbolClass.STYLE_SOLID, new colorClass([242, 9, 9]), 5), new colorClass([107, 240, 244, .6]))),
    pitsLayer.setSelectionSymbol(new simpleMarkerSymbolClass(simpleMarkerSymbolClass.STYLE_CROSS, 20, new simpleLineSymbolClass(simpleLineSymbolClass.STYLE_SOLID, new colorClass([255, 0, 0]), 3), new colorClass([0, 255, 0, .25]))),
    this.selectPlots = function (plotVal) {
        if (null === plotVal || "undefined" == typeof plotVal || "undefined" == typeof plotVal.length || 0 === plotVal.length)
            return plotLayer.clearSelection(), void plotLayer.refresh();
        if (plotVal.length > 0) {
            var query = new queryClass;
            query.where = "objectid =" + plotVal.join(" OR objectid="),
            plotLayer.selectFeatures(query, featureLayerClass.SELECTION_NEW, null,
                function (a) {
                    console.log("failed to select plots")
                })
        }
    },
    this.selectPits = function (pitsVal) {
        if (null === pitsVal || "undefined" == typeof pitsVal || "undefined" == typeof pitsVal.length || 0 === pitsVal.length) return pitsLayer.clearSelection(), void pitsLayer.refresh();
        if (pitsVal.length > 0) {
            var query = new queryClass;
            query.where = "objectid =" + pitsVal.join(" OR objectid="),
                pitsLayer.selectFeatures(query, featureLayerClass.SELECTION_NEW, null, function (a) {
                console.log("failed to select plots")
            })
        }
    }
}

function PitsSelect(props) {
    var drawer, time1;
    require(["dojo/on", "esri/toolbars/draw", "esri/layers/FeatureLayer", "dojo/dom", "esri/tasks/query"], function (dojoOnClass, drawClass, featureLayerClass, domClass, queryClass) {
        function selectOnMapRun(res) {
            var time2 = (new Date).getTime() - time1;
            if (time1 && !(time2 > 500)) {
                var objIdList = _.map(res.features, function (feature) {
                    return feature.attributes.OBJECTID
                });
                props.table.selectedOnMap(objIdList)
            }
        } ! function () {
            drawer = new drawClass(props.map);
            var query = new queryClass;
            dojoOnClass(drawer, "DrawEnd", function (geo) {
                drawer.deactivate(),
                query.geometry = geo,
                time1 = (new Date).getTime(),
                props.layer.queryFeatures(query, selectOnMapRun),
                props.map.setExtent(geo, !0)
            })
        }(), dojoOnClass(domClass.byId(props.button), "click", function () {
            drawer.activate(drawClass.EXTENT)
        })
    })
}

function PlotsSelect(props) {
    var drawer, time1;
    require(["dojo/on", "esri/toolbars/draw", "esri/layers/FeatureLayer", "dojo/dom", "esri/tasks/query"], function (dojoOnClass, drawClass, featureLayerClass, domClass, queryClass) {
        function selectOnMapRun(b) {
            var time2 = (new Date).getTime() - time1;
            if (time1 && !(time2 > 500)) {
                var e = _.map(b.features, function (a) {
                    return a.attributes.OBJECTID
                });
                props.table.selectedOnMap(e)
            }
        } ! function () {
            drawer = new drawClass(props.map);
            var query = new queryClass;
            dojoOnClass(drawer, "DrawEnd", function (geo) {
                drawer.deactivate(),
                    query.geometry = geo,
                    time1 = (new Date).getTime(),
                    props.layer.selectFeatures(query, featureLayerClass.SELECTION_NEW)
            })
        }(),
            props.layer.on("selection-complete", selectOnMapRun), dojoOnClass(domClass.byId(props.button), "click", function () {
            drawer.activate(drawClass.EXTENT)
        })
    })
}

function SelectionTool(props, map) {
    function c() {
        isCross = !isCross;
        var toolElementId = "#" + props.tool + " .innerButton";
        isCross ? $(toolElementId).addClass("active") : $(toolElementId).removeClass("active"), map.setMapCursor(isCross ? "crosshair" : "default")
    }

    function d() { }

    function e() { }

    function f(a) {
        c(), isCross ? d() : e()
    }
    var isCross = !1;
    $("#" + props.tool).on("click", f)
}

function SymbologyDrawer(depth1Layer, depth2Layer, labelLayer, geoServiceName, legend) {
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
            var d = new projectParamsClass;
            d.geometries = _.map(a, function (a) {
                return a.geometry
            }), d.outSR = app.map.spatialReference, geoService.project(d, function (c) {
                for (var d = 0; d < a.length; d++) a[d].geometry = c[d];
                b(a)
            })
        });
        return b
    }
    var graphicClass, pointClass, simpleMarkerSymbolClass, colorClass, geoService, projectParamsClass, classBreaksRendererClass, simpleFillSymbolClass;
    require(["esri/graphic", "esri/geometry/Point", "esri/symbols/SimpleMarkerSymbol", "esri/Color", "esri/tasks/ProjectParameters", "esri/tasks/GeometryService", "esri/renderers/ClassBreaksRenderer", "esri/symbols/SimpleFillSymbol", "esri/renderers/SimpleRenderer"],
        function (c, e, f, g, p, geometryServiceClass, r, s, simpleRendererClass) {
        graphicClass = c, pointClass = e, simpleMarkerSymbolClass = f, colorClass = g, projectParamsClass = p, classBreaksRendererClass = r, simpleFillSymbolClass = s, geoService = new geometryServiceClass(geoServiceName);
        var symbol1 = (new simpleMarkerSymbolClass).setStyle(simpleMarkerSymbolClass.STYLE_SQUARE).setSize(20),
            symbol2 = (new simpleMarkerSymbolClass).setStyle(simpleMarkerSymbolClass.STYLE_SQUARE).setSize(8),
            symRendere = new simpleRendererClass(symbol1);
        symRendere.setColorInfo({
            field: "SymbologyValue",
            minDataValue: 0,
            maxDataValue: 10,
            colors: [new colorClass([255, 255, 255]), new colorClass([255, 0, 0])]
        });
        var symRendere2 = new simpleRendererClass(symbol2);
        symRendere2.setColorInfo({
            field: "SymbologyValue",
            minDataValue: 0,
            maxDataValue: 10,
            colors: [new colorClass([255, 255, 255]), new colorClass([0, 0, 255])]
        }), depth1Layer.setRenderer(symRendere2), depth2Layer.setRenderer(symRendere)
    }), $("#clearSymbology").on("click", function () {
        depth1Layer.clear(), depth2Layer.clear(), depth1Layer.refresh(), depth2Layer.refresh(), labelLayer.refresh()
    }), this.drawFeatures = function (d) {
        f(d, depth1Layer, 1), f(d, depth2Layer, 2), depth1Layer.clear(), depth2Layer.clear(), g(d).then(function (d) {
            _.each(d, function (c) {
                return 1 === c.attributes.Depth ? void depth1Layer.add(c) : 2 === c.attributes.Depth ? void depth2Layer.add(c) : void console.error("feature has no suitable depth and is not drawn\n" + kendo.stringify(c))
            }), labelLayer.refresh(), legend.refresh()
        })
    }
}