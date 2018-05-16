import React from 'react';
import ReactDOM from 'react-dom';

// Open Layers Imports
import ol from 'openlayers';


import './styles/styles.css'

class VicMap extends React.Component {
    constructor() {
        super();
        this.state = {
            map:null
        }
    }

    getWFS(cb) {
        var proxyUrl = 'https://cors-anywhere.herokuapp.com/';
        var url = 'http://geology.data.vic.gov.au/nvcl/ows?service=WFS&version=1.2.0&request=GetFeature&typeNames=mt:MineralTenement&cql_filter=mt:name=%27EL006759%27';
        // var response = async() => {await fetch(proxyUrl + url)};
        // var result = async() => { await response.text()};
        // console.log("result", result);
        
        var xhr = new XMLHttpRequest();
        xhr.open("GET", proxyUrl + url);
        xhr.send(null);
    }

    

    componentDidMount() {
        const lon = 145.416;
        const lat = -36.55075;

        var center = ol.proj.fromLonLat([lon, lat]);
        var lakeEntrance = ol.proj.fromLonLat([147.991605, -37.879584]);
        
        const markerSource = new ol.source.Vector();

        // var rnd = Math.random();

        var markerStyle = [
                    new ol.style.Style({
                        image: new ol.style.Icon(({
                            scale: 1,
                            // rotateWithView: (rnd < 0.9) ? true : false,
                            // rotation: 360 * rnd * Math.PI / 180,
                            rotateWithView: false,
                            rotation: 0,
                            anchor: [0.5, 1],
                            anchorXUnits: 'fraction',
                            anchorYUnits: 'fraction',
                            opacity: 1,
                            src: 'img/marker.png'
                            // src: 'http://2.bp.blogspot.com/_Sdh3wYnDKG0/TUiIRjXEimI/AAAAAAAAQeU/bGdHVRjwlhk/s1600/map+pin.png'
                            // src: 'https://openlayers.org/en/v3.20.1/examples/data/icon.png'
                        }))
                    }),
                    new ol.style.Style({
                        image: new ol.style.Circle({
                            radius: 5,
                            fill: new ol.style.Fill({
                                color: 'rgba(230,120,30,0.7)'
                            })
                        })
                    })
                ];
        var iconFeature = new ol.Feature({
            geometry: new ol.geom.Point(lakeEntrance)
        });
        iconFeature.setStyle(markerStyle);
        markerSource.addFeature(iconFeature);      

                var myPolygon = new ol.geom.Polygon([[
                    ol.proj.fromLonLat([143.56143470000006, -35.3405225], 'EPSG:3857'), 
                    ol.proj.fromLonLat([147.991605, -37.879584], 'EPSG:3857'), 
                    ol.proj.fromLonLat([144.96328, -37.814107], 'EPSG:3857')
                ]]);
                var mynewF = new ol.Feature({
                    geometry: myPolygon,
                    style : new ol.style.Style({
                        stroke: new ol.style.Stroke({
                            color: 'blue',
                            width: 3
                        }),
                        fill: new ol.style.Fill({
                            color: 'rgba(0, 0, 255, 0.1)'
                        })
                    }),
                });

         var vectorSource = new ol.source.Vector({}); 
         vectorSource.addFeature(mynewF);
                
         var map = new ol.Map({
             layers: [
                new ol.layer.Tile({
                    source: new ol.source.OSM(),
                    name: 'osm'
                }),
                new ol.layer.Vector({
                  source: vectorSource
                }),
        
                new ol.layer.Vector({
                    source: markerSource,
                    name: 'markerSource'
                })
             ],
             target: 'map',
             view: new ol.View({
                center: center,
                zoom: 7
             })
         });
               
        // this.getWFS(function(data) {
        //     console.log(data);
        //     var wfs = new ol.format.WFS();
        //     var wfsData = wfs.readFeatures(data);
        //     console.log("wfsData", wfsData);
        // });
        // var proxyUrl = 'https://cors-anywhere.herokuapp.com/';
        // var url = 'http://geology.data.vic.gov.au/nvcl/ows?service=WFS&version=1.1.0&request=GetFeature&typeNames=mt:MineralTenement&cql_filter=mt:name=%27WA1416%27';
        // // var response = async() => {await fetch(proxyUrl + url)};
        // // var result = async() => { await response.text()};
        // // console.log("result", result);
        
        // var xhr = new XMLHttpRequest();
        // xhr.open("GET", proxyUrl + url, false);
        // xhr.setRequestHeader("Access-Control-Allow-Headers", "x-requested-with, x-requested-by");
        // xhr.send(null);
        // var xml = xhr.responseXML;
        // console.log("xhr.responseText", xml);

        // var format = new ol.format.GML2();
        // var sampleFeatures = format.readFeatures(xml,{ featureType: "feature"});
        // console.log("sampleFeatures-response", sampleFeatures);
        
        // var path = "/*[local-name()='FeatureCollection']/*[local-name()='featureMembers']/*[local-name()='MineralTenement']/*[local-name()='shape']/*[local-name()='MultiSurface']/*[local-name()='surfaceMember']/*[local-name()='Polygon']/*[local-name()='interior']/*[local-name()='LinearRing']/*[local-name()='posList']";
        // var path = "wfs:FeatureCollection/gml:featureMembers/mt:MineralTenement/mt:shape/gml:MultiSurface/gml:surfaceMember/gml:Polygon/gml:interior/gml:LinearRing/gml:posList";
        // if (typeof xml.evaluate !== 'undefined') {
        //     var result = xml.evaluate(
        //         path,
        //         xml,
        //         function(prefix) {
        //             if (prefix === 'wfs') {
        //                 return 'http://www.opengis.net/wfs';
        //             } else if (prefix === 'gml') {
        //                 return 'http://www.opengis.net/gml';
        //             } else if (prefix === 'mt') {
        //                 return 'http://xmlns.geoscience.gov.au/mineraltenementml/1.0';
        //             } else {
        //                 return null;
        //             }
        //         },
        //         XPathResult.ANY_TYPE,
        //         null
        //     );

        //     var resultData = result.iterateNext();
        //     while(resultData) {
        //         console.log(resultData.childNodes[0].nodeValue);
        //         resultData = result.iterateNext();
        //     }
        // }

        // this.demo();
        // var nodes = xml.evaluate(path, xml, null, XPathResult.ANY_TYPE, null);
        // var resultData = nodes.iterateNext();
        // while(resultData) {
        //     console.log(resultData.childNodes[0].nodeValue);
        //     resultData = nodes.iterateNext();
        // }
        // var xml = this.parseXml(xhr.responseText);
        // console.log('xml', xml);
        // var wfs = new ol.format.WFS({
        //         featureNS: 'http://www.opengis.net/wfs, http://www.opengis.net/gml, http://xmlns.geoscience.gov.au/mineraltenementml/1.0',
        //         featureType: 'MineralTenementType',
        //         gmlFormat: new ol.format.GML2({
        //             featureNS: 'http://xmlns.geoscience.gov.au/mineraltenementml/1.0',
        //             featureType: 'MineralTenementType',
        //             schemaLocation: 'http://schemas.geoscience.gov.au/MineralTenementML/1.0/mineraltenementml.xsd'
        //         }),
        //         schemaLocation: 'http://schemas.geoscience.gov.au/MineralTenementML/1.0/mineraltenementml.xsd'
        //     });
        // var wfsData = wfs.readFeatures(xhr.responseText);
        // console.log("wfsData", wfsData);

        //  var vectorSource = new ol.source.Vector({
        //      format: new ol.format.GeoJSON(),
        //      crossOrigin: 'anonymous',
        //      url: 'http://geology.data.vic.gov.au/nvcl/ows?service=WFS&version=1.1.0&request=GetFeature&typeNames=mt:MineralTenement&cql_filter=mt:name=%27EL006759%27',
        //     //  url: 'http://52.65.91.200/nvcl/ows?service=WFS&version=1.1.0&request=GetFeature&typeNames=mt:MineralTenement&cql_filter=mt:name=%27EL006759%27',
        //      strategy: ol.loadingstrategy.bbox
        //  });   
        // var feature = new ol.format.WFS();
        // var wfsFeature = null;
        // var vectorSource = new ol.source.Vector({
        //     // format: new ol.format.WFS({
        //     //     featureNS: 'http://www.opengis.net/wfs/2.0',
        //     //     featureType: 'Test'
        //     // }),
        //     format: new ol.format.GML2(),
        //     loader: function() {
        //         var proxyUrl = 'https://cors-anywhere.herokuapp.com/';
        //         var url = 'http://geology.data.vic.gov.au/nvcl/ows?service=WFS&version=1.1.0&request=GetFeature&typeNames=mt:MineralTenement&cql_filter=mt:name=%27EL006759%27';
        //         var xhr = new XMLHttpRequest();
        //         xhr.open("GET", proxyUrl + url, false);
        //         xhr.setRequestHeader("Access-Control-Allow-Headers", "x-requested-with, x-requested-by");
        //         xhr.send(null);
        //         var xml = xhr.responseXML;
        //         console.log("xhr.responseText", xml);

        //         var format = new ol.format.GML2();
        //         var sampleFeatures = format.readFeatures(xml,{ featureType: "feature"});
        //         console.log("sampleFeatures-response", sampleFeatures);
        //         // vectorSource.addFeatures(sampleFeatures);
        //         for( const f  of sampleFeatures) {
        //             console.log(f);
        //             vectorSource.addFeature(f);
        //         }
                
        //         // var mynewF = new ol.Feature({
        //         //     name: "MyNewF",
        //         //     geometry: myPolygon
        //         // });
        //         // vectorSource.addFeature(mynewF);
        //         // console.log(vectorSource.getFeatures());
                
        //         // map.getView().fit(vectorSource.getExtent(), (map.getSize()));
        //         // fetch(proxyUrl + url)
        //         // fetch(url, {
        //         //     mode:'no-cors'
        //         // })
        //             // .then((response) => {
        //             //     console.log("Response: ", response);
        //             //     return response.text();
        //             // })
        //             // .then(
        //             //     (result) => {
        //             //         console.log(result);
        //             //         wfsFeature = feature.readFeatures(result);
        //             //     },
        //             //     (error) => {
        //             //         console.error(error);
        //             //     }
        //             // )
        //             // .then(function(response) {
        //             //     console.log("Response", response);
        //             //     var xmlResponse = response.text();
        //             //     console.log("Response-Text", xmlResponse);
        //             //     // console.log("json", response.json());
        //             //     var myFormat = new ol.format.GML2();
        //             //     var myFeature = myFormat.readFeatures(xmlResponse,{ featureType: "feature"});
        //             //     vectorSource.addFeatures(myFeature);
        //                 // map.getView().fit(vectorSource.getExtent(), (map.getSize()));
        //                 //     (map.getSize)
        //                 // );
        //                 // var vector = new ol.layer.Vector({
        //                 //     name: 'wfs',
        //                 //     source: vectorSource,
        //                 //     visible: true
        //                 // });
        //                 // map.addLayer(vector);
        //                 // map.changed();
        //                 // map.renderSync();


        // //                 var mapLayers = map.getLayers();
        // // console.log('size', mapLayers.getLength());
        // // console.log('mapLayers', mapLayers);
        // // mapLayers.forEach((f) => {
        // //     console.log(f.get('name'));
        // //     if ('wfs' === f.get('name')) {
        // //         console.log('wfs', f);
        // //         f.changed();
        // //         map.renderSync();
        // //     }
        // // });
        // //             })
        //     },
        //     // strategy: new ol.loadingstrategy.tile(ol.tilegrid.createXYZ({
        //     //         maxZoom: 19
        //     // })),
        //     projection: 'epsg:3857'
        // });

        // console.log('vectorSource', vectorSource.getFeatures());
        //  vectorSource.addFeatures(wfsFeature);
        //  var vector = new ol.layer.Vector({
        //      name: 'wfs',
        //      source: vectorSource,
        //     //  style: new ol.style.Style({
        //     //      stroke: new ol.style.Stroke({
        //     //         color: 'rgba(0, 0, 255, 1.0)',
        //     //         width: 2
        //     //     })
        //     //  }),
        //      visible: true
        //  });


        // var layer = [
        //     new ol.layer.Tile({
        //         source: new ol.source.OSM(),
        //         name: 'osm'
        //     })
        //     ,
        //     // new ol.layer.Tile({
        //     //     source: new ol.source.TileWMS({
        //     //         url: 'http://vmap0.tiles.osgeo.org/wms/vmap0',
        //     //         params: {'LAYERS': 'basic'},
        //     //         serverType: 'geoserver',
        //     //         transition: 0
        //     //     })
        //     // })
        //     // ,
        //     // new ol.layer.Tile({
        //     //     source: new ol.source.TileWMS({
        //     //         url: 'http://geology.data.vic.gov.au/nvcl/mt/wms?',
        //     //         params: {'LAYERS': 'mt:MineralTenement'},
        //     //         serverType: 'geoserver',
        //     //         transition:0
        //     //     })
        //     // }),
        //     vector,
        //     // new ol.layer.Tile({
        //     //  source: vector
        //     // }),
        //     newLayer,
        //     new ol.layer.Vector({
        //         source: markerSource,
        //         name: 'markerSource'
        //     })
        // ];

        // let map = new ol.Map({
        //     layers: layer,
        //     target: 'map',
        //     view: new ol.View({
        //         center: center,
        //         zoom: 7
        //     })
        // }); 

        // var iconFeature = new ol.Feature({
        //     geometry: new ol.geom.Point(lakeEntrance)
        // });
        // iconFeature.setStyle(markerStyle);
        // markerSource.addFeature(iconFeature);
        // // markerSource.addFeatures(vectorSource.getFeatures());

        // // map.addLayer(new ol.layer.Tile({
        // //     source: vector,
        // //     visible: true
        // // }));
        // // map.addLayer(vector);
        // var mapLayers = map.getLayers();
        // console.log('size', mapLayers.getLength());
        // console.log('mapLayers', mapLayers);
        // mapLayers.forEach((f) => {
        //     console.log(f.get('name'));
        //     if ('wfs' === f.get('name')) {
        //         console.log('wfs', f);
        //     }
        // });

        // // this.setState({
        // //     map: map
        // // }, (prevState, map) => {
        // //     map: map
        // // });

        // this.gmlFormateDemo();
    }

    render() {
        return (
            <div className='ten_map'>
                <h2>Victoria Tenement map</h2>
                <div id = 'map'> {this.state.map} </div> 
            </div>
        );
    }
}

class App extends React.Component {
    render() {
        return (
            <div className='App'>
                <VicMap />
            </div>
        );
    }
}

ReactDOM.render( < App / > , document.getElementById('root'));