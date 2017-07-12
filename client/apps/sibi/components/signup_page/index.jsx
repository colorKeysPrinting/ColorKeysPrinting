import React                    from 'react';
import { connect }              from 'react-redux';
import { browserHistory }       from 'react-router';
import _                        from 'lodash';

import { changeLanguage, showOverlay }         from '../../actions/application';
import * as signup              from '../../actions/signup';

import StepVisualizer           from './step_visualizer';
import Step2                    from './step2';
import Step3                    from './step3';
import Step4                    from './step4';

class Signup extends React.Component {

    constructor(props) {
        super(props);

        this.state = {currentStep: 1, buttonText: 'Create Account', errorMsg: '',
            email: 'seth@builtbyhq.com', password: 'password', firstName: 'fistTest', lastName: 'lastTest', fundId: '6b1faf05-68b6-4808-b127-1bf2fe97aa10', locationId: 'cac27aa2-e6c5-463f-bb2a-e2d8ccf18807', tradeId: '52ebd6b2-9ab4-4a07-899e-64928dcfa74b', companyId: '',
            docW9: '',  docInsurance: '', docWorkerComp: '', contractGoodman: false,  contractAsure: false,

            companyName: 'testCompany1', street: 'testAddress1', city: 'Ogden', state: 'UT', zipcode: '84414', phone: '1234561234', fax: '', entityTypeId: '6562a9ae-4817-45c2-8560-cb7b501ab583',
            taxPIN: '123456789', requestedRate: '12', approvedRate: '34', dealerAccountNum: '123456789',

            cardName: '', cardNumber: '', cardExpDate: '', cardCvc: '', cardBillName: '', cardStr1: '', cardStr2: '', cardBillCity: '',
            cardBillState: '', cardZip: ''
        };

        this.props.getTrades();
        this.props.getFunds();
        this.props.getCompanies();
        this.props.getEntityTypes();

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

        if(nextProps.locationId) {
            let company = {
                name: this.state.companyName,
                phoneNumber: this.state.companyPhone,
                faxNumber: this.state.companyFax,
                entityTypeId: this.state.companyEntityTypeId,
                federalTaxPin: this.state.companyTaxPIN,
                requestedLaborRate: this.state.companyRequestedRate,
                approvedLaborRate: this.state.companyApprovedRate,
                dealerAccountNumber: this.state.companyDealerAccountNum,
                locationId: nextProps.locationId
            };

            this.props.createCompany(company);
        }

        if(nextProps.companyId) {
            let person = {
                firstName: this.state.firstName,
                lastName: this.state.lastName,
                email: this.state.email,
                password: this.state.password,
                tradeId: this.state.tradeId,
                fundId: this.state.fundId,
                locationId: this.state.locationId,
                companyId: nextProps.companyId,
                // TODO: figure out how to handle the stripe token creation
                // docs: {workerComp: this.state.docWorkerComp, w9: this.state.docW9, insurance: this.state.docInsurance, goodman: this.state.contractGoodman, asure: this.state.contractAsure},
                // payment: ''
            };

            this.props.signup(person);
            browserHistory.push('/');
        }
    }

    update(type, value) {

        this.setState({[type]: value});
    }

    sendInfo() {
        if(this.state.companyId) {
            let person = {
                firstName: this.state.firstName,
                lastName: this.state.lastName,
                email: this.state.email,
                password: this.state.password,
                tradeId: this.state.tradeId,
                fundId: this.state.fundId,
                locationId: this.state.locationId,
                companyId: this.state.companyId,
                // TODO: figure out how to handle the stripe token creation
                // docs: {workerComp: this.state.docWorkerComp, w9: this.state.docW9, insurance: this.state.docInsurance, goodman: this.state.contractGoodman, asure: this.state.contractAsure},
                // payment: ''
            };

            this.props.signup(person);
            browserHistory.push('/');
        } else {
            // create location
            let location = {
                addressLineOne: this.state.street,
                city: this.state.city,
                state: this.state.state,
                zipcode: this.state.zipcode
            };

            this.props.createLocation(location);
        }

        // TODO: check if company exists (if it doesn't hit the company create endpoint)
        //       this will return a companyId update "Person" with new companyId


    }

    nextAction(step) {
        let isComplete = true;

        if(step === 'step3') {
            isComplete = (this.state.docWorkerComp)     ? true : false;
            isComplete = (this.state.docW9)             ? true : false;
            isComplete = (this.state.docInsurance)      ? true : false;
            isComplete = (this.state.contractGoodman)   ? true : false;
            isComplete = (this.state.contractAsure)     ? true : false;
        }

        if(isComplete) {
            let currentStep = (this.state.currentStep + 1);
            console.log('currentStep: ', currentStep);

            this.setState({currentStep});

            if(step === 'step4') {
                this.props.getStripeToken({
                    cardName: this.state.cardName,
                    cardNumber: this.state.cardNumber,
                    expDate: this.state.expDate,
                    cvc: this.state.cvc
                });

                // remove credit card info from state
                this.setState({cardName: '', cardNumber: '', expDate: '', cvc: ''});
            }
        } else {
            if(step === 'step3') {
                let errorMsg = "Please complete each document";
                this.setState({errorMsg});
            }
        }
    }

