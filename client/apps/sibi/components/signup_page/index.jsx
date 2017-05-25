import React                    from 'react';
import { connect }              from 'react-redux';
import { browserHistory }       from 'react-router';
import _                        from 'lodash';
import assets                   from '../../libs/assets';

import {changeLanguage, showOverlay, signUp}         from '../../actions/application';

import Step2                    from './step2';
import Step3                    from './step3';
import Step4                    from './step4';

let select = (state)=>{
    return {
        currLang    : state.application.get('currLanguage'),
        languages   : state.application.get('languageList').toJS(),
        funds       : state.application.get('fundsList').toJS(),
        locations   : state.application.get('locationList').toJS(),
        trades      : state.application.get('tradeList').toJS(),
        entities    : state.application.get('entityList').toJS(),
        states      : state.application.get('states').toJS(),
        docs        : state.application.getIn(['temp','docs']).toJS()
    };
};

@connect(select, {changeLanguage, showOverlay, signUp}, null, {withRef: true})
export default class SignUp extends React.Component {

    constructor(props) {
        super(props);

        this.state = {currentStep: 3, buttonText: 'Create Account',
            email: '', password: '', firstName: '', lastName: '', fund:'', location: '', trade: '',
            companyName: '', street: '', city: '', state: '', phone: '', fax: '', entityType: '',
            taxPIN: '', requestRate: '', approvedRate: '', dealerAccountNum: '', docWorkerComp: '',
            docW9: '',  docInsurance: '', contractGoodman: false,  contractAsure: false, cardName: '',
            cardNumber: '', expDate: '', cvc: '', billName: '', str1: '', str2: '', billCity: '',
            billState: '', zip: ''
        };

        this.update = this.update.bind(this);
        this.sendInfo = this.sendInfo.bind(this);
        this.nextAction = this.nextAction.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.docs) {
            _.each(nextProps.docs, (value, key)=>{
                this.setState({[key]: value});
            });
        }
    }

    update(type, value) {
        this.setState({[type]: value});
    }

    sendInfo() {
        let address = this.state.str1 + " " + this.state.str2 + ", " + this.state.billCity + ", " + this.state.billState + " " + this.state.zip;

        let person = {
            email: this.state.email,
            password: this.state.password,
            name: {first: this.state.firstName, last: this.state.lastName},
            fund: this.state.fund,
            location: this.state.location,
            trade: this.state.trade,
            companyName: this.state.companyName,
            address: {street: this.state.street, city: this.state.city, state: this.state.state},
            phone: this.state.phone,
            fax: this.state.fax,
            entityType: this.state.entityType,
            taxPIN: this.state.taxPIN,
            laborRate: {request: this.state.requestRate, approved: this.state.approvedRate},
            dealerAccountNum: this.state.dealerAccountNum,
            docs: {workerComp: this.state.docWorkerComp, w9: this.state.docW9, insurance: this.state.docInsurance},
            contract: {goodman: this.state.contractGoodman, asure: this.state.contractAsure},
            payment: {
                card: {name: this.state.cardName, number: this.state.cardNum, expDate: this.state.expDate, cvc: this.state.cvc},
                billingAddr: {name: this.state.billName, address}
            }
        };

        this.props.signUp(person);
        browserHistory.push('/');
    }

    nextAction() {
        let currentStep = (this.state.currentStep + 1);
        console.log(currentStep);

        this.setState({currentStep});
    }

    render() {
        let content, title;

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
            containerFinish: {
                backgroundColor: '#F9FAFC',
                borderRadius: '5px',
                border: '1px solid rgba(50, 50, 50, 0.4)',
                boxShadow: '0px 2px 7px 0px rgba(50, 50, 50, 0.4)',
                minHight: '400px',
                width: '390px',
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
            language: {
                cursor: 'pointer',
                textAlign: 'right',
                padding: '30px',
                width: '30%'
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
            sectionHeader: {
                textAlign: 'center',
                margin: '15px auto'
            },
            width100: {
                width: '98%'
            }
        };

        switch(this.state.currentStep) {
            case 1:
                let languages = _.map(this.props.languages, (language, key)=>{
                    return (<option key={ key } value={ language }>{ language }</option>);
                });

                let languageSelect =    <select value={ this.props.currLang } onChange={ (e)=>this.props.changeLanguage(e.target.value) } style={styles.width100} required>
                                            <option disabled value='select'>Language</option>
                                            {languages}
                                        </select>;

                content = <div style={styles.container}>
                    <div id="sign-up-title" style={ styles.titleBar }><div style={ styles.title}>Sign Up</div><div style={styles.language}>{languageSelect}</div></div>
                    <form onSubmit={this.nextAction}>
                        <div style={styles.content}>
                            <input type="email" placeholder="Email" value={this.state.email} onChange={ (e)=>this.update('email', e.target.value) } style={styles.width100} required/>
                            <input type="password" placeholder="Password" value={this.state.password} onChange={ (e)=>this.update('password', e.target.value) } style={styles.width100} required/>
                        </div>

                        <input type="submit" value="Create Account" style={ styles.submitBtn } required/>
                    </form>
                </div>;
                break;
            case 2:
                content = <Step2
                                firstName={this.state.firstName} lastName={this.state.lastName} fund={this.state.fund}
                                trade={this.state.trade} location={this.state.location} companyName={this.state.companyName}
                                street={this.state.street} city={this.state.city} phone={this.state.phone} entityType={this.state.entityType}
                                requestRate={this.state.requestRate} dealerAccountNum={this.state.dealerAccountNum} state={this.state.state}
                                fax={this.state.fax} taxPIN={this.state.taxPIN} approvedRate={this.state.approvedRate}

                                funds={this.props.funds}
                                locations={this.props.locations}
                                trades={this.props.trades}
                                states={this.props.states}
                                entities={this.props.entities}
                                nextAction={this.nextAction}
                                update={this.update} />;

                break;

            case 3:
                content = <Step3
                                docWorkerComp={this.state.docWorkerComp}
                                docW9={this.state.docW9}
                                docInsurance={this.state.docInsurance}
                                contractGoodman={this.state.contractGoodman}
                                contractAsure={this.state.contractAsure}
                                update={this.update}
                                showOverlay={this.props.showOverlay}
                                nextAction={this.nextAction}/>;


                break;
            case 4:
                states = _.map(this.props.states, (name, abv)=>{
                    return (<option key={ abv } value={ abv }>{ name }</option>);
                });

                title = <div id="sign-up-title" style={ styles.titleBar}><div style={ styles.title }>Billing info</div><div style={styles.steps}>step 4 of 4</div></div>;

                content = <form onSubmit={ this.nextAction}>
                    <div style={styles.content}>
                        <h2 style={styles.sectionHeader}>Card info</h2>
                        <div style={{columnCount: 2}}>
                            <input type="text" placeholder="Name on card" value={ this.state.city } onChange={ (e)=>this.update('cardName', e.target.value)} style={styles.width100} required/>
                            <input type="date" placeholder="MM / YY" value={ this.state.phone } onChange={ (e)=>this.update('expDate', e.target.value)} pattern="[0-9]{2}-[0-9]{2}" style={styles.width100} required/>
                            <input type="number" placeholder="Card  number" value={ this.state.phone } onChange={ (e)=>this.update('cardNumber', e.target.value)} style={styles.width100} required/>
                            <input type="number" placeholder="CVC" value={ this.state.phone } onChange={ (e)=>this.update('cvc', e.target.value)} style={styles.width100} required/>
                        </div>

                        <h2 style={styles.sectionHeader}>Billing Address</h2>
                        <div style={{columnCount: 2}}>
                            <input type="text" placeholder="Name" value={ this.state.city } onChange={ (e)=>this.update('billName', e.target.value)} style={styles.width100} required/>
                            <input type="text" placeholder="Street 2" value={ this.state.city } onChange={ (e)=>this.update('str2', e.target.value)} style={styles.width100} required/>
                            <select value={ this.state.state } onChange={ (e)=>this.update('billState', e.target.value) } style={styles.width100} required>
                                <option disabled value='select'>State</option>
                                {states}
                            </select>
                            <input type="text" placeholder="Street 1" value={ this.state.city } onChange={ (e)=>this.update('str1', e.target.value)} style={styles.width100} required/>
                            <input type="text" placeholder="City" value={ this.state.city } onChange={ (e)=>this.update('billCity', e.target.value)} style={styles.width100} required/>
                            <input type="number" placeholder="Zipcode" value={ this.state.phone } onChange={ (e)=>this.update('zip', e.target.value)} style={styles.width100} required/>
                        </div>
                    </div>

                    <input type="submit" value="Finish" style={ styles.submitBtn } required/>
                </form>;
                break;
            case 5:

                title = <div id="sign-up-title" style={ styles.titleBar}><div style={ styles.title }>All done</div></div>;

                content = <form onSubmit={this.sendInfo}>
                    <div style={styles.content}>
                        <p>Your account must be approved. This typically happens within 24 hours.</p><br/>

                        <p>We'll email {this.state.email} when approved.</p>
                    </div>

                    <input type="submit" value="Got it" style={ styles.submitBtn } required/>
                </form>;
                break;
            default:
        }

        return (
            <div>
                {content}
            </div>
        );
    }
}



