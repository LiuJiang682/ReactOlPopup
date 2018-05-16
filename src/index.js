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

    parseXml(xmlString) {
        return new window.DOMParser().parseFromString(xmlString, "text/xml");
    }

    demo() {
        var xmlString = "<bookstore><book genre=\"autobiography\"><title>The Autobiography of Benjamin Franklin</title><author><first-name>Benjamin</first-name><last-name>Franklin</last-name></author><price>8.99</price></book><bk:book genre=\"novel\" bk:genre=\"fiction\" xmlns:bk=\"http://purl.org/dc/elements/1.1/\"><bk:title>The Confidence Man</bk:title><bk:author><bk:first-name>Herman</bk:first-name><bk:last-name>Melville</bk:last-name></bk:author><bk:price>11.99</bk:price></bk:book></bookstore>";
        var xml = new window.DOMParser().parseFromString(xmlString, "text/xml");
        var path="/bookstore/bk:book/bk:title";

if (typeof xml.evaluate !== 'undefined') {
  var result = xml.evaluate(
   path,
   xml,
   function (prefix) {
     if (prefix === 'bk') {
       return 'http://purl.org/dc/elements/1.1/';
     }
     else {
       return null;
     }
   },
   XPathResult.ANY_TYPE,
   null
  );
  // now use the code here you already have in your sample for evaluate 
  var resultData = result.iterateNext();
            while(resultData) {
                console.log(resultData.childNodes[0].nodeValue);
                resultData = result.iterateNext();
            }
}
    }

    gmlFormateDemo() {
        var data = '<?xml version="1.0" encoding="UTF-8"?> <gml:Polygon xmlns:gml="http://www.opengis.net/gml" xmlns:sch="http://www.ascc.net/xml/schematron" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:xs="http://www.w3.org/2001/XMLSchema" srsDimension="2">   <gml:exterior>      <gml:LinearRing srsDimension="2">         <gml:posList>37.15 36.15 37.15 36.3 37.5 36.3 37.5 36.15 37.15 36.15</gml:posList>      </gml:LinearRing>   </gml:exterior></gml:Polygon>';

var sampleGmlData = '<?xml version="1.0" encoding="UTF-8"?><wfs:FeatureCollection xmlns="http://www.opengis.net/wfs" xmlns:wfs="http://www.opengis.net/wfs" xmlns:geonode="http://worldmap.harvard.edu/" xmlns:gml="http://www.opengis.net/gml" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://worldmap.harvard.edu/ http://worldmap.harvard.edu/geoserver/wfs?service=WFS&amp;version=1.0.0&amp;request=DescribeFeatureType&amp;typeName=geonode%3Amypolygon_px6 http://www.opengis.net/wfs http://worldmap.harvard.edu/geoserver/schemas/wfs/1.0.0/WFS-basic.xsd"><gml:boundedBy><gml:null>unknown</gml:null></gml:boundedBy><gml:featureMember><geonode:mypolygon_px6 fid="mypolygon_px6.1"><geonode:the_geom><gml:Polygon srsName="http://www.opengis.net/gml/srs/epsg.xml#4326"><gml:outerBoundaryIs><gml:LinearRing><gml:coordinates xmlns:gml="http://www.opengis.net/gml" decimal="." cs="," ts=" ">79.39064025,11.67795814 79.40574645,11.6971218 79.44763182,11.68400996 79.44694518,11.65307702 79.42256926,11.6278574 79.39613341,11.63525539 79.39064025,11.67795814</gml:coordinates></gml:LinearRing></gml:outerBoundaryIs></gml:Polygon></geonode:the_geom><geonode:Name>Boundary1</geonode:Name><geonode:Description>This is sample boundary created for testing purpose&lt;BR&gt;</geonode:Description><geonode:Start_Date>2012-04-15T18:30:00</geonode:Start_Date><geonode:End_Date>2012-04-15T18:30:00</geonode:End_Date><geonode:String_Value_1>Surya</geonode:String_Value_1></geonode:mypolygon_px6></gml:featureMember></wfs:FeatureCollection>';


var format = new ol.format.GML3();

//try to parse your dataa
var features = format.readFeatures(data,{});
//try to parse sample gml data. NOTE: options must be optimized for correct result, but for  just checking if it works or not this is enough
var sampleFeatures = format.readFeatures(sampleGmlData,{ featureType: "feature"});

//print features of your data, resulting array is empty
console.log("features:");
console.log(features);

//print features of sample data. An array with 1 object is printed
console.log("SampleFeatures:");
console.log(sampleFeatures);

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

                console.log(ol.proj.fromLonLat([142.167381741667,-35.6702226583333 ], 'EPSG:3857'));
                var myPolygon = new ol.geom.Polygon([[
                    // ol.proj.fromLonLat([143.56143470000006, -35.3405225], 'EPSG:3857'), 
                    // ol.proj.fromLonLat([147.991605, -37.879584], 'EPSG:3857'), 
                    // ol.proj.fromLonLat([144.96328, -37.814107], 'EPSG:3857'),
                    ol.proj.fromLonLat([142.182273433333,-35.6700773416667], 'EPSG:3857'),
                    ol.proj.fromLonLat([142.167381741667,-35.6702226583333 ], 'EPSG:3857'),
                    ol.proj.fromLonLat([142.1671741,-35.6717005166667], 'EPSG:3857'),
                    ol.proj.fromLonLat([142.160824191667, -35.6702860666667], 'EPSG:3857'),
                    ol.proj.fromLonLat([142.147118283333, -35.670417425], 'EPSG:3857'),
                    ol.proj.fromLonLat([142.1471158, -35.6856514083333], 'EPSG:3857'),
                    ol.proj.fromLonLat([142.131645, -35.6856818083333], 'EPSG:3857'),
                    ol.proj.fromLonLat([142.133549491667, -35.6839782083333], 'EPSG:3857'),
                    ol.proj.fromLonLat([142.1357885,  -35.6779579083333], 'EPSG:3857'),
                    ol.proj.fromLonLat([142.1407558, -35.6754986083333], 'EPSG:3857'),
                    ol.proj.fromLonLat([142.14400355,  -35.6704470666667], 'EPSG:3857'),
                    ol.proj.fromLonLat([142.143498583333,  -35.6704518666667], 'EPSG:3857'),
                    ol.proj.fromLonLat([142.1404216,  -35.6752428083333], 'EPSG:3857'),
                    ol.proj.fromLonLat([142.136925983333,  -35.6705141083333], 'EPSG:3857'),
                    ol.proj.fromLonLat([142.127036808333, -35.6706070833333], 'EPSG:3857'),
                    ol.proj.fromLonLat([142.1271894,  -35.6814514166667], 'EPSG:3857'),
                    ol.proj.fromLonLat([142.127248325,  -35.68563905], 'EPSG:3857'),
                    ol.proj.fromLonLat([142.1275442, -35.7066657333333], 'EPSG:3857'),
                    ol.proj.fromLonLat([142.171753766667,  -35.7062434083333], 'EPSG:3857'),
                    ol.proj.fromLonLat([142.17135795, -35.6791998666667], 'EPSG:3857'), 
                    ol.proj.fromLonLat([142.182406341667, -35.6790861666667], 'EPSG:3857'), 
                    ol.proj.fromLonLat([142.167383, -35.6717812083333], 'EPSG:3857'), 
                    ol.proj.fromLonLat([142.182406341667, -35.6790861666667], 'EPSG:3857')
                ]]);
                var mynewF = new ol.Feature({
                    geometry: myPolygon
                });

                var myInterPolygon = new ol.geom.Polygon([[
                    ol.proj.fromLonLat([142.152154758333, -35.6837831083333], 'EPSG:3857'),
                    ol.proj.fromLonLat([142.152593725, -35.6837796166667], 'EPSG:3857'),
                    ol.proj.fromLonLat([142.154921525, -35.6837611], 'EPSG:3857'),
                    ol.proj.fromLonLat([142.154946458333, -35.6855667333333], 'EPSG:3857'),
                    ol.proj.fromLonLat([142.152180058333, -35.685581525], 'EPSG:3857'),
                    ol.proj.fromLonLat([142.149413658333, -35.6855962416667], 'EPSG:3857'),
                    ol.proj.fromLonLat([142.149387966667, -35.68380505], 'EPSG:3857'),
                    ol.proj.fromLonLat([142.149831358333, -35.6838015333333], 'EPSG:3857'),
                    ol.proj.fromLonLat([142.152154758333, -35.6837831083333], 'EPSG:3857')
                ]]);
                var myNewInterF = new ol.Feature({
                    geometry: myInterPolygon
                });

                var newLayer = new ol.layer.Vector({
                    name: 'myPolygon',
                    source: mynewF
                });

                var myPolygonSource = new ol.source.Vector();
                myPolygonSource.addFeature(mynewF);
                myPolygonSource.addFeature(myNewInterF);
               
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
        var vectorSource = new ol.source.Vector({
            // format: new ol.format.WFS({
            //     featureNS: 'http://www.opengis.net/wfs/2.0',
            //     featureType: 'Test'
            // }),
            format: new ol.format.GML2(),
            loader: function() {
                var proxyUrl = 'https://cors-anywhere.herokuapp.com/';
                var url = 'http://geology.data.vic.gov.au/nvcl/ows?service=WFS&version=1.1.0&request=GetFeature&typeNames=mt:MineralTenement&cql_filter=mt:name=%27EL006759%27';
                var xhr = new XMLHttpRequest();
                // xhr.open("GET", proxyUrl + url, false);
                // xhr.setRequestHeader("Access-Control-Allow-Headers", "x-requested-with, x-requested-by");
                // xhr.send(null);
                // var xml = xhr.responseXML;
                // console.log("xhr.responseText", xml);
                var xml;
                // xhr.onreadystatechange = function() {
                //     if (this.readyState == 4 && this.status == 200) {
                //         xml = xhr.responseXML;
                     
                //     }
                // };
                // xhr.open("GET", proxyUrl + url, true);
                // xhr.setRequestHeader("Access-Control-Allow-Headers", "x-requested-with, x-requested-by");
                // xhr.send();

                fetch(proxyUrl + url)
                    .then(response => response.text())
                    .then(str => (new window.DOMParser()).parseFromString(str, "text/xml"))
                    .then(data => {
                        console.log(data);
                           var posList = [];
                var shapeXml = data.getElementsByTagName('posList');
                for(const shape of shapeXml) {
                    // console.log(shape.firstChild.textContent);
                    posList.push(shape.firstChild.textContent);
                }

                var polygons = [];
                for (var string of posList) {
                    var polygonPos = [];
                    var poses = string.split(" ");
                    var index = 0;
                    while (index < poses.length) {
                        const latPos = parseFloat(poses[index]);
                        const lonPos = parseFloat(poses[++index]);
                        // console.log(latPos, lonPos);
                        // var coords = [lonPos, latPos];

                        polygonPos.push(ol.proj.fromLonLat([lonPos,latPos], 'EPSG:3857'));
                        
                        ++index;
                    }
                    var polygon = new ol.geom.Polygon([polygonPos]);
                    polygons.push(polygon);
                }
                
                for (const p of polygons) {
                    var myNewF = new ol.Feature({
                        geometry: p
                    });
                    vectorSource.addFeature(myNewF);
                }
                    });

                // var polygonFeatures = new ol.format.WFS({
                //     featureNS: 'http://www.opengis.net/gml',
                //     featureType: ['posList']
                // })
                //     .readFeatures(xml);
                // console.log(polygonFeatures);

                

                var format = new ol.format.GML2();
                // var sampleFeatures = format.readFeatures(xml,{ 
                //     featureType: "feature"
                // });
                var sampleFeatures = format.readFeatures(xml, {
                    // featureNS: "http://www.opengis.net/gml",
                    // featureType: "Shape"
                    featureNS: {
                        'mt':'http://xmlns.geoscience.gov.au/mineraltenementml/1.0', 
                        'gml':'http://www.opengis.net/gml'
                    },
                    // featureType: "MineralTenement"
                    featureType: ['mt:MineralTenement', 'gml:shape']
                });

                console.log("sampleFeatures-response", sampleFeatures);
                // vectorSource.addFeatures(sampleFeatures);
                for( const f  of sampleFeatures) {
                    console.log(f);
                    console.log('geometry', f.getGeometry());
                    console.log('f.getGeometryName', f.getGeometryName());
                    f.setGeometryName('Shape');
                    console.log('geometry', f.getGeometry());
                    // console.log('getShape', f.getShape());
                    var props = f.getProperties();
                    // for(const p of props) {
                    //     console.log(p);
                    // }
                    vectorSource.addFeature(f);
                }
                
                // var mynewF = new ol.Feature({
                //     name: "MyNewF",
                //     // geometry: myPolygon
                //     geometry: polygon
                // });
                // console.log('MyNewF.geometry', mynewF.getGeometry());
                // vectorSource.addFeature(mynewF);
                // console.log(vectorSource.getFeatures());
                
                // map.getView().fit(vectorSource.getExtent(), (map.getSize()));
                // fetch(proxyUrl + url)
                // fetch(url, {
                //     mode:'no-cors'
                // })
                    // .then((response) => {
                    //     console.log("Response: ", response);
                    //     return response.text();
                    // })
                    // .then(
                    //     (result) => {
                    //         console.log(result);
                    //         wfsFeature = feature.readFeatures(result);
                    //     },
                    //     (error) => {
                    //         console.error(error);
                    //     }
                    // )
                    // .then(function(response) {
                    //     console.log("Response", response);
                    //     var xmlResponse = response.text();
                    //     console.log("Response-Text", xmlResponse);
                    //     // console.log("json", response.json());
                    //     var myFormat = new ol.format.GML2();
                    //     var myFeature = myFormat.readFeatures(xmlResponse,{ featureType: "feature"});
                    //     vectorSource.addFeatures(myFeature);
                        // map.getView().fit(vectorSource.getExtent(), (map.getSize()));
                        //     (map.getSize)
                        // );
                        // var vector = new ol.layer.Vector({
                        //     name: 'wfs',
                        //     source: vectorSource,
                        //     visible: true
                        // });
                        // map.addLayer(vector);
                        // map.changed();
                        // map.renderSync();


        //                 var mapLayers = map.getLayers();
        // console.log('size', mapLayers.getLength());
        // console.log('mapLayers', mapLayers);
        // mapLayers.forEach((f) => {
        //     console.log(f.get('name'));
        //     if ('wfs' === f.get('name')) {
        //         console.log('wfs', f);
        //         f.changed();
        //         map.renderSync();
        //     }
        // });
        //             })
            },
            // strategy: new ol.loadingstrategy.tile(ol.tilegrid.createXYZ({
            //         maxZoom: 19
            // })),
            projection: 'epsg:3857'
        });

        console.log('vectorSource', vectorSource.getFeatures());
        //  vectorSource.addFeatures(wfsFeature);
         var vector = new ol.layer.Vector({
             name: 'wfs',
             source: vectorSource,
            //  style: new ol.style.Style({
            //      stroke: new ol.style.Stroke({
            //         color: 'rgba(0, 0, 255, 1.0)',
            //         width: 2
            //     })
            //  }),
             visible: true
         });

         var polygonVector = new ol.layer.Vector({
             source: myPolygonSource,
             visible: true
         });

        var layer = [
            new ol.layer.Tile({
                source: new ol.source.OSM(),
                name: 'osm'
            })
            ,
            // new ol.layer.Tile({
            //     source: new ol.source.TileWMS({
            //         url: 'http://vmap0.tiles.osgeo.org/wms/vmap0',
            //         params: {'LAYERS': 'basic'},
            //         serverType: 'geoserver',
            //         transition: 0
            //     })
            // })
            // ,
            // new ol.layer.Tile({
            //     source: new ol.source.TileWMS({
            //         url: 'http://geology.data.vic.gov.au/nvcl/mt/wms?',
            //         params: {'LAYERS': 'mt:MineralTenement'},
            //         serverType: 'geoserver',
            //         transition:0
            //     })
            // }),
            // vector,
            // newLayer,
            // new ol.layer.Tile({
            //  source: vector
            // }),
            polygonVector,
            new ol.layer.Vector({
                source: markerSource,
                name: 'markerSource'
            })
        ];

        let map = new ol.Map({
            layers: layer,
            target: 'map',
            view: new ol.View({
                center: center,
                zoom: 7
            })
        }); 

        var iconFeature = new ol.Feature({
            geometry: new ol.geom.Point(lakeEntrance)
        });
        iconFeature.setStyle(markerStyle);
        markerSource.addFeature(iconFeature);
        // markerSource.addFeatures(vectorSource.getFeatures());

        // map.addLayer(new ol.layer.Tile({
        //     source: vector,
        //     visible: true
        // }));
        // map.addLayer(vector);
        // var mapLayers = map.getLayers();
        // console.log('size', mapLayers.getLength());
        // console.log('mapLayers', mapLayers);
        // mapLayers.forEach((f) => {
        //     console.log(f.get('name'));
        //     if ('wfs' === f.get('name')) {
        //         console.log('wfs', f);
        //     }
        // });

        // this.setState({
        //     map: map
        // }, (prevState, map) => {
        //     map: map
        // });

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