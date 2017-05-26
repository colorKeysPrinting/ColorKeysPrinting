import React                    from 'react';
import { connect }              from 'react-redux';


export default function SignUpStep2(props) {

    let styles = {
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
        submitBtn: {
            borderRadius: '5px',
            cursor: 'pointer',
            height: '40px',
            width: '89%',
            margin: '20px auto',
            paddingTop: '10px'
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

    let title = <div style={styles.titleBar}><div style={ styles.title }>Account Details</div><div style={styles.steps}>step 2 of 4</div></div>;

    let content =   <form onSubmit={props.nextAction}>
                        <div style={styles.content}>
                            <div style={{columnCount: 2, display: 'inline-flex', width: '540px'}}>
                                <input type="text" placeholder="First name" value={ props.firstName }   onChange={ (e)=>props.update('firstName', e.target.value)}  required/>
                                <input type="text" placeholder="Last name"  value={ props.lastName }    onChange={ (e)=>props.update('lastName', e.target.value)}   required/>
                            </div>
                            <div>
                                <select value={ props.fund } onChange={ (e)=>props.update('fund', e.target.value) }  required>
                                    <option disabled >Associated fund</option>
                                    {funds}
                                </select>
                                <select value={ props.location } onChange={ (e)=>props.update('location', e.target.value) }  required>
                                    <option disabled >Location</option>
                                    {locations}
                                </select>
                                <select value={ props.trade } onChange={ (e)=>props.update('trade', e.target.value) }  required>
                                    <option disabled >Trade</option>
                                    {trades}
                                </select>
                            </div>
                            <hr/>
                            <div>
                                <input type="text" placeholder="Your company's name"    value={ props.companyName } onChange={ (e)=>props.update('companyName', e.target.value)}    required/>
                                <input type="text" placeholder="Address"                value={ props.street }      onChange={ (e)=>props.update('street', e.target.value)}         required/>
                            </div>
                            <div>
                                <input type="text" placeholder="City" value={ props.city } onChange={ (e)=>props.update('city', e.target.value)} required/>
                                <select value={ props.state } onChange={ (e)=>props.update('state', e.target.value) }  required>
                                    <option disabled >State</option>
                                    {states}
                                </select>
                                <input type="tel" placeholder="Phone"   value={ props.phone }   onChange={ (e)=>props.update('phone', e.target.value)} required/>
                                <input type="tel" placeholder="Fax"     value={ props.fax }     onChange={ (e)=>props.update('fax', e.target.value)} />
                                <select value={ props.entityType } onChange={ (e)=>props.update('entityType', e.target.value) }  required>
                                    <option disabled >Entity type</option>
                                    {entities}
                                </select>
                                <input type="number" placeholder="Federal tax PIN"          value={ props.taxPIN }              onChange={ (e)=>props.update('taxPIN', e.target.value)}             required/>
                                <input type="number" placeholder="Requested labor rate"     value={ props.requestRate }         onChange={ (e)=>props.update('requestRate', e.target.value)}        required/>
                                <input type="number" placeholder="Approved labor rate"      value={ props.approvedRate }        onChange={ (e)=>props.update('approvedRate', e.target.value)}       required/>
                                <input type="number" placeholder="Dealer account number"    value={ props.dealerAccountNum }    onChange={ (e)=>props.update('dealerAccountNum', e.target.value)}   required/>
                            </div>
                        </div>

                        <input className="button" type="submit" value="Next" style={ styles.submitBtn } required/>
                    </form>;

    return (
        <div>
            {title}
            {content}
        </div>
    );
}
