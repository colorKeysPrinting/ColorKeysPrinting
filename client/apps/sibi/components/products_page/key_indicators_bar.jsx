import React                    from 'react';
import _                        from 'lodash';

import {}         from '../../actions/products';

export default function InfoBar(props) {
    // only show upated information when the tab is loaded
    // have an action to edit the elements in the bar

    let styles = {
        container: {
            height: '150px',
            backgroundColor: '#F4F8FB',
            width: '97%',
            display: 'inline-flex',
            marginTop: '85px',
            borderBottom: '1px solid rgba(50, 50, 50, 0.1)'
        },
        element: {
            width: '25%',
            padding: '2%',
            border: '1px solid rgba(50, 50, 50, 0.1)',
        }
    };

    let activeElements = _.map(props.activeKeyIndicatorBar, (obj, key)=>{
        return (<div key={key} style={styles.element}>{key}</div>);
    });

    return (
        <div style={styles.container}>
            {activeElements}
            <div style={{width: '5%'}}>Settings</div>
        </div>
    );
}



