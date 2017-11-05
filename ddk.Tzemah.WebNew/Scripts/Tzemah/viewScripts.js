
function EventsProxy(formsControl, mapControl) {
    function c() {
        var c = formsControl.labPicker,
            d = formsControl.fieldPicker;
        (c.isFiltered || d.isFiltered) && (plotPitsLabCoordinator.labDataUpdated(c.getDisplayedPits()), plotPitsLabCoordinator.fieldDataUpdated(d.getDisplayedPits()), mapControl.filterPits(plotPitsLabCoordinator.currentPits))
    }

    function d() {
        formsControl.labPicker.resize(), formsControl.fieldPicker.resize()
    }
    var meshakimPicker = formsControl.getMeshakimPicker(),
        extentMng = mapControl.getExtentManager(),
        selectionMng = mapControl.getSelectionManager(),
        plotPicker = formsControl.getPlotsPicker(),
        pitsPicker = formsControl.getPitsPicker(),
        mapDataSpliter = formsControl.getMapAndDataSplitter(),
        _map = mapControl.getMap(),
        plotPitsLabCoordinator = (new PlotsSelect({
            button: "mapSelectPlotsTool",
            layer: _map.getLayer("plots"),
            table: plotPicker,
            map: _map
        }),
            new PitsSelect({
            button: "mapSelectPitsTool",
            layer: _map.getLayer("pits"),
            table: pitsPicker,
            map: _map
        }),
            new LabAndFieldCoordinator);
    this._meshakimPicker = function () {
        return meshakimPicker
    },
    mapDataSpliter.bind("resize", d), meshakimPicker.bind("change", function (a) {
        var b = $(this).val();
        extentMng.zoomToMeshakim(b), console.log("meshakim updated : " + b)
    }),
        $(plotPicker).on("hidden", function () {
        selectionMng.selectPlots([])
    }), $(plotPicker).on("plotsUpdated", function (a, b) {
        extentMng.zoomToPlots(b), selectionMng.selectPlots(b), console.log("plots updated : " + b), selectionMng.selectPits([])
    }), $(pitsPicker).on("pitsUpdatedEvent", function (a, c) {
        mapControl.filterPits(c)
    }), $(pitsPicker).on("hidden", function () {
        selectionMng.selectPits([]), mapControl.showAllPits()
    }), pitsPicker.grid.bind("change", function (a) {
        var b = [],
            c = this;
        this.select().each(function () {
            b.push(c.dataItem(this).OBJECTID)
        }), selectionMng.selectPits(b), console.log("pits selected : " + b)
    }), $(formsControl.fieldPicker).on("pitsUpdated", c), $(formsControl.labPicker).on("pitsUpdated", c), formsControl.symbologySelectors.then(function (a) {
        _.each(a, function (a) {
            a.on("symbologyElementSelected", function (a, c) {
                mapControl.symbolizePitsWithData(pitsPicker.pits, c)
            })
        })
    }), $("#loadingScreen").hide()
}

