import React                    from 'react';
import { connect }              from 'react-redux';


export default function SignUpStep2(props) {

    let styles = {
        container: {
            backgroundColor: '#F9FAFC',
            borderRadius: '5px',
            border: '1px solid rgba(50, 50, 50, 0.4)',
            boxShadow: '0px 2px 7px 0px rgba(50, 50, 50, 0.4)',
            minHight: '400px',
            width: '600px',
            margin: '10em auto',
            zIndex: '999'
        },
        titleBar: {
            display: 'inline-flex',
            backgroundColor: '#FFF',
            borderTopLeftRadius: '5px',
            borderTopRightRadius: '5px',
            boxShadow: '0px 2px 7px 0px rgba(50, 50, 50, 0.4)',
            height: '20%',
            width: '100%'
        },
        title: {
            textAlign: 'left',
            padding: '30px',
            width: '90%'
        },
        steps: {
            color: 'green',
            cursor: 'pointer',
            textAlign: 'right',
            padding: '30px',
            width: '30%'
        },
        content: {
            width: '89%',
            margin: '0px auto',
            marginTop: '40px',
            textAlign: 'left'
        },
        contentUpload: {
            width: '89%',
            margin: '0px auto',
            marginTop: '40px',
            textAlign: 'left',
            display: 'grid'
        },
        submitBtn: {
            backgroundColor: 'rgb(47, 205, 237)',
            borderRadius: '5px',
            color: '#FFF',
            cursor: 'pointer',
            height: '40px',
            width: '89%',
            margin: '20px auto',
            paddingTop: '10px'
        },
        width100: {
            width: '98%'
        }
    };

    let funds = _.map(props.funds, (fund, key)=>{
        return (<option key={ key } value={ fund }>{ fund }</option>);
    });

    let locations = _.map(props.locations, (location, key)=>{
        return (<option key={ key } value={ location }>{ location }</option>);
    });

    let trades = _.map(props.trades, (trade, key)=>{
        return (<option key={ key } value={ trade }>{ trade }</option>);
    });

    let states = _.map(props.states, (name, abv)=>{
        return (<option key={ abv } value={ abv }>{ name }</option>);
    });

    let entities = _.map(props.entities, (entity, key)=>{
        return (<option key={ key } value={ entity }>{ entity }</option>);
    });

    let title = <div id="sign-up-title" style={styles.titleBar}><div style={ styles.title }>Account Details</div><div style={styles.steps}>step 2 of 4</div></div>;

    let content =   <form onSubmit={props.nextAction}>
                        <div style={styles.content}>
                            <div style={{columnCount: 2, display: 'inline-flex', width: '540px'}}>
                                <input type="text" placeholder="First name" value={ props.firstName } onChange={ (e)=>props.update('firstName', e.target.value)} style={styles.width100} required/>
                                <input type="text" placeholder="Last name" value={ props.lastName } onChange={ (e)=>props.update('lastName', e.target.value)} style={styles.width100} required/>
                            </div>
                            <div style={{columnCount: 2}}>
                                <select value={ props.fund } onChange={ (e)=>props.update('fund', e.target.value) } style={styles.width100} required>
                                    <option disabled value='select'>Associated fund</option>
                                    {funds}
                                </select>
                                <select value={ props.trade } onChange={ (e)=>props.update('trade', e.target.value) } style={styles.width100} required>
                                    <option disabled value='select'>Trade</option>
                                    {trades}
                                </select>
                                <select value={ props.location } onChange={ (e)=>props.update('location', e.target.value) } style={styles.width100} required>
                                    <option disabled value='select'>Location</option>
                                    {locations}
                                </select>
                            </div>
                            <hr/>
                            <div style={{}}>
                                <input type="text" placeholder="Your company's name" value={ props.companyName } onChange={ (e)=>props.update('companyName', e.target.value)} style={styles.width100} required/>
                                <input type="text" placeholder="Address" value={ props.street } onChange={ (e)=>props.update('street', e.target.value)} style={styles.width100} required/>
                            </div>
                            <div style={{columnCount: 2}}>
                                <input type="text" placeholder="City" value={ props.city } onChange={ (e)=>props.update('city', e.target.value)} style={styles.width100} required/>
                                <input type="number" placeholder="Phone" value={ props.phone } onChange={ (e)=>props.update('phone', e.target.value)} style={styles.width100} required/>
                                <select value={ props.entityType } onChange={ (e)=>props.update('entityType', e.target.value) } style={styles.width100} required>
                                    <option disabled value='select'>Entity type</option>
                                    {entities}
                                </select>
                                <input type="number" placeholder="Requested labor rate" value={ props.requestRate } onChange={ (e)=>props.update('requestRate', e.target.value)} style={styles.width100} required/>
                                <input type="number" placeholder="Dealer account number" value={ props.dealerAccountNum } onChange={ (e)=>props.update('dealerAccountNum', e.target.value)} style={styles.width100} required/>

                                <select value={ props.state } onChange={ (e)=>props.update('state', e.target.value) } style={styles.width100} required>
                                    <option disabled value='select'>State</option>
                                    {states}
                                </select>
                                <input type="number" placeholder="Fax" value={ props.fax } onChange={ (e)=>props.update('fax', e.target.value)} style={styles.width100} />
                                <input type="number" placeholder="Federal tax PIN" value={ props.taxPIN } onChange={ (e)=>props.update('taxPIN', e.target.value)} style={styles.width100} required/>
                                <input type="number" placeholder="Approved labor rate" value={ props.approvedRate } onChange={ (e)=>props.update('approvedRate', e.target.value)} style={styles.width100} required/>
                            </div>
                        </div>

                        <input type="submit" value="Next" style={ styles.submitBtn } required/>
                    </form>;

    return (
        <div style={styles.container}>
            {title}
            {content}
        </div>
    );
}
