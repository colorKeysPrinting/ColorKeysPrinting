import React                    from 'react';
import _                        from 'lodash';

export default function MatchupsCustom(props) {

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
        return (<div></div>);
    });

    return (
        <div style={styles.container}>
            <div style={styles.searchSection}>
                {this.props.content}
            </div>
            <div>
                <div className="pure-g" /*TODO: need to figure out why the grid isn't being displayed correctly*/>
                    {matchups}
                </div>
            </div>
        </div>
    );
}



