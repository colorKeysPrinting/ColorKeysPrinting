import React, { Component } from 'react'
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from 'react-google-maps'

class GoogleMapComponent extends Component {
  state = {
    mapOptions: {
      mapTypeId: 'terrain',
      zoom: 17,
      center: this.props.location,
      mapTypeControl: false,
      streetViewControl: false,
      scrollwheel: false,
    },
    markers: [{ label: '', position: this.props.location }],
  }

  render() {
    const { mapOptions, markers } = this.state

    return (
      <div id="navigation-tag">
        <GoogleMap options={mapOptions}>
          {markers.map((marker, idx) => <Marker key={`marker${idx}`} {...marker} />)}
        </GoogleMap>
      </div>
    )
  }
}

export default withScriptjs(withGoogleMap(GoogleMapComponent))
