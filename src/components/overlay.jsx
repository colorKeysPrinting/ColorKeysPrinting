import React                    from 'react';

export default function Overlay(props) {
    return (
        <div id="overlay-container" onClick={props.closeOverlay}>
            <div className={(props.type !== 'profile' && props.type !== 'alert') ? 'dark-background' : '' } >
                { props.children }
            </div>
        </div>
    );
}