    render() {
        let content, title;

        let styles = {
            container: {
                backgroundColor: '#F9FAFC',
                borderRadius: '5px',
                border: '1px solid rgba(50, 50, 50, 0.4)',
                boxShadow: '0px 2px 7px 0px rgba(50, 50, 50, 0.4)',
                width: '490px',
                margin: '10em auto',
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
            content: {
                margin: '40px auto 0px',
                textAlign: 'left',
                display: 'inline-grid',
                width: (this.state.currentStep === 5) ? '89%' : ''
            }
        };

        switch(this.state.currentStep) {
            case 1:
                let languages = _.map(this.props.languages, (language, key)=>{
                    return (<option key={ key } value={language} >{ language }</option>);
                });

                let languageSelect = <select value={this.props.currLang} onChange={(e)=>this.props.changeLanguage(e.target.value)} required>
                                         <option disabled value='select'>Language</option>
                                         { languages }
                                     </select>;

                content = <div>
                              <div style={styles.titleBar }><div style={styles.title}>Sign Up</div><div style={styles.language}>{languageSelect}</div></div>
                              <form onSubmit={this.nextAction}>
                                  <div style={styles.content}>
                                      <input type="email"     placeholder="Email"     value={this.state.email}    onChange={ (e)=>this.update('email', e.target.value) }      style={{width: '435px'}} required/>
                                      <input type="password"  placeholder="Password"  value={this.state.password} onChange={ (e)=>this.update('password', e.target.value) }   style={{width: '435px'}} required/>
                                  </div>

                                  <input className="submit-btn" type="submit" value="Create Account" style={{width: '89%'}} required/>
                              </form>
                          </div>;
                break;

            case 2:
                content = <Step2
                                firstName={this.state.firstName}
                                lastName={this.state.lastName}
                                fundId={this.state.fundId}
                                locationId={this.state.locationId}
                                tradeId={this.state.tradeId}

                                companyName={this.state.companyName}
                                street={this.state.street}
                                city={this.state.city}
                                state={this.state.state}
                                zipcode={this.state.zipcode}
                                phone={this.state.phone}
                                fax={this.state.fax}
                                entityTypeId={this.state.entityTypeId}
                                taxPIN={this.state.taxPIN}
                                requestedRate={this.state.requestedRate}
                                approvedRate={this.state.approvedRate}
                                dealerAccountNum={this.state.dealerAccountNum}

                                funds={this.props.funds.toJS()}
                                trades={this.props.trades.toJS()}
                                states={this.props.states.toJS()}
                                entityTypes={this.props.entityTypes.toJS()}
                                nextAction={this.nextAction}
                                update={this.update} />;
                break;

            case 3:
                content = <Step3
                                errorMsg={this.state.errorMsg}
                                docWorkerComp={this.state.docWorkerComp}
                                docW9={this.state.docW9}
                                docInsurance={this.state.docInsurance}
                                contractGoodman={this.state.contractGoodman}
                                contractAsure={this.state.contractAsure}
                                update={this.update}
                                showOverlay={this.props.showOverlay}
                                nextAction={this.nextAction} />;


                break;

            case 4:
                content = <Step4
                                states={this.props.states}
                                cardName={this.state.cardName}
                                expDate={this.state.expDate}
                                cardNumber={this.state.cardNumber}
                                cvc={this.state.cvc}
                                billName={this.state.billName}
                                str1={this.state.str1}
                                str2={this.state.str2}
                                billCity={this.state.billCity}
                                billState={this.state.billState}
                                zip={this.state.zip}
                                update={this.update}
                                nextAction={this.nextAction} />;
                break;

            case 5:
                content = <form onSubmit={this.sendInfo}>
                    <div style={styles.titleBar}><div style={styles.title} >All done</div></div>
                    <div style={styles.content}>
                        <p>Your account must be approved. This typically happens within 24 hours.</p><br/>

                        <p>We'll email { this.state.email } when approved.</p>
                    </div>

                    <input className="submit-btn" type="submit" value="Got it" required/>
                </form>;
                break;
        }

        let stepVisualizer = (this.state.currentStep !== 5) ? <StepVisualizer currentStep={this.state.currentStep} /> : null;

        return (
            <div style={styles.container}>
                { stepVisualizer }
                { content }
            </div>
        );
    }
}

let select = (state)=>{
    return {
        funds       : state.application.get('funds'),
        locations   : state.application.get('locations'),
        trades      : state.application.get('trades'),
        entityTypes : state.application.get('entityTypes'),
        companies   : state.application.get('companies'),
        states      : state.application.get('states'),

        docs        : state.application.getIn(['temp','docs']),
        companyId   : state.application.getIn(['temp','companyId']),
        locationId  : state.application.getIn(['temp','locationId']),

        currLang    : state.application.get('currLanguage'),
        languages   : state.application.get('language'),
    };
};

export default connect(select, {changeLanguage, showOverlay, ...signup}, null, {withRef: true})(Signup);