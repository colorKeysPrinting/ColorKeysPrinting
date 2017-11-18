'use strict';

import React                    from 'react';
import { Element }              from 'react-scroll';
import { Parallax, Background } from 'react-parallax';
import { Col, CardPanel, Card, CardTitle } from 'react-materialize';
import _                        from 'lodash';
import assets                   from 'utils/assets';

export default class ContactUs extends React.Component {
    constructor(props){
        super(props)

        const isMobile = this.props.isMobile;

        this.state = { isMobile };
        this.sendEmail = this.sendEmail.bind(this);
    }

    componentWillMount() {
        this.setState({
            name: this.refs['name'],
            email: this.refs['email'],
            message: this.refs['message']
        });
    }

    sendEmail() {
        const subject= "Color Keys Printing Website";
        let body = "Hello my name is " + this.refs['name'].value + "\n\n";
        body += this.refs['message'].value;
        body += "\n\nMy email is: " + this.refs['email'].value + "\n\n";
        body += "Thank you !\n\n I hope to hear from you soon\n\n" + this.refs['name'].value;

        let uri = "mailto:colorkeys13@gmail.com?subject=";
        uri += encodeURIComponent(subject);
        uri += "&body=";
        uri += encodeURIComponent(body);
        window.window.location.href = uri;
    }

    render(){
        const email = "colorkeys13@gmail.com";
        let contactSection;

        const emailCard = (
            <Card
                className="large blue-grey lighten-5"
                title="Drop us a line!" >
                <div className="card-content">
                    <form onSubmit={(e)=>{e.preventDefault(); this.sendEmail();}}>
                        <div className="row">
                            <div className="input-field col s12">
                                <input ref="name" id="first_name" type="text" className="validate" required/>
                                <label htmlFor="first_name">Name</label>
                            </div>
                        </div>

                        <div className="row">
                            <div className="input-field col s12">
                                <input ref="email" id="email" type="email" className="validate" required/>
                                <label htmlFor="email">Email</label>
                            </div>
                        </div>

                        <div className="row">
                            <div className="input-field col s12">
                                <textarea ref="message" id="textarea1" className="materialize-textarea" required></textarea>
                                <label htmlFor="textarea1">Message</label>
                            </div>
                        </div>

                        <button className="btn waves-effect waves-light" type="submit" name="action"> Submit
                            <i className="material-icons right">send</i>
                        </button>
                    </form>
                </div>
            </Card>
        );

        const contactCard = (
            <Card className="large blue-grey lighten-5">
                <div className="card-content" style={{ textAlign: 'center' }}>
                    <h5>Come see us in person!</h5>
                    <p className="cardFont">Set up an appointment so we can get started on the project in person!</p>

                    <h5>Color Keys Printing</h5>
                    <p className="cardFont">3342 E 113 N , Idaho Falls, Idaho 83401, United States</p>
                    <p className="cardFont"><a href="tel:208-589-7436"> 208-589-7436 </a> / 208-524-0456 </p>
                    <p className="cardFont"><a href={`mailto:${email}`}>{ email }</a></p>

                    <h5>Hours</h5>
                    <ul className="cardFont">
                        <li>By Appointment</li>
                        <li>Monday - Thursday: 8:30am - 5pm</li>
                        <li>Friday: 8:30am - 12:00pm</li>
                        <li>Saturday: Closed</li>
                        <li>Sunday: Closed</li>
                    </ul>
                </div>
            </Card>
        );

        if(this.state.isMobile) {
            contactSection = (
                <div>
                    { contactCard }
                </div>
            );
        } else {
            contactSection = (
                <div>
                    <Col m={12}>{ contactCard }</Col>
                </div>
            );
        }

        return (
            <div>
                <div className="section">
                    <div className="row">
                        <Element name="email">
                            <div className="yellow"><h3 className="header center"> Contact Us </h3></div>
                        </Element>

                        <div className="row">
                            <Col s={12} className="cards-container">
                                { contactSection }
                            </Col>
                        </div>
                    </div>
                </div>
                <br/>
            </div>
        );
    }
}
