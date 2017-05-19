import React                    from 'react';
import { connect }              from 'react-redux';
import _                        from 'lodash';
import assets                   from '../../libs/assets';

import {changeLanguage, showOverlay}         from '../../actions/application';

let select = (state)=>{
    return {
        currLang    : state.application.get('currLanguage'),
        languages   : state.application.get('languageList').toJS(),
        funds       : state.application.get('fundsList').toJS(),
        locations   : state.application.get('locationList').toJS(),
        trades      : state.application.get('tradeList').toJS(),
        entities    : state.application.get('entityList').toJS(),
        states      : {'AL':'Alabama','AK':'Alaska','AS':'American Samoa','AZ':'Arizona','AR':'Arkansas','CA':'California','CO':'Colorado','CT':'Connecticut','DE':'Delaware','DC':'District Of Columbia','FM':'Federated States Of Micronesia','FL':'Florida','GA':'Georgia','GU':'Guam','HI':'Hawaii','ID':'Idaho','IL':'Illinois','IN':'Indiana','IA':'Iowa','KS':'Kansas','KY':'Kentucky','LA':'Louisiana','ME':'Maine','MH':'Marshall Islands','MD':'Maryland','MA':'Massachusetts','MI':'Michigan','MN':'Minnesota','MS':'Mississippi','MO':'Missouri','MT':'Montana','NE':'Nebraska','NV':'Nevada','NH':'New Hampshire','NJ':'New Jersey','NM':'New Mexico','NY':'New York','NC':'North Carolina','ND':'North Dakota','MP':'Northern Mariana Islands','OH':'Ohio','OK':'Oklahoma','OR':'Oregon','PW':'Palau','PA':'Pennsylvania','PR':'Puerto Rico','RI':'Rhode Island','SC':'South Carolina','SD':'South Dakota','TN':'Tennessee','TX':'Texas','UT':'Utah','VT':'Vermont','VI':'Virgin Islands','VA':'Virginia','WA':'Washington','WV':'West Virginia','WI':'Wisconsin','WY':'Wyoming'}
    };
};

