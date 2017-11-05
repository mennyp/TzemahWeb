function EventsProxy(a, b) {
    function c() {
        var c = a.labPicker,
            d = a.fieldPicker;
        (c.isFiltered || d.isFiltered) && (l.labDataUpdated(c.getDisplayedPits()), l.fieldDataUpdated(d.getDisplayedPits()), b.filterPits(l.currentPits))
    }

    function d() {
        a.labPicker.resize(), a.fieldPicker.resize()
    }
    var e = a.getMeshakimPicker(),
        f = b.getExtentManager(),
        g = b.getSelectionManager(),
        h = a.getPlotsPicker(),
        i = a.getPitsPicker(),
        j = a.getMapAndDataSplitter(),
        k = b.getMap(),
        l = (new PlotsSelect({
            button: "mapSelectPlotsTool",
            layer: k.getLayer("plots"),
            table: h,
            map: k
        }), new PitsSelect({
            button: "mapSelectPitsTool",
            layer: k.getLayer("pits"),
            table: i,
            map: k
        }), new LabAndFieldCoordinator);
    this._meshakimPicker = function () {
        return e
    }, j.bind("resize", d), e.bind("change", function (a) {
        var b = $(this).val();
        f.zoomToMeshakim(b), console.log("meshakim updated : " + b)
    }), $(h).on("hidden", function () {
        g.selectPlots([])
    }), $(h).on("plotsUpdated", function (a, b) {
        f.zoomToPlots(b), g.selectPlots(b), console.log("plots updated : " + b), g.selectPits([])
    }), $(i).on("pitsUpdatedEvent", function (a, c) {
        b.filterPits(c)
    }), $(i).on("hidden", function () {
        g.selectPits([]), b.showAllPits()
    }), i.grid.bind("change", function (a) {
        var b = [],
            c = this;
        this.select().each(function () {
            b.push(c.dataItem(this).OBJECTID)
        }), g.selectPits(b), console.log("pits selected : " + b)
    }), $(a.fieldPicker).on("pitsUpdated", c), $(a.labPicker).on("pitsUpdated", c), a.symbologySelectors.then(function (a) {
        _.each(a, function (a) {
            a.on("symbologyElementSelected", function (a, c) {
                b.symbolizePitsWithData(i.pits, c)
            })
        })
    }), $("#loadingScreen").hide()
}

