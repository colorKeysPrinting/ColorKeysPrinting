import React                    from 'react';
import { connect }              from 'react-redux';
import _                        from 'lodash';

let select = (state)=>{
    return {
        keyIndicatorBars    : state.application.getIn(['activeUser', 'settings', 'keyIndicatorBars']),
    };
};

@connect(select, {}, null, {withRef: true})
export default class KeyIndicatorsBar extends React.Component {

    // TODO: needs to have a constructor and comonentWillReceiveProps() in order to handle the dynamic changing of the key indicators.

    render() {
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

        let activeElements = _.map(this.props.activeKeyIndicatorBar, (obj, key)=>{
            let type = Object.keys(obj)[key]
            let time = obj[type];

            return (
                <div key={key} style={styles.element}>
                    { type }
                    { time }
                </div>
            );
        });

        return (
            <div style={styles.container}>
                { activeElements }
                <div style={{width: '5%'}}>Settings</div>
            </div>
        );
    }
}



