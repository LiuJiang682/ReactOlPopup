import React from 'react';
import ReactDOM from 'react-dom';

// Open Layers Imports
import ol from 'openlayers';
import 'ol/ol.css';
import VectorLayer from 'ol/layer/vector';
import VectorSource from 'ol/source/vector';
import Feature from 'ol/feature';
import Point from 'ol/geom/point';
import Style from 'ol/style/style';
import IconStyle from 'ol/style/icon';
// import {
//   interaction, layer, custom, control, //name spaces
//   Interactions, Overlays, Controls,     //group
//   proj, source, View, 
//   Map, Layers, Overlay, Util    //objects
// } from "react-openlayers";

// Proj4 imports
import Proj4 from '../node_modules/proj4';

import './styles/styles.css'

class Popup extends React.Component  {
  constructor(props) {
    super(props);
    this.state = {
      map: null
    };
  }

  /**componentWillMount() {
    const script = document.createElement("script");
    script.src="http://epsg.io/28355.js";
    script.async=false;
    document.body.appendChild(script);
  }*/

  componentDidMount() {
    Proj4.defs("EPSG:4283", "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs");
    Proj4.defs("EPSG:28354", "+proj=utm +zone=54 +south +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs");
    Proj4.defs("EPSG:28355", "+proj=utm +zone=55 +south +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs");

    /** 
    var epsg28355 = new ol.proj.Projection({
      code: 'EPSG:28355',
      extent: [-2250078.81, 4558518.52, 1235090.03, 8902692.39],
    });
    ol.proj.addProjection(epsg28355);*/
    // ol.proj.setProj4(Proj4);
    ol.proj.setProj4(Proj4);
    ol.proj.get('EPSG:28355').setExtent([-2250078.81, 4558518.52, 1235090.03, 8902692.39]);
    var birmingham = ol.proj.transform([587203.52, 5807081.89], 'EPSG:28355', 'EPSG:3857');
    var epsg28355 = new ol.proj.Projection({
      code: 'EPSG:28355',
      extent: [-2250078.81, 4558518.52, 1235090.03, 8902692.39],
      units: 'm'
    });
    console.log(epsg28355);
    var epsg3857 = ol.proj.get('EPSG:3857');

    const markerSource = new ol.source.Vector();

    var fill = new ol.style.Fill({
   color: 'rgba(255,255,255,0.4)'
 });
 var stroke = new ol.style.Stroke({
   color: '#3399CC',
   width: 1.25
 });
//  var image = new ol.style.Circle({
//        fill: fill,
//        stroke: stroke,
//        radius: 5
//  });
var rnd = Math.random();
var image = new ol.style.Icon({
  color: '#8959A8',
  crossOrigin: 'anonymous',
  scale: 1 + rnd,
  rotateWithView: (rnd < 0.9) ? true : false,
  rotation: 360 * rnd * Math.PI / 180,
  anchor: [0.5, 1],
  anchorXUnits: 'fraction',
  anchorYUnits: 'fraction',
  opacity: rnd,
  // src: 'https://openlayers.org/en/v4.6.5/examples/data/dot.png'
  // src: 'data/icon.png'
  src: 'https://openlayers.org/en/v3.20.1/examples/data/icon.png'
});



// var markerStyle = new ol.style.Style({
//   // image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
//   //   src: '//openlayers.org/en/v4.6.5/examples/data/icon.png'
//   // })),
//   image: image,
//   fill: fill,
//   stroke: stroke
// });
var markerStyle = [
                    new ol.style.Style({
                        image: new ol.style.Icon(({
                            scale: 1 + rnd,
                            rotateWithView: (rnd < 0.9) ? true : false,
                            rotation: 360 * rnd * Math.PI / 180,
                            anchor: [0.5, 1],
                            anchorXUnits: 'fraction',
                            anchorYUnits: 'fraction',
                            opacity: rnd,
                            // src: icons[ Math.floor(rnd * (icons.length-1) ) ]
                            src: 'https://openlayers.org/en/v3.20.1/examples/data/icon.png'
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

    let map = new ol.Map({
      layers: [
        new ol.layer.Tile({
          source: new ol.source.OSM()
        }),
        new ol.layer.Vector({
          source: markerSource,
          // style: markerStyle,
        }),
      ],
      target: 'map',
      view: new ol.View({
        center: birmingham,
        zoom: 10
      })
    });

    var iconFeature = new ol.Feature({
      geometry: new ol.geom.Point(birmingham),
      // style: markerStyle,
    });
    iconFeature.setStyle(markerStyle);
    markerSource.addFeature(iconFeature);
    // const feature = (require('ol/feature')).default;
    // const position = new VectorSource();
    // const vector = new VectorLayer({
    //   source: position
    // });
    // vector.setStyle(new Style({
    //   image: new IconStyle({
    //     src: 'https://openlayers.org/en/v4.6.4/examples/data/icon.png'
    //   })
    // }));
    // map.addLayer(vector);
    // var point = ol.proj.transform([147.991605, -37.879584], 'EPSG:4283', 'EPSG:3857');
    // var proj = new ol.Projection('EPSG:3857');
    // point.transform(proj, map.getProjectionObject());
    // position.addFeature(point);
    // position.addFeature(new Feature(new Point([birmingham[0], birmingham[1]])));
    // var point = new Point([birmingham[0], birmingham[1]]);
    // var feature = new Feature(point);
    // position.addFeature(feature);
    
    // map.addOverlay(new ol.Overlay({
    //     position: birmingham,
    //     element: document.getElementById('marker'),
    // }));
  }

  render() {
    return ( <div className = 'popup' >
                <div className = 'popup_inner' >
                  <h1> {this.props.text} </h1> 
                  <button onClick = {this.props.closePopup}> close me </button> 
                  <div id = 'map'> {this.state.map} </div> 
                </div> 
              </div>
    );
  }
}

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      showPopup: false
    };
  }
  togglePopup() {
    this.setState({
      showPopup: !this.state.showPopup
    });
  }
  render() {
    return ( <div className = 'app' >
                <h1> hihi </h1> 
                <button onClick = {this.togglePopup.bind(this)} > show popup </button> {
        this.state.showPopup ?
          <Popup text = 'Close Me' closePopup = {
                this.togglePopup.bind(this)
            }/>: null
      } </div>
    );
  }
};

ReactDOM.render( < App / > , document.getElementById('root'));