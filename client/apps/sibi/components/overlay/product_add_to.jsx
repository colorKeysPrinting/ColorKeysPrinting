import React                                     from 'react';
import { connect }                               from 'react-redux';

import assets                                    from '../../libs/assets';

export default function addToOverlay(props) {
    let inputs, actionSection, close;

    let styles = {
        container: {
            position: 'absolute',
            top: props.overlayObj.mouseY - 104,
            left: props.overlayObj.mouseX - 106,
            backgroundColor: '#3B3A3A',
            color: '#FFF',
            borderRadius: '5px',
            border: '1px solid rgba(50, 50, 50, 0.4)',
            boxShadow: '0px 2px 7px 0px rgba(50, 50, 50, 0.4)',
            width: '215px',
            zIndex: '999',
            textAlign: 'left',
            fontSize: '17px'
        },
        element: {
            padding: '10px',
            cursor: 'pointer'
        }
    };

    return (
        <div style={styles.container}>
            <div onClick={()=>props.showRadioOverlay('radioList', 'customMatchups')} style={styles.element}>Add to Custom Matchup</div>
            <div onClick={()=>props.showRadioOverlay('radioList', 'myLists')} style={styles.element}>Add to List</div>
        </div>
    );
}
