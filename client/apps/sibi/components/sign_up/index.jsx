import React                    from 'react';
import { connect }              from 'react-redux';
import _                        from 'lodash';
import assets                   from '../../libs/assets';

let select = (state)=>{
    return {
        funds: state.application.fundsList,
        locations: state.application.locationList,
        trades: state.application.tradeList,
        entities: state.application.entityList,
        states: {'AL':'Alabama','AK':'Alaska','AS':'American Samoa','AZ':'Arizona','AR':'Arkansas','CA':'California','CO':'Colorado','CT':'Connecticut','DE':'Delaware','DC':'District Of Columbia','FM':'Federated States Of Micronesia','FL':'Florida','GA':'Georgia','GU':'Guam','HI':'Hawaii','ID':'Idaho','IL':'Illinois','IN':'Indiana','IA':'Iowa','KS':'Kansas','KY':'Kentucky','LA':'Louisiana','ME':'Maine','MH':'Marshall Islands','MD':'Maryland','MA':'Massachusetts','MI':'Michigan','MN':'Minnesota','MS':'Mississippi','MO':'Missouri','MT':'Montana','NE':'Nebraska','NV':'Nevada','NH':'New Hampshire','NJ':'New Jersey','NM':'New Mexico','NY':'New York','NC':'North Carolina','ND':'North Dakota','MP':'Northern Mariana Islands','OH':'Ohio','OK':'Oklahoma','OR':'Oregon','PW':'Palau','PA':'Pennsylvania','PR':'Puerto Rico','RI':'Rhode Island','SC':'South Carolina','SD':'South Dakota','TN':'Tennessee','TX':'Texas','UT':'Utah','VT':'Vermont','VI':'Virgin Islands','VA':'Virginia','WA':'Washington','WV':'West Virginia','WI':'Wisconsin','WY':'Wyoming'}
    };
};

@connect(select, {}, null, {withRef: true})
export default class SignUp extends React.Component {

    constructor(props) {
        super(props);

        this.state = {currentStep: 1, buttonText: 'Create Account',
            email: '', password: '', firstName: '', lastName: '', fund:'', location: '', trade: '',
            companyName: '', street: '', city: '', state: '', phone: '', fax: '', entityType: '',
            taxPIN: '', requestRate: '', approvedRate: '', dealerAccountNum: '', docWorkerComp: '',
            docW9: '',  docInsurance: '', contractGoodman: false,  contractAsure: false, cardName: '',
            cardNumber: '', expDate: '', cvc: '', billName: '', str1: '', str2: '', billCity: '',
            billState: '', zip: ''
        };

        this.sendInfo = this.sendInfo.bind(this);
        this.nextAction = this.nextAction.bind(this);
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

        console.log(this.state.step, this.state.buttonText);
    }

    render() {
        let content, title;

        switch(this.state.currentStep) {
            case 1:
                title = <div id="sign-up-title" style={{}}><div>Sign Up</div><div>English</div></div>;
                content = <div>
                    <div style={{}}><input type="email" placeholder="Email" onChange={(e)=>this.setState({email: e.target.value})} style={{}}/></div>
                    <div style={{}}><input type="password" placeholder="Password" onChange={(e)=>this.setState({password: e.target.value})} style={{}}/></div>
                    <div onClick={this.nextAction} style={{}}>Create Account</div>
                </div>;
                break;
            case 2:
                title = <div id="sign-up-title" style={{}}><div>Account Details</div><div>step 2 of 4</div></div>;

                let funds = _.map(this.props.funds, (fund)=>{
                    return <option value={fund}>{fund}</option>;
                });

                let locations = _.map(this.props.locations, (location)=>{
                    return <option value={location}>{location}</option>;
                });

                let trades = _.map(this.props.trades, (trade)=>{
                    return <option value={trade}>{trade}</option>;
                });

                let states = _.map(this.props.states, (name, abv)=>{
                    return <option value={abv}>{name}</option>;
                });

                let entities = _.map(this.props.entities, (entity)=>{
                    return <option value={entity}>{entity}</option>;
                });

                content = <form onSubmit={this.nextAction}>
                    <div>
                        <input type="text" placeholder="First name" value={this.state.firstName} onChange={(e)=>this.setState({firstName: e.target.value})}/>
                        <input type="text" placeholder="Last name" value={this.state.lastName} onChange={(e)=>this.setState({lastName: e.target.value})}/>
                    </div>
                    <div>
                        <select value={this.state.fund} onChange={(e)=>this.setState({fund: e.target.value})} >
                            {funds}
                        </select>
                        <select value={this.state.location} onChange={(e)=>this.setState({location: e.target.value})} >
                            {locations}
                        </select>
                        <select value={this.state.trade} onChange={(e)=>this.setState({trade: e.target.value})} >
                            {trades}
                        </select>
                    </div>
                    <div>
                        <input type="text" placeholder="Your company's name" value={this.state.companyName} onChange={(e)=>this.setState({companyName: e.target.value})}/>
                        <input type="text" placeholder="Address" value={this.state.street} onChange={(e)=>this.setState({street: e.target.value})}/>
                        <input type="text" placeholder="City" value={this.state.city} onChange={(e)=>this.setState({city: e.target.value})}/>
                        <select value={this.state.state} onChange={(e)=>this.setState({state: e.target.value})} >
                            {states}
                        </select>

                        <input type="text" placeholder="Phone" value={this.state.phone} onChange={(e)=>this.setState({phone: e.target.value})}/>
                        <input type="text" placeholder="Fax" value={this.state.fax} onChange={(e)=>this.setState({fax: e.target.value})}/>
                        <select value={this.state.entityType} onChange={(e)=>this.setState({entityType: e.target.value})} >
                            {entities}
                        </select>

                        <input type="text" placeholder="Federal tax PIN" value={this.state.taxPIN} onChange={(e)=>this.setState({taxPIN: e.target.value})}/>
                        <input type="text" placeholder="Requested labor rate" value={this.state.requestRate} onChange={(e)=>this.setState({requestRate: e.target.value})}/>
                        <input type="text" placeholder="Approved labor rate" value={this.state.approvedRate} onChange={(e)=>this.setState({approvedRate: e.target.value})}/>
                        <input type="text" placeholder="Dealer account number" value={this.state.dealerAccountNum} onChange={(e)=>this.setState({dealerAccountNum: e.target.value})}/>
                    </div>

                    <input type="submit" value="Next" />
                </form>;

            default:
        }

        return (
            <div>


            </div>
        );
    }
}