function FormControls(a) {
    "use strict";
    var b = ["OBJECTID", "MagikFileId", "SurveyId", "JOBID", "SAMPLEID", "Megadel", "Gidul", "Variety", "RecievalDate", "PitId", "DepthId", "DepthFrom", "DepthTo", "SampleRemark"],
        c = ["OBJECTID", "Guid"],
        d = new MeshakimPicker("#meshakim", a),
        e = ViewPlotsPicker({
            plotTable: "#plots"
        }, a, d),
        f = new PitsPicker({
            pitsTable: "#pits"
        }, a, e),
        g = new MapAndDataSplitter({
            frame: "#vertical",
            bottomPane: "#bottom-pane"
        }, f),
        h = new SurveysPicker({
            table: "#surveys"
        }, a, f),
        i = new AttachWindow({
            window: "#attachWindow",
            reopenAttach: "#AttachmentsButton",
            listView: "#listView"
        }, a, h),
        j = new DepthSelector({
            buttonGroup: "#depthSelector"
        }),
        k = new LabDataPicker({
            table: "#labData",
            frame: "#labDataOperations"
        }, a, f, j, g),
        l = new FieldDataPicker({
            table: "#fieldData",
            frame: "#fieldDataOperations"
        }, a, f, j, g);
    $(k).on("dataUpdated", function () {
        j.resetSelection()
    });
    var m = $("#horizontal").kendoSplitter({
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
        }), new DataFieldsRetriever(a.getLayerUrlById("labData"), b).then(function (a) {
            return new SymbologySelector({
                dropDown: "labDataSymbology"
            }, a, k)
        })),
        o = new DataFieldsRetriever(a.getLayerUrlById("fieldData"), c).then(function (a) {
            return new SymbologySelector({
                dropDown: "fieldDataSymbology"
            }, a, l)
        });
    this.setPrinter = function (a) {
        new ReportGenerator({
            window: "reportGeneratorWindow",
            reopen: "ExportMapToFile",
            mapImage: "generatedMapImage",
            grid: "reportPartsPicker",
            progresIndicator: "hider",
            attachWindow: i,
            pitsPicker: f,
            labDataPicker: k,
            fieldDataPicker: l
        }, a)
    }, this.getMeshakimPicker = function () {
        return d
    }, this.getPlotsPicker = function () {
        return e
    }, this.getPitsPicker = function () {
        return f
    }, this.getMapAndDataSplitter = function () {
        return g
    }, Object.defineProperty(this, "fieldPicker", {
        get: function () {
            return l
        }
    }), Object.defineProperty(this, "labPicker", {
        get: function () {
            return k
        }
    }), Object.defineProperty(this, "tablesMapSymbologySpliter", {
        get: function () {
            return m
        }
    }), Object.defineProperty(this, "symbologySelectors", {
        get: function () {
            return Promise.all([n, o])
        }
    })
}
window.app = function () {
    var a = {};
    return a.config = {
        layerDefProvider: new LayerDefProvider
    }, require(["esri/map", "esri/dijit/HomeButton", "esri/layers/FeatureLayer", "esri/config", "esri/urlUtils", "esri/geometry/Extent", "esri/dijit/Popup", "esri/dijit/PopupTemplate", "esri/layers/LabelLayer", "esri/symbols/TextSymbol", "esri/renderers/SimpleRenderer", "esri/layers/LabelClass", "dojo/_base/Color", "esri/dijit/Print", "dojo/dom", "esri/layers/WMSLayer", "esri/layers/WMSLayerInfo", "dojo/dom-construct", "esri/symbols/SimpleMarkerSymbol", "dojo/on", "dojo/domReady!"], function (b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, u) {
        function v(a) {
            var b = a.mapPoint;
            $("#coordinatesInfo").html(b.x.toFixed(1) + ", " + b.y.toFixed(1))
        }

        function w() {
            var b = [],
                c = new n("#fff"),
                e = new n("#f00"),
                f = new d(a.config.layerDefProvider.getLayerUrlById("symbology"), {
                    mode: d.MODE_AUTO,
                    outFields: ["*"],
                    id: "depth1"
                });
            f.setDefinitionExpression("Depth=1");
            var g = new d(a.config.layerDefProvider.getLayerUrlById("symbology"), {
                mode: d.MODE_AUTO,
                outFields: ["*"],
                id: "depth2"
            });
            g.setDefinitionExpression("Depth=2");
            var h = new j({
                id: "labels"
            }),
                i = (new k).setColor(c);
            i.font.setSize("14pt"), i.font.setFamily("arial");
            var o = (new k).setColor(e);
            o.font.setSize("14pt"), o.font.setFamily("arial");
            var p = "עומק:{Depth} - {LabelData}";
            return h.addFeatureLayer(f, new l(i), p), h.addFeatureLayer(g, new l(o), p), f.setLabelingInfo([new m({
                labelPlacement: "above-right"
            })]), g.setLabelingInfo([new m({
                labelPlacement: "below-left"
            })]), b.push(h), b.push(g), b.push(f), b
        }

        function x() {
            var a = new r({
                name: "jordanvalley",
                title: "jordanvalley"
            }),
                b = {
                    extent: y,
                    layerInfos: [a]
                },
                c = new q("http://app.igeoview.com/en/default/wms/public", {
                    resourceInfo: b,
                    visibleLayers: ["jordanvalley"]
                });
            return c.spatialReferences[0] = 2039, c
        }
        var y = new g({
            xmin: 244e3,
            ymin: 725e3,
            xmax: 261e3,
            ymax: 755e3,
            spatialReference: {
                wkid: 2039
            }
        });
        e.defaults.io.proxyUrl = "/proxy/proxy.ashx", e.defaults.io.alwaysUseProxy = !1;
        var z = new h({
            markerSymbol: new t("circle", 32, null, new n([0, 0, 0, .25])),
            marginLeft: "20",
            marginTop: "20"
        }, s.create("div"));
        a.map = new b("map", {
            zoom: 19,
            extent: y,
            logo: !1,
            showLabels: !0,
            infoWindow: z
        }), a.map.home = new c({
            map: a.map
        }, "HomeButton"), a.map.home.startup(), a.map.on("load", function () {
            this.on("mouse-move", v), this.on("mouse-drag", v)
        });
        var A = x(),
            B = a.config.layerDefProvider.getMapLayers(),
            C = _.map(B, function (a) {
                return new d(a.url, {
                    mode: a.isDynamic ? d.MODE_AUTO : d.MODE_SNAPSHOT,
                    outFields: ["*"],
                    id: a.id,
                    infoTemplate: new i(a.popUpParams)
                })
            });
        C = C.concat(w()), a.map.addLayers(C);
        var D = new o({
            map: a.map,
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
            url: a.config.layerDefProvider.getLayerUrlById("printService")
        }, p.byId("printButton"));
        D.startup(), u.once(C[0], "update-end", function () {
            a.formControls = new FormControls(a.config.layerDefProvider),
            a.formControls.setPrinter(D),
            a.legend = new Legend(a.map, "legend"),
            a.mapControls = new MapControls(a.map, a.config.layerDefProvider, a.legend),
            a.eventsProxy = new EventsProxy(a.formControls, a.mapControls),
            setTimeout(function () {
                a.map.setExtent(a.map.getLayer("plots").fullExtent.expand(1.2)), a.map.addLayer(A), a.map.on("resize", function (a) {
                    var b = a.target.extent;
                    setTimeout(function () {
                        a.target.setExtent(b)
                    }, 100)
                })
            }, 100)
        })
    }), a
}();