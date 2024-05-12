/* eslint-disable */
import React, { Component } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';



class Map extends Component {
  constructor(props) {
    super(props);
    this.state = {
      map: null,
      tileLayer: null,
      coordinates: null
    };
    this._mapNode = null;
    this.init = this.init.bind(this);
    this.fetchCoordinates = this.fetchCoordinates.bind(this);
  }

  componentDidMount() {
    // Poziv f-je prvi put
    this.fetchCoordinates();
    // Poziv f-je na svakih 250ms
    this.interval = setInterval(() => {
      this.fetchCoordinates();
    }, 250);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  fetchCoordinates() {
    fetch('http://localhost:5000/coordinates') 
      .then(response => response.json())
      .then(data => {
        // Ako su se koordinate promenile rerenderuj mapu
        if (!this.state.coordinates || JSON.stringify(data.coordinates) !== JSON.stringify(this.state.coordinates)) {
          this.setState({ coordinates: data.coordinates });
          this.init(this._mapNode, data.coordinates);
        }
      })
      .catch(error => console.error('Error fetching coordinates:', error));
  }
  
  init(id, coordinates) {
    // Ako mapa vec postoji, brisem je
    if (this.state.map) {
      this.state.map.remove();
    }
  
    let map = L.map(id, {
      center: coordinates,
      zoomControl: false,
      zoom: 13,
      maxZoom: 19,
      minZoom: 11,
      scrollwheel: false,
      legends: true,
      infoControl: false,
      attributionControl: true
    });
    
    L.control.zoom({ position: "bottomleft"}).addTo(map);
    L.control.scale({ position: "topleft"}).addTo(map);
    
    L.tileLayer('http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png', {
      minZoom: 11,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
      id: '',
      accessToken: ''
    }).addTo(map);

    // Pozicija na centru- tacka
    L.circleMarker(coordinates, {
      radius: 6, 
      color: '#1f78b4',
      fillColor: '#1ffff1', 
      fillOpacity: 0.6 
    }).addTo(map);
    
    
    this.setState({ map });
  }

  render() {
    return (
      <div id="mapUI" style={{ position: 'relative' }}>
        <div ref={(node) => this._mapNode = node} id="map" />
      </div>
    );
  }
}

export default Map;
