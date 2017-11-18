'use strict';

import React                    from 'react';
import { Col, CardPanel, Card } from 'react-materialize';
import { withScriptjs, withGoogleMap, GoogleMap, Marker }    from "react-google-maps";
import { Element }              from 'react-scroll';
import _                        from 'lodash';

class GoogleMapComponent extends React.Component {
    constructor(props) {
        super(props);
        const location = { lat:43.597457, lng: -111.965967, addr: '3342+East+113+North,+Idaho+Falls,+ID+83401,+United+States' };

        this.state = {
            mapOptions: {
                mapTypeId: 'terrain',
                zoom: 17,
                center: location,
                mapTypeControl: false,
                streetViewControl: false,
                scrollwheel: false
            },
            markers: [
                { label: "", position: location }
            ],
            location };

        this.getDirections = this.getDirections.bind(this);
    }

    getDirections() {
        const { isMobile } = this.props;
        const { location } = this.state;

        (isMobile)
            ? (navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i))
                ? window.open(`https://maps.google.com/maps?daddr=${location.addr}&amp&z=17;ll=`)
                : window.open(`maps://maps.google.com/maps?daddr=${location.addr}&amp&z=17;ll=`)
            : window.open(`https://maps.google.com/maps?daddr=${location.addr}&amp&z=17;ll=`);
    }

    render() {
        const { mapOptions, markers } = this.state;

        return (
            <div>
                <Element name="navigation">
                    <GoogleMap options={mapOptions}>
                        {markers.map((marker, idx) => (
                            <Marker key={`marker${idx}`} {...marker}/>
                        ))}
                    </GoogleMap>
                </Element>
            </div>
        )
    }
}

export default withScriptjs(withGoogleMap(GoogleMapComponent));