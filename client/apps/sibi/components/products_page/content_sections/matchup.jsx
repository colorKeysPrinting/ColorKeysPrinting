import React                    from 'react';
import _                        from 'lodash';
import assets                   from '../../../libs/assets';
import '../../common/custom_formats.js'                        // adds formatMoney to Number types

export default function Matchup(props) {

    let applicationTypeSelect;

    const styles = {
        container: {
            border: '1px solid rgba(50, 50, 50, 0.1)',
            backgroundColor: '#FBFBFB'
        },
        productThumbnail: {
            display: 'grid'
        },
        image: {
            height: '300px',
            backgroundColor: '#FFF'
        },
        name: {
            margin: '10px auto 0px',
            textAlign: 'left',
            fontSize: '20px',
            width: '85%'
        },
        price: {
            fontSize: '25px',
            margin: '2px'
        },
        label: {
            textAlign: 'left',
            padding: '5px 19px'
        },
        dropdown: {
            width: '90%',
            height: '45px',
            padding: '10px',
            border: '1px solid rgba(50, 50, 50, 0.1)',
            backgroundColor: '#FFF',
        },
        prodInfo: {
            textAlign: 'left',
            padding: '20px 26px 0 0'
        }
    };

    const matchup = props.matchup;

    const optionsTon = _.map(matchup.tonnageOptions, (value, key) => (<option key={key + 'tonnage'} value={value}>{ value } Tons</option>));

    const tonnageSelect = (<div>
        <h3 style={styles.label}>Tonnage</h3>
        <select value={props.tonnage} onChange={(e) => props.update('tonnage', e.target.value)} style={styles.dropdown}>
            { optionsTon }
        </select>
    </div>);

    const optionsSeer = _.map(matchup.seerOptions, (value, key) => (<option key={key+'seer'} value={value}>{ value } SEER</option>));

    const seerSelect = (<div>
        <h3 style={styles.label}>SEER Rating</h3>
        <select value={props.seer} onChange={(e) => props.update('seer', e.target.value)} style={styles.dropdown}>
            { optionsSeer }
        </select>
    </div>);

    if (matchup.applicationTypeOptions) {
        const optionsApplicationType = _.map(matchup.applicationTypeOptions, (value, key) => (<option key={key+'applicationType'} value={value}>{ value }</option>));

        applicationTypeSelect = (<div>
            <h3 style={styles.label}>Application Type</h3>
            <select value={props.applicationType} onChange={(e) => props.update('applicationType', e.target.value)} style={styles.dropdown}>
                { optionsApplicationType }
            </select>
        </div>);
    }

    const price = (matchup.price) ? <div style={styles.price}>${ (matchup.price).formatMoney(2, '.', ',') }</div> : null;

    return (
        <div className="pure-u-1 pure-u-md-1-2 pure-u-lg-1-4" style={styles.container}>
            <div style={styles.productThumbnail}>
                <div style={styles.image}><img src={matchup.image} alt="picture" height="100%" width="100%" /></div>
                <h2 style={styles.name}>{ matchup.name }</h2>
            </div>
            { applicationTypeSelect }
            <div style={{ display: (matchup.applicationType) ? 'inline-flex' : '' }}>
                { tonnageSelect }
                { seerSelect }
            </div>
            <div style={{ display: 'inline-flex' }}>
                <div style={styles.prodInfo}>
                    { price }
                </div>
                <div>
                    <div className="submit-btn" onClick={() => props.addToTruck(matchup)} >Add to truck</div>
                    <div className="text-link" onClick={() => props.showOverlay('customMatchup', { name: matchup.name, products: matchup.products })} >view items</div>
                </div>
            </div>
        </div>
    );
}



