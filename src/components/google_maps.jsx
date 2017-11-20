'use strict';

import React                    from 'react';
import { Col, CardPanel, Card } from 'react-materialize';
import { withScriptjs, withGoogleMap, GoogleMap, Marker }    from "react-google-maps";
import { Element }              from 'react-scroll';
import _                        from 'lodash';

class GoogleMapComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            mapOptions: {
                mapTypeId: 'terrain',
                zoom: 17,
                center: this.props.location,
                mapTypeControl: false,
                streetViewControl: false,
                scrollwheel: false
            },
            markers: [
                { label: "", position: this.props.location }
            ]
        };
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