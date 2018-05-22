import React, { Component } from "react";
import ReactMapGL, { Marker, Popup } from "react-map-gl";
import BusinessPin from "./BusinessPin";
import BusinessInfo from "./BusinessInfo";
import { AutoSizer } from "react-virtualized";

class Map extends Component {
  state = {
    viewport: {
      // width: window.innerWidth - 240,
      // height: window.innerHeight - 240,
      latitude: this.props.mapCenter.latitude,
      longitude: this.props.mapCenter.longitude,
      zoom: this.props.mapCenter.zoom
    },
    popupInfo: null
  };

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

  render() {
    console.log(this.props);

    return (
      <AutoSizer>
        {({ height, width }) => (
          <ReactMapGL
            {...this.state.viewport}
            width={width}
            height={500}
            onViewportChange={this.viewportChange}
          >
            {this.props.businesses.map(b => {
              return (
                <Marker
                  latitude={b.location.y}
                  longitude={b.location.x}
                  offsetLeft={-20}
                  offsetTop={-10}
                  key={b.id}
                >
                  <BusinessPin
                    size={20}
                    onClick={() => this.businessSelected(b)}
                  />
                </Marker>
              );
            })}

            {this.renderPopup()}
          </ReactMapGL>
        )}
      </AutoSizer>
    );
  }
}

export default Map;
