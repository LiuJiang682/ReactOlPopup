
import React from 'react';
import ReactDOM from 'react-dom';

// Open Layers Imports
import ol from 'openlayers';

import Proj4 from '../node_modules/proj4';

import './styles/styles.css'

class VicMap extends React.Component {

  constructor() {
    super();
    this.state = {
      map: null
    };
  }

   componentDidMount() {
var xml = 'https://gist.githubusercontent.com/ahocevar/f6e7f1c9922f7ba9a7b987d21e5474e3/raw/74291e39afd0347535ff699a72af4539b8472849/test.xml';

Proj4.defs("EPSG:27700","+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.9996012717 +x_0=400000 +y_0=-100000 +ellps=airy +towgs84=446.448,-125.157,542.06,0.15,0.247,0.842,-20.489 +units=m +no_defs");

var vector = new ol.layer.Vector({
  source: new ol.source.Vector({
    url: xml,
    format: new ol.format.GML({
      featureNS: 'http://mapserver.gis.umn.edu/mapserver',
      featureType: 'WFSLayer'
    })
  })
});

var map = new ol.Map({
  target: 'map',
  layers: [vector],
  view: new ol.View({
    center: [0, 0],
    zoom: 0
  })
});
   
// vector.getSource().once('change', function(e) {
//   console.log(e.target.getFeatures())
//   map.getView().fit(e.target.getExtent());
// });
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