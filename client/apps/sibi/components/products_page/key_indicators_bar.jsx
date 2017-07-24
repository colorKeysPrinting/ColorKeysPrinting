import React                    from 'react';
import { connect }              from 'react-redux';
import _                        from 'lodash';

class KeyIndicatorsBar extends React.Component {

    // TODO: needs to have a constructor and comonentWillReceiveProps() in order to handle the dynamic changing of the key indicators.

    render() {
        const styles = {
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

        const activeElements = _.map(this.props.activeKeyIndicatorBar, (obj, key) => {
            const type = Object.keys(obj)[key]
            const time = obj[type];

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
                <div style={{ width: '5%' }}>Settings</div>
            </div>
        );
    }
}

const select = (state) => ({
    keyIndicatorBars    : state.application.getIn(['activeUser', 'settings', 'keyIndicatorBars']),
});

export default connect(select, {}, null, { withRef: true })(KeyIndicatorsBar);