function FormControls(layerDefPro) {
    "use strict";
    var fields = ["OBJECTID", "MagikFileId", "SurveyId", "JOBID", "SAMPLEID", "Megadel", "Gidul", "Variety", "RecievalDate", "PitId", "DepthId", "DepthFrom", "DepthTo", "SampleRemark"],
        fields2 = ["OBJECTID", "Guid"],
        meshakimPicker = new MeshakimPicker("#meshakim", layerDefPro),
        viewPlotPick = ViewPlotsPicker({
            plotTable: "#plots"
        }, layerDefPro, meshakimPicker),
        pitsPick = new PitsPicker({
            pitsTable: "#pits"
        }, layerDefPro, viewPlotPick),
        mapDataSplit = new MapAndDataSplitter({
            frame: "#vertical",
            bottomPane: "#bottom-pane"
        }, pitsPick),
        surveyPick = new SurveysPicker({
            table: "#surveys"
        }, layerDefPro, pitsPick),
        attachWin = new AttachWindow({
            window: "#attachWindow",
            reopenAttach: "#AttachmentsButton",
            listView: "#listView"
        }, layerDefPro, surveyPick),
        depthSel = new DepthSelector({
            buttonGroup: "#depthSelector"
        }),
        labDataPick = new LabDataPicker({
            table: "#labData",
            frame: "#labDataOperations"
        }, layerDefPro, pitsPick, depthSel, mapDataSplit),
        fieldDataPick = new FieldDataPicker({
            table: "#fieldData",
            frame: "#fieldDataOperations"
        }, layerDefPro, pitsPick, depthSel, mapDataSplit);
    $(labDataPick).on("dataUpdated", function () {
        depthSel.resetSelection()
    });
    var kendoSplit = $("#horizontal").kendoSplitter({
        panes: [{
            collapsible: !0,
            size: "10%"
        }, {
            collapsible: !1
        }, {
            collapsible: !0,
            size: "40%"
        }]
    }).data("kendoSplitter"),
        n = (new RangesLegend({
            window: "rangesWindow",
            reopen: "legendTool"
        }), new DataFieldsRetriever(layerDefPro.getLayerUrlById("labData"), fields).then(function (dataSource) {
            return new SymbologySelector({
                dropDown: "labDataSymbology"
            }, dataSource, labDataPick)
        })),
        dataFieldsRetriver = new DataFieldsRetriever(layerDefPro.getLayerUrlById("fieldData"), fields2).then(function (dataSource) {
            return new SymbologySelector({
                dropDown: "fieldDataSymbology"
            }, dataSource, fieldDataPick)
        });
    this.setPrinter = function (a) {
        new ReportGenerator({
            window: "reportGeneratorWindow",
            reopen: "ExportMapToFile",
            mapImage: "generatedMapImage",
            grid: "reportPartsPicker",
            progresIndicator: "hider",
            attachWindow: attachWin,
            pitsPicker: pitsPick,
            labDataPicker: labDataPick,
            fieldDataPicker: fieldDataPick
        }, a)
    }, this.getMeshakimPicker = function () {
        return meshakimPicker
    }, this.getPlotsPicker = function () {
        return viewPlotPick
    }, this.getPitsPicker = function () {
        return pitsPick
    }, this.getMapAndDataSplitter = function () {
        return mapDataSplit
    }, Object.defineProperty(this, "fieldPicker", {
        get: function () {
            return fieldDataPick
        }
    }), Object.defineProperty(this, "labPicker", {
        get: function () {
            return labDataPick
        }
    }), Object.defineProperty(this, "tablesMapSymbologySpliter", {
        get: function () {
            return kendoSplit
        }
    }), Object.defineProperty(this, "symbologySelectors", {
        get: function () {
            return Promise.all([n, dataFieldsRetriver])
        }
    })
}
window.app = function () {
    var mainApp = {};
    return mainApp.config = {
        layerDefProvider: new LayerDefProvider
    },
    require(["esri/map", "esri/dijit/HomeButton", "esri/layers/FeatureLayer", "esri/config", "esri/urlUtils", "esri/geometry/Extent", "esri/dijit/Popup", "esri/dijit/PopupTemplate", "esri/layers/LabelLayer", "esri/symbols/TextSymbol", "esri/renderers/SimpleRenderer", "esri/layers/LabelClass", "dojo/_base/Color", "esri/dijit/Print", "dojo/dom", "esri/layers/WMSLayer", "esri/layers/WMSLayerInfo", "dojo/dom-construct", "esri/symbols/SimpleMarkerSymbol", "dojo/on", "dojo/domReady!"],
        function (mapClass, homeButtonClass, featureLayerClass, configClass, urlUtilsClass, extentClass, popupClass, popupTemplateClass, labelLayerClass, textSymbolClass, simpleRendererClass, labelClass, colorClass, printClass, domClass, wmsLayerClass, wmsLayerInfoClass, domConstructClass, simpleMarkerSymbolClass, dojoOnClass, domReadyClass) {
        function mouseMoveEvent(e) {
            var point = e.mapPoint;
            $("#coordinatesInfo").html(point.x.toFixed(1) + ", " + point.y.toFixed(1))
        }

        function getLayers() {
            var layers = [],
                color1 = new colorClass("#fff"),
                color2 = new colorClass("#f00"),
                depth1FeatureLayer = new featureLayerClass(mainApp.config.layerDefProvider.getLayerUrlById("symbology"), {
                    mode: featureLayerClass.MODE_AUTO,
                    outFields: ["*"],
                    id: "depth1"
                });
            depth1FeatureLayer.setDefinitionExpression("Depth=1");
            var depth2FeatureLayer = new featureLayerClass(mainApp.config.layerDefProvider.getLayerUrlById("symbology"), {
                mode: featureLayerClass.MODE_AUTO,
                outFields: ["*"],
                id: "depth2"
            });
            depth2FeatureLayer.setDefinitionExpression("Depth=2");
            var labelsLayer = new labelLayerClass({
                id: "labels"
            }),
                i = (new textSymbolClass).setColor(color1);
            i.font.setSize("14pt"), i.font.setFamily("arial");
            var o = (new textSymbolClass).setColor(color2);
            o.font.setSize("14pt"), o.font.setFamily("arial");
            var p = "עומק:{Depth} - {LabelData}";
            return labelsLayer.addFeatureLayer(depth1FeatureLayer, new simpleRendererClass(i), p), labelsLayer.addFeatureLayer(depth2FeatureLayer, new simpleRendererClass(o), p), depth1FeatureLayer.setLabelingInfo([new labelClass({
                labelPlacement: "above-right"
            })]), depth2FeatureLayer.setLabelingInfo([new labelClass({
                labelPlacement: "below-left"
            })]), layers.push(labelsLayer), layers.push(depth2FeatureLayer), layers.push(depth1FeatureLayer),
                layers
        }

        function get_jordanvalleyWmsLayer() {
            var jordanvalleyWmsLayerInfo = new wmsLayerInfoClass({
                name: "jordanvalley",
                title: "jordanvalley"
            }),
                info = {
                    extent: extentJordanValley,
                    layerInfos: [jordanvalleyWmsLayerInfo]
                },
                jordanvalleyWmsLayer = new wmsLayerClass("http://app.igeoview.com/en/default/wms/public", {
                    resourceInfo: info,
                    visibleLayers: ["jordanvalley"]
                });
            return jordanvalleyWmsLayer.spatialReferences[0] = 2039, jordanvalleyWmsLayer
        }

        function get_OrthoIsraelWmsLayer() {
            var OrthoIsraelWmsLayerInfo = new wmsLayerInfoClass({
                name: "orthophotoisrael",
                title: "orthophotoisrael"
            }),
                info = {
                    extent: extentOrthoIsrael,
                    layerInfos: [OrthoIsraelWmsLayerInfo]
                },
                OrthoIsraelWmsLayer = new wmsLayerClass("http://app.igeoview.com/en/default/wms/public", {
                    resourceInfo: info,
                    visibleLayers: ["orthophotoisrael"]
                });
            return OrthoIsraelWmsLayer.spatialReferences[0] = 2039, OrthoIsraelWmsLayer
        }
        var extentJordanValley = new extentClass({
            xmin: 244e3,
            ymin: 725e3,
            xmax: 261e3,
            ymax: 755e3,
            spatialReference: {
                wkid: 2039
            }
        });
        var extentOrthoIsrael = new extentClass({
            xmin: 244e3,
            ymin: 725e3,
            xmax: 261e3,
            ymax: 755e3,
            spatialReference: {
                wkid: 2039
            }
        });
        configClass.defaults.io.proxyUrl = "/proxy/proxy.ashx", configClass.defaults.io.alwaysUseProxy = !1;
        var popupInfoWin = new popupClass({
            markerSymbol: new simpleMarkerSymbolClass("circle", 32, null, new colorClass([0, 0, 0, .25])),
            marginLeft: "20",
            marginTop: "20"
        }, domConstructClass.create("div"));
        mainApp.map = new mapClass("map", {
            zoom: 19,
            extent: extentJordanValley,
            logo: !1,
            showLabels: !0,
            infoWindow: popupInfoWin
        }), mainApp.map.home = new homeButtonClass({
            map: mainApp.map
        }, "HomeButton"), mainApp.map.home.startup(), mainApp.map.on("load", function () {
            this.on("mouse-move", mouseMoveEvent), this.on("mouse-drag", mouseMoveEvent)
        });
        var OrthoIsraelWmsLayer = get_OrthoIsraelWmsLayer();
        var jordanvalleyWmsLayer = get_jordanvalleyWmsLayer(),
            mapLayers = mainApp.config.layerDefProvider.getMapLayers(),
            featureLayers = _.map(mapLayers, function (layer) {
                return new featureLayerClass(layer.url, {
                    mode: layer.isDynamic ? featureLayerClass.MODE_AUTO : featureLayerClass.MODE_SNAPSHOT,
                    outFields: ["*"],
                    id: layer.id,
                    infoTemplate: new popupTemplateClass(layer.popUpParams)
                })
            });
        featureLayers = featureLayers.concat(getLayers()), mainApp.map.addLayers(featureLayers);
        var printer = new printClass({
            map: mainApp.map,
            templates: [{
                label: "Map",
                format: "JPG",
                layout: "MAP_ONLY",
                showAttribution: !0,
                exportOptions: {
                    width: 500,
                    height: 400,
                    dpi: 96
                }
            }, {
                label: "A4 Portrait",
                format: "JPG",
                layout: "A4 Portrait",
                showAttribution: !0,
                layoutOptions: {
                    titleText: "סקר קרקע",
                    authorText: "צמח נסיונות",
                    copyrightText: "צמח נסיונות",
                    scalebarUnit: "Meters"
                }
            }, {
                label: "A4 Landscape",
                format: "JPG",
                layout: "A4 Landscape",
                showAttribution: !0,
                layoutOptions: {
                    titleText: "סקר קרקע",
                    authorText: "צמח נסיונות",
                    copyrightText: "צמח נסיונות",
                    scalebarUnit: "Meters"
                }
            }],
            url: mainApp.config.layerDefProvider.getLayerUrlById("printService")
        }, domClass.byId("printButton"));
        printer.startup(), dojoOnClass.once(featureLayers[0], "update-end", function () {
            mainApp.formControls = new FormControls(mainApp.config.layerDefProvider),
            mainApp.formControls.setPrinter(printer),
            mainApp.legend = new Legend(mainApp.map, "legend"),
            mainApp.mapControls = new MapControls(mainApp.map, mainApp.config.layerDefProvider, mainApp.legend),
            mainApp.eventsProxy = new EventsProxy(mainApp.formControls, mainApp.mapControls),
            setTimeout(function () {
                mainApp.map.setExtent(mainApp.map.getLayer("plots").fullExtent.expand(1.2)), mainApp.map.addLayer(OrthoIsraelWmsLayer), mainApp.map.on("resize", function (a) {
                    var b = a.target.extent;
                    setTimeout(function () {
                        a.target.setExtent(b)
                    }, 100)
                })
            }, 100)
        })
    }), mainApp
}();