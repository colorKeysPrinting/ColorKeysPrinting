import React                    from 'react';
import _                        from 'lodash';
import assets                   from '../../../libs/assets';

export default function Matchup(props) {

    let tonnageSelect = '', seerSelect = '', applicationTypeSelect= '';

    let styles = {
        container: {
            border: '1px solid rgba(50, 50, 50, 0.1)',
            backgroundColor: '#FBFBFB'
        },
        productThumbnail: {
            display: 'grid'
        },
        image: {
            marginTop: '-52px',
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
        viewItem: {
            color: '#06cfe5',
            cursor: 'pointer'
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
        submitBtn: {
            backgroundColor: '#06cfe5',
            borderRadius: '5px',
            color: '#FFF',
            cursor: 'pointer',
            width: '200px',
            height: '46px',
            margin: '20px auto',
            paddingTop: '13px'
        },
        prodInfo: {
            textAlign: 'left',
            padding: '20px 26px 0 0'
        }
    };

    let matchup = props.matchup;

    if(matchup.tonnage) {
        let optionsTon = _.map(matchup.tonnage, (value, key)=>{
            return (<option key={key+'tonnage'} value={value}>{value} Tons</option>);
        });

        tonnageSelect = <div>
                            <h3 style={styles.label}>Tonnage</h3>
                            <select value={props.tonnage} onChange={ (e)=>props.update('tonnage', e.target.value) } style={styles.dropdown}>
                                {optionsTon}
                            </select>
                        </div>;
    }

    if(matchup.seer) {
        let optionsSeer = _.map(matchup.seer, (value, key)=>{
            return (<option key={key+'seer'} value={value}>{value} SEER</option>);
        });

        seerSelect = <div>
                        <h3 style={styles.label}>SEER Rating</h3>
                        <select value={props.seer} onChange={ (e)=>props.update('seer', e.target.value) } style={styles.dropdown}>
                            {optionsSeer}
                        </select>
                     </div>;
    }

    if(matchup.applicationType) {
        let optionsApplicationType = _.map(matchup.applicationType, (value, key)=>{
            return (<option key={key+'applicationType'} value={value}>{value}</option>);
        });

        applicationTypeSelect = <div>
                                    <h3 style={styles.label}>Application Type</h3>
                                    <select value={props.applicationType} onChange={ (e)=>props.update('applicationType', e.target.value) } style={styles.dropdown}>
                                        {optionsApplicationType}
                                    </select>
                                </div>;
    }

    return (
        <div className="pure-u-1 pure-u-md-1-2 pure-u-lg-1-4" style={styles.container}>
            <div style={styles.productThumbnail}>
                <div style={styles.image}><img src={matchup.image} alt="picture" height="100%" width="100%"/></div>
                <h2 style={styles.name}>{matchup.name}</h2>
            </div>
            {applicationTypeSelect}
            <div style={{display: (matchup.applicationType) ? 'inline-flex': ''}}>
                {tonnageSelect}
                {seerSelect}
            </div>
            <div style={{display: 'inline-flex'}}>
                <div style={styles.prodInfo}>
                    <div style={styles.price}>${matchup.price}</div>
                </div>
                <div>
                    <div onClick={()=>{props.addToTruck(matchup)}} style={styles.submitBtn}>Add to truck</div>
                    <div onClick={()=>{props.viewItems(matchup.items)}} style={styles.viewItem}>view items</div>
                </div>
            </div>
        </div>
    );
}



