function LayerDefProvider() {
    "use strict";
    //var _agolBaseUrl = "http://services5.arcgis.com/5S0ohqvmPCVhAd0m";
    var _agolBaseUrl = "http://services6.arcgis.com/MvtoRtbPLfOd9STi";
    var layers = [
        {
            id: "plots", drawable: true, url: _agolBaseUrl + "/arcgis/rest/services/soilsystem_05_2018_noRelation/FeatureServer/2",
            popUpParams: {
                title: 'מספר חלקה {PLOT_NO}',
                fieldInfos: [
                    {
                        fieldName: 'PLOT_NO',
                        visible: false
                    }, {
                        fieldName: 'OBJECTID',
                        label: "מספר רץ",
                        visible: true
                    }, {
                        fieldName: 'hebName',
                        label: "משק",
                        visible: true
                    }, {
                        fieldName: "settleCode",
                        label: "קוד משק",
                        visible: true
                    }, {
                        fieldName: "hebDesc",
                        label: "תיאור",
                        visible: true
                    }, {
                        fieldName: "Area",
                        label: "שטח",
                        visible: true,
                        format: { places: 1 }


                    }
                ]
            }
        },
        { id: "symbology", url: _agolBaseUrl + "/arcgis/rest/services/soilsystem_05_2018_noRelation/FeatureServer/0" },
        {
            id: "pits", drawable: true, url: _agolBaseUrl + "/arcgis/rest/services/soilsystem_05_2018_noRelation/FeatureServer/1",
            popUpParams: {
                title: 'מספר בור  {OBJECTID}',
                fieldInfos: [
                    {
                        fieldName: 'SurveyId',
                        label: "מספר סקר",
                        visible: false
                    }, {
                        fieldName: 'OBJECTID',
                        label: "מספר רץ",
                        visible: false
                    }, {
                        fieldName: 'Conclusions',
                        label: "מסקנות",
                        visible: true
                    }, {
                        fieldName: "PitNumberInSurvey",
                        label: "מספר בור בסקר",
                        visible: true
                    }
                ]
            }
        },
        { id: "fieldData", url: _agolBaseUrl + "/arcgis/rest/services/soilsystem_05_2018_noRelation/FeatureServer/10" },
        { id: "fieldDataTableColors", url: _agolBaseUrl + "/arcgis/rest/services/soilsystem_05_2018_noRelation/FeatureServer/8" },
        { id: "labData", url: _agolBaseUrl + "/arcgis/rest/services/soilsystem_05_2018_noRelation/FeatureServer/6" },
        { id: "labDataRanges", url: _agolBaseUrl + "/arcgis/rest/services/soilsystem_05_2018_noRelation/FeatureServer/5" },
        { id: "meshakim", url: _agolBaseUrl + "/arcgis/rest/services/soilsystem_05_2018_noRelation/FeatureServer/3" },
        { id: "surveys", drawable: false, url: _agolBaseUrl + "/ArcGIS/rest/services/soilsystem_05_2018_noRelation/FeatureServer/9" },
        { id: "surveyAttachments", drawable: false, url: _agolBaseUrl + "/ArcGIS/rest/services/soilsystem_05_2018_noRelation/FeatureServer/12" },
        { id: "geoService", drawable: false, url: "http://tasks.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer" },
        { id: "printService", drawable: false, url: "https://sampleserver6.arcgisonline.com/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task" }
    ];



    this.getGeoService = function () {
        return this.getLayerUrlById("geoService");
    }


    this.getLayerUrlById = function (id) {
        return _.find(layers, function (item) {
            return item.id === id;
        }).url;
    }

    this.getMapLayers = function () {
        var drawableLayers = [];

        _.each(layers, function (layer) {
            if (layer.drawable) {
                drawableLayers.push(layer);
            }
        });
        return drawableLayers;
    }
}