import React from 'react';
import { Element } from 'react-scroll';
import { Col, Card } from 'react-materialize';
import { FacebookIcon, TwitterIcon, GooglePlusIcon } from 'react-share';
import assets from 'utils/assets';

import { Header, CardFont, SocialMedia, SocialMediaBtn } from 'styles/common';

export default class ContactUs extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isMobile: this.props.isMobile };
  }

  componentWillMount() {
    this.setState({
      name: this.refs['name'],
      email: this.refs['email'],
      message: this.refs['message'],
    });
  }

  sendEmail = () => {
    const subject = 'Color Keys Printing Website';
    let body = 'Hello my name is ' + this.refs['name'].value + '\n\n';
    body += this.refs['message'].value;
    body += '\n\nMy email is: ' + this.refs['email'].value + '\n\n';
    body += 'Thank you !\n\n I hope to hear from you soon\n\n' + this.refs['name'].value;

    let uri = 'mailto:colorkeys13@gmail.com?subject=';
    uri += encodeURIComponent(subject);
    uri += '&body=';
    uri += encodeURIComponent(body);
    window.window.location.href = uri;
  };

  render() {
    const email = 'colorkeys13@gmail.com';
    let contactSection;

    const emailCard = (
      <Card className="large blue-grey lighten-5" title="Drop us a line!">
        <div className="card-content">
          <form
            onSubmit={e => {
              e.preventDefault();
              this.sendEmail();
            }}>
            <div className="row">
              <div className="input-field col s12">
                <input ref="name" id="first_name" type="text" className="validate" required />
                <label htmlFor="first_name">Name</label>
              </div>
            </div>

            <div className="row">
              <div className="input-field col s12">
                <input ref="email" id="email" type="email" className="validate" required />
                <label htmlFor="email">Email</label>
              </div>
            </div>

            <div className="row">
              <div className="input-field col s12">
                <textarea ref="message" id="textarea1" className="materialize-textarea" required />
                <label htmlFor="textarea1">Message</label>
              </div>
            </div>

            <button className="btn waves-effect waves-light" type="submit" name="action">
              {' '}
              Submit
              <i className="material-icons right">send</i>
            </button>
          </form>
        </div>
      </Card>
    );

    const contactCard = (
      <Card
        className="large blue-grey lighten-5"
        style={{ height: window.innerWidth < 600 ? '700px' : '550px' }}>
        <div className="card-content" style={{ textAlign: 'center' }}>
          <Header>Come see us in person!</Header>
          <CardFont>Set up an appointment so we can get started on the project in person!</CardFont>

          <Header>Color Keys Printing</Header>
          <CardFont>3342 E 113 N , Idaho Falls, Idaho 83401, United States</CardFont>
          <CardFont>
            <a href="tel:208-589-7436"> 208-589-7436 </a> / 208-524-0456{' '}
          </CardFont>
          <CardFont>
            <a href={`mailto:${email}`}>{email}</a>
          </CardFont>

          <Header>Hours</Header>
          <ul>
            <li>By Appointment</li>
            <li>Monday - Thursday: 8:30am - 5pm</li>
            <li>Friday: 8:30am - 12:00pm</li>
            <li>Saturday: Closed</li>
            <li>Sunday: Closed</li>
          </ul>
          <SocialMedia>
            <SocialMediaBtn href="https://www.facebook.com/colorkeysprinting">
              <FacebookIcon size={32} round />
            </SocialMediaBtn>
            <SocialMediaBtn href="https://twitter.com/colorkeys13">
              <TwitterIcon size={32} round />
            </SocialMediaBtn>
            <SocialMediaBtn href="https://plus.google.com/u/0/113724115750329359769">
              <GooglePlusIcon size={32} round />
            </SocialMediaBtn>
          </SocialMedia>
        </div>
      </Card>
    );

    if (this.state.isMobile) {
      contactSection = <div>{contactCard}</div>;
    } else {
      contactSection = (
        <div>
          <Col m={12}>{contactCard}</Col>
        </div>
      );
    }

    return (
      <div>
        <div className="section">
          <div className="row">
            <Element name="email">
              <div className="yellow">
                <h3 className="header center"> Contact Us </h3>
              </div>
            </Element>

            <div className="row">
              <Col s={12} className="cards-container">
                {contactSection}
              </Col>
            </div>
          </div>
        </div>
        <br />
      </div>
    );
  }
}
