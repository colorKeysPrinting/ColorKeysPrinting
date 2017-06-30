import React                    from 'react';

export default function SignUpStep4(props) {

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
        sectionHeader: {
            textAlign: 'center',
            margin: '15px auto'
        },
        content: {
            width: '89%',
            margin: '0px auto',
            marginTop: '40px',
            textAlign: 'left'
        },
        submitBtn: {
            height: '40px',
            width: '89%',
            margin: '20px auto',
            paddingTop: '10px'
        }
    };

    let states = _.map(props.states, (name, abv)=>{
        return (<option key={ abv } value={ abv }>{ name }</option>);
    });

    let title = <div style={styles.titleBar}><div style={ styles.title }>Billing info</div><div style={styles.steps}>step 4 of 4</div></div>;

    let content =   <form onSubmit={props.nextAction}>
                        <div style={styles.content}>
                            <h2 style={styles.sectionHeader}>Card info</h2>
                            <div>
                                <input type="text" placeholder="Name on card"   value={ props.cardName }                        onChange={ (e)=>props.update('cardName', e.target.value)}    required/>
                                <input type="text" placeholder="Card number"    value={ props.cardNumber }  pattern="\d{12,19}" onChange={ (e)=>props.update('cardNumber', e.target.value)}  required/>
                                <input type="text" placeholder="MM / YY"        value={ props.expDate }     pattern="\d{4}"     onChange={ (e)=>props.update('expDate', e.target.value)}     required/>
                                <input type="text" placeholder="CVC"            value={ props.cvc }         pattern="\d{3}"     onChange={ (e)=>props.update('cvc', e.target.value)}         required/>
                            </div>

                            <h2 style={styles.sectionHeader}>Billing Address</h2>
                            <div>
                                <input type="text" placeholder="Name"       value={ props.billName }    onChange={ (e)=>props.update('billName', e.target.value)}    required/>
                                <input type="text" placeholder="Street 1"   value={ props.str1 }        onChange={ (e)=>props.update('str1', e.target.value)}        required/>
                                <input type="text" placeholder="Street 2"   value={ props.str2 }        onChange={ (e)=>props.update('str2', e.target.value)}        required/>
                                <input type="text" placeholder="City"       value={ props.billCity }    onChange={ (e)=>props.update('billCity', e.target.value)}    required/>
                                <select value={ props.billState } onChange={ (e)=>props.update('billState', e.target.value) }  required>
                                    <option disabled >State</option>
                                    {states}
                                </select>
                                <input type="text" placeholder="Zipcode" value={ props.zip } pattern="\d{5}-?(\d{4})?" onChange={ (e)=>props.update('zip', e.target.value)}  required/>
                            </div>
                        </div>

                        <input className="submit-btn" type="submit" value="Finish" style={ styles.submitBtn } required/>
                    </form>;

    return (
        <div>
            {title}
            {content}
        </div>
    );
}
