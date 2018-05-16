 import React from 'react';
 import ReactDOM from 'react-dom';

 import ol from 'openlayers';

 // Proj4 imports
import Proj4 from '../node_modules/proj4';

 import './styles/styles.css'

 class Popup extends React.Component {
     constructor(props) {
    super(props);
    this.state = {
      map: null
    };
  }

  componentDidMount() {
    Proj4.defs("EPSG:4283", "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs");
    Proj4.defs("EPSG:28354", "+proj=utm +zone=54 +south +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs");
    Proj4.defs("EPSG:28355", "+proj=utm +zone=55 +south +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs");

    ol.proj.setProj4(Proj4);
    ol.proj.get('EPSG:28355').setExtent([-2250078.81, 4558518.52, 1235090.03, 8902692.39]);
    var birmingham = ol.proj.transform([587203.52, 5807081.89], 'EPSG:28355', 'EPSG:3857');
 // Icons
            var icons = [
                "https://openlayers.org/en/v3.20.1/examples/data/icon.png",
                "images/mapiconscollection-weather/anemometer_mono.png",
                "images/mapiconscollection-weather/cloudy.png",
                "images/mapiconscollection-weather/cloudysunny.png",
                "images/mapiconscollection-weather/moonstar.png",
                "images/mapiconscollection-weather/rainy.png",
                "images/mapiconscollection-weather/snowy-2.png",
                "images/mapiconscollection-weather/sunny.png",
                "images/mapiconscollection-weather/thunderstorm.png",
                "images/mapiconscollection-weather/tornado-2.png",
                "images/mapiconscollection-weather/umbrella-2.png",
                "images/mapiconscollection-weather/wind-2.png"
            ];

            // Create random point features
            var i, lat, lon, geom, feature, features = [], style, rnd;
            for(i=0; i< 1; i++) {
                lat = Math.random() * 174 - 87;
                lon = Math.random() * 360 - 180;
                // lat = birmingham[0];
                // lon = birmingham[1];

                geom = new ol.geom.Point(
                    ol.proj.transform([587203.52, 5807081.89], 'EPSG:28355', 'EPSG:3857')
                );

                feature = new ol.Feature(geom);
                features.push(feature);

                rnd = Math.random();
                style = [
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
                            src: icons[0]
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

                feature.setStyle(style);
            }    

            // Source and vector layer
            var vectorSource = new ol.source.Vector({
                features: features
            });

            var vectorLayer = new ol.layer.Vector({
                source: vectorSource
            });

            // Maps
            var map = new ol.Map({
                target: 'map',  // The DOM element that will contains the map
                renderer: 'canvas', // Force the renderer to be used
                layers: [
                    // Add a new Tile layer getting tiles from OpenStreetMap source
                    new ol.layer.Tile({
                        source: new ol.source.OSM()
                    }),
                    vectorLayer
                ],
                // Create a view centered on the specified location and zoom level
                view: new ol.View({
                    center: birmingham,
                    zoom: 10
                }),
                interactions: ol.interaction.defaults().extend([
                    new ol.interaction.DragRotateAndZoom()
                ])
            });
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