@connect(select, {changeLanguage, showOverlay}, null, {withRef: true})
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
    }

    nextAction() {
        this.setState((prevState)=>({
            currentStep: prevState.currentStep + 1
        }));

        console.log(this.state.currentStep, this.state.buttonText);
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
                zIndex: '999',
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
            width100: {
                width: '97%'
            }
        };

        switch(this.state.currentStep) {
            case 1:
                let languages = _.map(this.props.languages, (language, key)=>{
                    return (<option key={ key } value={ language }>{ language }</option>);
                });

                let languageSelect =    <select value={ this.props.currLang } onChange={ (e)=>this.props.changeLanguage(e.target.value) } style={styles.width100}>
                                            <option disabled value='select'>Language</option>
                                            {languages}
                                        </select>;

                title = <div id="sign-up-title" style={ styles.titleBar }><div style={ styles.title}>Sign Up</div><div style={styles.language}>{languageSelect}</div></div>;
                content = <form onSubmit={this.nextAction}>
                    <div style={styles.content}>
                        <input type="email" placeholder="Email" value={this.state.email} onChange={ (e)=>this.update('email', e.target.value) } style={styles.width100}/>
                        <input type="password" placeholder="Password" value={this.state.password} onChange={ (e)=>this.update('password', e.target.value) } style={styles.width100}/>
                    </div>

                    <input type="submit" value="Create Account" style={ styles.submitBtn }/>
                </form>;
                break;
            case 2:
                title = <div id="sign-up-title" style={ styles.titleBar}><div style={ styles.title }>Account Details</div><div style={styles.steps}>step 2 of 4</div></div>;

                let funds = _.map(this.props.funds, (fund, key)=>{
                    return (<option key={ key } value={ fund }>{ fund }</option>);
                });

                let locations = _.map(this.props.locations, (location, key)=>{
                    return (<option key={ key } value={ location }>{ location }</option>);
                });

                let trades = _.map(this.props.trades, (trade, key)=>{
                    return (<option key={ key } value={ trade }>{ trade }</option>);
                });

                let states = _.map(this.props.states, (name, abv)=>{
                    return (<option key={ abv } value={ abv }>{ name }</option>);
                });

                let entities = _.map(this.props.entities, (entity, key)=>{
                    return (<option key={ key } value={ entity }>{ entity }</option>);
                });

                content = <form onSubmit={ this.nextAction}>
                    <div style={styles.content}>
                        <div style={{columnCount: 2, display: 'inline-flex', width: '540px'}}>
                            <input type="text" placeholder="First name" value={ this.state.firstName } onChange={ (e)=>this.update('firstName', e.target.value)} style={styles.width100}/>
                            <input type="text" placeholder="Last name" value={ this.state.lastName } onChange={ (e)=>this.update('lastName', e.target.value)} style={styles.width100}/>
                        </div>
                        <div style={{columnCount: 2}}>
                            <select value={ this.state.fund } onChange={ (e)=>this.update('fund', e.target.value) } style={styles.width100}>
                                <option disabled value='select'>Associated fund</option>
                                {funds}
                            </select>
                            <select value={ this.state.trade } onChange={ (e)=>this.update('trade', e.target.value) } style={styles.width100}>
                                <option disabled value='select'>Trade</option>
                                {trades}
                            </select>
                            <select value={ this.state.location } onChange={ (e)=>this.update('location', e.target.value) } style={styles.width100}>
                                <option disabled value='select'>Location</option>
                                {locations}
                            </select>
                        </div>
                        <hr/>
                        <div style={{}}>
                            <input type="text" placeholder="Your company's name" value={ this.state.companyName } onChange={ (e)=>this.update('companyName', e.target.value)} style={styles.width100}/>
                            <input type="text" placeholder="Address" value={ this.state.street } onChange={ (e)=>this.update('street', e.target.value)} style={styles.width100}/>
                        </div>
                        <div style={{columnCount: 2}}>
                            <input type="text" placeholder="City" value={ this.state.city } onChange={ (e)=>this.update('city', e.target.value)} style={styles.width100}/>
                            <input type="number" placeholder="Phone" value={ this.state.phone } onChange={ (e)=>this.update('phone', e.target.value)} style={styles.width100}/>
                            <select value={ this.state.entityType } onChange={ (e)=>this.update('entityType', e.target.value) } style={styles.width100}>
                                <option disabled value='select'>Entity type</option>
                                {entities}
                            </select>
                            <input type="number" placeholder="Requested labor rate" value={ this.state.requestRate } onChange={ (e)=>this.update('requestRate', e.target.value)} style={styles.width100}/>
                            <input type="number" placeholder="Dealer account number" value={ this.state.dealerAccountNum } onChange={ (e)=>this.update('dealerAccountNum', e.target.value)} style={styles.width100}/>

                            <select value={ this.state.state } onChange={ (e)=>this.update('state', e.target.value) } style={styles.width100}>
                                <option disabled value='select'>State</option>
                                {states}
                            </select>
                            <input type="number" placeholder="Fax" value={ this.state.fax } onChange={ (e)=>this.update('fax', e.target.value)} style={styles.width100}/>
                            <input type="number" placeholder="Federal tax PIN" value={ this.state.taxPIN } onChange={ (e)=>this.update('taxPIN', e.target.value)} style={styles.width100}/>
                            <input type="number" placeholder="Approved labor rate" value={ this.state.approvedRate } onChange={ (e)=>this.update('approvedRate', e.target.value)} style={styles.width100}/>
                        </div>
                    </div>

                    <input type="submit" value="Next" style={ styles.submitBtn }/>
                </form>;
                break;

            case 3:
                title = <div id="sign-up-title" style={ styles.titleBar}><div style={ styles.title }>Compliance</div><div style={styles.steps}>step 3 of 4</div></div>;
                content = <form onSubmit={this.nextAction}>
                    <div style={styles.contentUpload}>
                        <span onClick={()=>{this.props.showOverlay('docWorkerComp')}} ><img src={''} alt="workersCompImg" />Add worker's comp</span>
                        <span onClick={()=>{this.props.showOverlay('docW9')}} ><img src={''} alt="w9Img" />Add w9</span>
                        <span onClick={()=>{this.props.showOverlay('docInsurance')}} ><img src={''} alt="insuranceImg" />Add proof of insurance</span>

                        <span onClick={()=>{this.props.showOverlay('contractGoodman')}} ><img src={''} alt="insuranceImg" />Agree to Goodman contract</span>
                        <span onClick={()=>{this.props.showOverlay('contractAsure')}} ><img src={''} alt="insuranceImg" />Agree to Asure contact</span>
                    </div>

                    <input type="submit" value="Finish" style={ styles.submitBtn }/>
                </form>;

                break;
            default:
        }

        return (
            <div style={styles.container}>
                {title}
                {content}
            </div>
        );
    }
}



