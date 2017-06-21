import React                    from 'react';
import { connect }              from 'react-redux';
import _                        from 'lodash';
import assets                   from '../../../libs/assets';

import { addToTruck, showOverlay }           from '../../../actions/application';

import Matchup                  from './matchup';

let select = (state)=>{
    return {
        currLang        : state.application.get('currLanguage'),
        matchups        : state.application.get('matchups').toJS()
    };
};

@connect(select, {addToTruck, showOverlay}, null, {withRef: true})
export default class Matchups extends React.Component {

    constructor(props) {
        super(props);

        this.state = {matchups: _.find(this.props.matchups, ['matchup', 'standard']).matchups, tonnage: '', seer: '', applicationType: ''};

        this.update = this.update.bind(this);
        this.addToTruck = this.addToTruck.bind(this);
    }

    update(type, value) {
        console.log('element: ',type, value);

        this.setState({[type]: value});
    }

    addToTruck(matchup) {
        console.log('matchup: ', matchup);
        let tonnage, seer, applicationType;

        tonnage = (this.state.tonnage) ? this.state.tonnage : matchup.tonnageOptions[0];
        seer = (this.state.seer) ? this.state.seer : matchup.seerOptions[0];

        if(matchup.applicationTypeOptions) {
            applicationType = (this.state.applicationType) ? this.state.applicationType : matchup.applicationTypeOptions[0];
        }

        this.props.addToTruck({products: matchup.products, tonnage, seer, applicationType}); // TODO: need to make sure this is choosing the correct products
    }

    render() {

        let styles = {
            container: {
                width: '98%'
            },
            productContainer: {
                width: '86%'
            },
            titleSection: {
                width: '100%',
                height: '75px',
                borderBottom: '1px solid rgba(50, 50, 50, 0.1)',
                textAlign: 'left',
                padding: '20px',
                fontSize: '30px',
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

        let matchups = _.map(this.state.matchups, (id, key)=>{
            return (
                <Matchup
                    key={key}
                    matchup={_.find(this.props.matchups, ['id', parseInt(id)])}
                    tonnage={this.state.tonnage}
                    seer={this.state.seer}
                    applicationType={this.state.applicationType}
                    update={this.update}
                    addToTruck={this.addToTruck}
                    showOverlay={this.props.showOverlay} />
            );
        });

        return (
            <div style={styles.container}>
                <div style={styles.titleSection}>
                    Standard Matchups
                </div>
                <div style={{margin: '50px -1px'}}>
                    <div className="pure-g" /*TODO: need to figure out why the grid isn't being displayed correctly*/>
                        { matchups }
                    </div>
                </div>
            </div>
        );
    }
}



