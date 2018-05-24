import React, { Component } from "react";
import ReactMapGL, { Marker, Popup } from "react-map-gl";
import BusinessPin from "./BusinessPin";
import BusinessInfo from "./BusinessInfo";
import { AutoSizer } from "react-virtualized";
import mapboxgl from "mapbox-gl";

mapboxgl.accessToken = "pk.eyJ1IjoibHlvbndqIiwiYSI6ImNqaGpudmF6ZjJrNWkzMHFvcXNjdTI3ajkifQ.oZJOYFFiwPzYLu6QyERv7g";

class Map extends Component {

  constructor(props) {
    super(props);
    this.state = {
      lng: props.mapCenter.longitude,
      lat: props.mapCenter.latitude,
      zoom: props.mapCenter.zoom
    }
    
    this.businessMarkers = [];
  }

  // https://stackoverflow.com/questions/37599561/drawing-a-circle-with-the-radius-in-miles-meters-with-mapbox-gl-js
  createGeoJSONCircle = (center, radiusInKm, points) => {
    if(!points) points = 64;

    var coords = {
        latitude: center[1],
        longitude: center[0]
    };

    var km = radiusInKm;

    var ret = [];
    var distanceX = km/(111.320*Math.cos(coords.latitude*Math.PI/180));
    var distanceY = km/110.574;

    var theta, x, y;
    for(var i=0; i<points; i++) {
        theta = (i/points)*(2*Math.PI);
        x = distanceX*Math.cos(theta);
        y = distanceY*Math.sin(theta);

        ret.push([coords.longitude+x, coords.latitude+y]);
    }
    ret.push(ret[0]);

    return {
        "type": "geojson",
        "data": {
            "type": "FeatureCollection",
            "features": [{
                "type": "Feature",
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [ret]
                }
            }]
        }
    };
};

  setBusinessMarkers() {
    const {businesses} = this.props;
    this.businessMarkers.map(m => {
      m.remove();
    })

    this.businessMarkers = [];
    console.log(businesses);
    businesses.map(b => {
      this.businessMarkers.push(new mapboxgl.Marker()
      .setLngLat([b.location.x, b.location.y])
      .setPopup(new mapboxgl.Popup({offset: 25}).setText(b.name))
      .addTo(this.map)
    )
    })
  }

  componentDidUpdate() {
    this.setBusinessMarkers();
    if (this.mapLoaded) {
      this.map.getSource("polygon").setData(this.createGeoJSONCircle([this.props.mapCenter.longitude, this.props.mapCenter.latitude], this.props.mapCenter.radius).data);
    }

  }

  componentDidMount() {
    const {lng, lat, zoom } = this.state;
    
    this.map = new mapboxgl.Map({
      container: this.mapContainer,
      style: 'mapbox://styles/mapbox/streets-v9',
      center: [lng, lat],
      zoom
    })

    this.map.on('load', () => {
      this.mapLoaded = true;
      this.map.addSource("polygon", this.createGeoJSONCircle([lng, lat], this.props.mapCenter.radius))
      this.map.addLayer({
        "id": "polygon",
        "type": "fill",
        "source": "polygon",
        "layout": {},
        "paint": {
          "fill-color": "blue",
          "fill-opacity": 0.6
        }
      });
    })

    

    const onDragEnd = (e) => {
      console.log(e);
      var lngLat = e.target.getLngLat();
      console.log(lngLat);
      const viewport = {
        latitude: lngLat.lat,
        longitude: lngLat.lng,
        zoom: this.map.getZoom()
      }
      this.props.mapCenterChange(viewport);

      this.map.getSource("polygon").setData(this.createGeoJSONCircle([lngLat.lng, lngLat.lat], this.props.mapCenter.radius).data);

      
    }
    const marker = new mapboxgl.Marker({color: "red", zIndexOffset: 9999})
    .setLngLat([lng, lat])
    .addTo(this.map)
    .setPopup(new mapboxgl.Popup().setText("Drag me to search for businessees with reviews!"))
    .setDraggable(true)
    .on('dragend', onDragEnd);
    //   icon: mapboxgl.marker.icon({
    //     'marker-color': "ff8888'"
    //   }),
    //   draggable: true,
    //   zIndexOffset: 9999
    // });

    marker.addTo(this.map);

    this.map.on('move', () => {
      const {lng, lat} = this.map.getCenter();

      this.setState({
        lng: lng,
        lat: lat,
        zoom: this.map.getZoom().toFixed(2)
      })
    })

    this.setBusinessMarkers();
  }

  render() {
    const {lng, lat, zoom} = this.state;

    return(
      <div>
        <div className="inline-block absolute top left mt12 ml12 bg-darken75 color-white z1 py6 px12 round-full txt-s txt-bold">
          <div>{`Longitude: ${lng} Latitude: ${lat} Zoom: ${zoom}`}</div>
        </div>
        <div ref={el => this.mapContainer = el} className="absolute top right left bottom" />
      </div>
    )
  }

  

  markerClick(e) {
    console.log("I GOT CLICKED");
    console.log(e);
  }

  viewportChange = viewport => {
    this.setState({
      viewport
    });
    console.log(viewport);
    this.props.mapCenterChange(viewport);
  };

  renderPopup() {
    const { popupInfo } = this.state;
    console.log("popupinfo");
    console.log(popupInfo);

    return (
      popupInfo && (
        <Popup
          tipSize={5}
          anchor="top"
          longitude={popupInfo.location.x}
          latitude={popupInfo.location.y}
          onClose={() => this.setState({ popupInfo: null })}
        >
          <BusinessInfo business={popupInfo} />
        </Popup>
      )
    );
  }

  businessSelected = b => {
    this.props.businessSelected(b);
    this.setState({
      popupInfo: b
    });
  };

  // render() {
  //   console.log(this.props);

  //   return (
  //     <AutoSizer>
  //       {({ height, width }) => (
  //         <ReactMapGL
  //           {...this.state.viewport}
  //           width={width}
  //           height={500}
  //           mapboxApiAccessToken="pk.eyJ1IjoibHlvbndqIiwiYSI6IndwUXlLUjQifQ.DIiytYUASOcXjKdpXW8S-Q"
  //           onViewportChange={this.viewportChange}
  //         >
  //           {this.props.businesses.map(b => {
  //             return (
  //               <Marker
  //                 latitude={b.location.y}
  //                 longitude={b.location.x}
  //                 offsetLeft={-20}
  //                 offsetTop={-10}
  //                 key={b.id}
  //               >
  //                 <BusinessPin
  //                   size={20}
  //                   onClick={() => this.businessSelected(b)}
  //                 />
  //               </Marker>
  //             );
  //           })}

  //           {this.renderPopup()}
  //         </ReactMapGL>
  //       )}
  //     </AutoSizer>
  //   );
  // }
}

export default Map;
