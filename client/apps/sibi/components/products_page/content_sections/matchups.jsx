import React                    from 'react';
import { connect }              from 'react-redux';
import _                        from 'lodash';
import assets                   from '../../../libs/assets';

import Matchup                  from './matchup';

let select = (state)=>{
    return {
        currLang        : state.application.get('currLanguage'),
        matchups        : state.application.get('matchups').toJS()
    };
};

@connect(select, {}, null, {withRef: true})
export default class Matchups extends React.Component {

    constructor(props) {
        super(props);

        this.state = {matchups: this.props.matchups['standard'], tonnage: '', seer: '', applicationType: ''};

        this.update = this.update.bind(this);
        this.addToTruck = this.addToTruck.bind(this);
        this.viewItems = this.viewItems.bind(this);
    }

    update(type, value) {
        console.log('element: ',type, value);

        this.setState({[type]: value});
    }

    addToTruck(matchup) {
        console.log('matchup: ', matchup);
    }

    viewItems(items) {
        console.log('items: ', items);
    }

    render() {

        let styles = {
            container: {
                width: '98%'
            },
            productContainer: {
                width: '86%'
            },
            searchSection: {
                width: '100%',
                height: '77px',
                borderBottom: '1px solid rgba(50, 50, 50, 0.1)'
            },
            searchBox: {
                border: '1px solid #FFF',
                padding: '30px',
                width: '100%',
            },
            dropdown: {
                position: 'absolute',
                left: '85%',
                width: '190px',
                height: '45px',
                marginTop: '17px',
                marginLeft: '15px',
                border: '1px solid rgba(50, 50, 50, 0.1)',
                backgroundColor: '#FFF',
            },
            headers: {
                height: '50px',
                width: '100%',
                textAlign: 'left',
                backgroundColor: '#F4F8FB',
                padding: '20px'
            }
        };

        let matchups = _.map(this.state.matchups, (matchup, key)=>{
            return (
                <Matchup
                    key={key}
                    matchup={this.props.matchups[matchup]}
                    tonnage={this.state.tonnage}
                    seer={this.state.seer}
                    applicationType={this.state.applicationType}
                    update={this.update}
                    addToTruck={this.addToTruck}
                    viewItems={this.viewItems} />
            );
        });

        return (
            <div style={styles.container}>
                <div style={styles.searchSection}>
                    Standard Matchups
                </div>
                <div>
                    <div className="pure-g" /*TODO: need to figure out why the grid isn't being displayed correctly*/>
                        {matchups}
                    </div>
                </div>
            </div>
        );
    }
}



