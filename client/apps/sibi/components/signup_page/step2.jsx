import React                    from 'react';
import _                        from 'lodash';

export default function SignUpStep2(props) {
    let locations = [];

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
        }
    };

    let funds = _.map(props.funds, (fund)=>{
        return (<option key={fund.id} value={fund.id}>{ fund.name }</option>);
    });

    if(props.fundId) {
        let fund = _.find(props.funds, ['id', props.fundId]);
        locations = _.map(fund.locations, (location)=>{
            return (<option key={location.id} value={location.id}>{ location.name }</option>);
        });
    }

    let trades = _.map(props.trades, (trade)=>{
        return (<option key={trade.id} value={trade.id}>{ trade.name }</option>);
    });

    let states = _.map(props.states, (name, abv)=>{
        return (<option key={abv} value={abv}>{ name }</option>);
    });

    let entityTypes = _.map(props.entityTypes, (entity)=>{
        return (<option key={entity.id} value={entity.id}>{ entity.name }</option>);
    });

    let title = <div style={styles.titleBar}><div style={styles.title}>Account Details</div><div style={styles.steps}>step 2 of 4</div></div>;

    let content = <form onSubmit={props.nextAction}>
                      <div style={styles.content}>
                          <div style={{columnCount: 2, display: 'inline-flex', width: '540px'}}>
                              <input type="text" placeholder="First name" value={props.firstName} onChange={(e)=>props.update('firstName', e.target.value)} required/>
                              <input type="text" placeholder="Last name"  value={props.lastName}  onChange={(e)=>props.update('lastName', e.target.value)}  required/>
                          </div>
                          <div>
                              <select value={props.fundId} onChange={(e)=>props.update('fundId', e.target.value)} required>
                                  <option disabled selected value="" >Select fund</option>
                                  { funds }
                              </select>
                              <select value={props.locationId} onChange={(e)=>props.update('locationId', e.target.value)} required>
                                  <option disabled selected value="" >Select Location</option>
                                  { locations }
                              </select>
                              <select value={props.tradeId} onChange={(e)=>props.update('tradeId', e.target.value)} required>
                                  <option disabled selected value="" >Select Trade</option>
                                  { trades }
                              </select>
                          </div>
                          <hr/>
                          <div>
                              <input type="text" placeholder="Your company's name" value={props.companyName} onChange={(e)=>props.update('companyName', e.target.value)} required/>
                              <input type="text" placeholder="Address"             value={props.street}      onChange={(e)=>props.update('street', e.target.value)}      required/>
                          </div>
                          <div>
                              <input type="text" placeholder="City" value={props.city} onChange={(e)=>props.update('city', e.target.value)} required/>
                              <select value={props.state} onChange={(e)=>props.update('state', e.target.value)} required>
                                  <option disabled selected value="" >Select State</option>
                                  { states }
                              </select>
                              <input type="text" placeholder="Zipcode" value={props.zipcode} onChange={(e)=>props.update('zipcode', e.target.value)} required/>
                              <input type="tel" placeholder="Phone"    value={props.phone}   onChange={(e)=>props.update('phone', e.target.value)} required/>
                              <input type="tel" placeholder="Fax"      value={props.fax}     onChange={(e)=>props.update('fax', e.target.value)} />
                              <select value={props.entityTypeId} onChange={(e)=>props.update('entityTypeId', e.target.value)} required>
                                  <option disabled selected value="" >Select Entity type</option>
                                  { entityTypes }
                              </select>
                              <input type="number" placeholder="Federal tax PIN"       value={props.taxPIN}           onChange={(e)=>props.update('taxPIN', e.target.value)}           required/>
                              <input type="number" placeholder="Requested labor rate"  value={props.requestedRate}    onChange={(e)=>props.update('requestedRate', e.target.value)}    required/>
                              <input type="number" placeholder="Approved labor rate"   value={props.approvedRate}     onChange={(e)=>props.update('approvedRate', e.target.value)}     required/>
                              <input type="number" placeholder="Dealer account number" value={props.dealerAccountNum} onChange={(e)=>props.update('dealerAccountNum', e.target.value)} required/>
                          </div>
                      </div>
                       <input className="submit-btn" type="submit" value="Next" style={{width: '89%'}} required/>
                  </form>;

    return (
        <div>
            { title }
            { content }
        </div>
    );
}
