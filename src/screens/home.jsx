import _ from 'lodash';
import React from 'react';
import { Parallax, Background } from 'react-parallax';
import { Element } from 'react-scroll';
import { Col, CardPanel, Card, Button, Icon } from 'react-materialize';
import assets from 'utils/assets';

import HeaderBar from 'components/header_bar';
import ContactUs from 'components/contact_us';
import GoogleMapComponent from 'components/google_maps';
import Footerbar from 'components/footer_bar';

export default class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      location: {
        lat: 43.597457,
        lng: -111.965967,
        addr: '3342+East+113+North,+Idaho+Falls,+ID+83401,+United+States',
      },
      products: {
        business: [
          'business cards',
          'appointment cards',
          'brochures',
          'letterhead',
          'envelopes',
          'carbonless forms',
          'flyers',
          'labels',
          'newsletters',
          'notepads',
          'numbered forms',
          'postcards',
          'thank you cards',
        ],
        general: [
          'announcements',
          'booklets',
          'flyers',
          'giclee art prints',
          'greeting cards',
          'labels',
          'large format prints',
          'postcards',
          'posters',
          'programs',
          'thank you cards',
          'tickets',
          'wedding invitations',
        ],
        services: [
          'numbering',
          'laminating',
          'color copies',
          'vinyl lettering',
          'graphic design',
          'spiral binding',
          'padding',
          'canvas wraps',
          'direct mail',
          'fulfillment',
          'free delivery',
        ],
        promotional: ['flyers', 'posters', 'banners', 'tickets', 'calendars', 'magnets'],
      },
    };

    this.getDirections = this.getDirections.bind(this);
  }

  detectMobile() {
    return navigator.userAgent.match(/Android/i) ||
      navigator.userAgent.match(/webOS/i) ||
      navigator.userAgent.match(/iPhone/i) ||
      navigator.userAgent.match(/iPad/i) ||
      navigator.userAgent.match(/iPod/i) ||
      navigator.userAgent.match(/BlackBerry/i) ||
      navigator.userAgent.match(/Windows Phone/i)
      ? true
      : false;
  }

  getDirections() {
    const { isMobile } = this.props;
    const { location } = this.state;

    isMobile
      ? navigator.userAgent.match(/iPhone/i) ||
        navigator.userAgent.match(/iPad/i) ||
        navigator.userAgent.match(/iPod/i)
        ? window.open(`https://maps.google.com/maps?daddr=${location.addr}&amp&z=17;ll=`)
        : window.open(`maps://maps.google.com/maps?daddr=${location.addr}&amp&z=17;ll=`)
      : window.open(`https://maps.google.com/maps?daddr=${location.addr}&amp&z=17;ll=`);
  }

  render() {
    const { products } = this.state;
    return (
      <div>
        <HeaderBar />
        <div className="content">
          <Parallax strength={300}>
            <Background>
              <img
                src={assets('./images/paint_splatter_large.png')}
                alt="Unsplashed background img 2"
                height="2500px"
                width={`${window.width}px`}
              />
            </Background>
            {/* <div id="index-banner" className="parallax-container" style={{ height: (window.innerWidth > 1200) ? '500px': '210px', width: (window.innerWidth > 1200) ? '75%': '100%' , margin: '0 auto' }}>
                            <img src={assets('./images/Christmas_offer.png')} alt="" style={{ position: 'absolute', top: '25px', width: '100%', backgroundColor: '#FFF' }}/>
                        </div> */}

            <div className="section">
              <div className="row">
                <Col s={12} className="cards-container">
                  <Col m={6}>
                    <CardPanel className="blue-grey lighten-5" style={{ fontSize: '20px' }}>
                      <p>
                        {' '}
                        We specialize in producing high quality products with a personal touch to
                        ensure the final product has the best presentation. We offer small quantity
                        full color and black and white printing from business cards to posters and
                        anything in between!{' '}
                      </p>
                      <p>
                        {' '}
                        You don't need to order thousands to get a great price, and everything is
                        printed in-house so you are not waiting weeks for your product.{' '}
                      </p>
                      <p>
                        {' '}
                        Our creative team will work with you on your project from start to finish to
                        ensure you get a quality final product. With over 20 years of experience and
                        knowledge we are confident we can help with your project. You can also send
                        us your designs to have printed. Give us a call today to see how we can help
                        with your printing needs.{' '}
                      </p>
                    </CardPanel>
                  </Col>
                  <Col m={6}>
                    <Card
                      className="large"
                      style={{
                        height: window.innerWidth > 600 ? '670px' : '280px',
                      }}>
                      <img
                        src={assets('./images/products.png')}
                        alt=""
                        width="100%"
                        height="100%"
                      />
                    </Card>
                  </Col>
                </Col>
              </div>
            </div>

            <div className="section">
              <div className="row">
                <div className="yellow">
                  <h3 className="header center"> Products </h3>
                </div>
              </div>
              <div className="row">
                <Col s={12} className="cards-container">
                  {_.map(products, (product, key) => {
                    const element = (
                      <CardPanel key={`element${key}`} className="blue-grey lighten-5 my-cards">
                        <div className="center">
                          <img src={assets('./images/logo.png')} alt="" className="card-icon" />
                        </div>
                        <h5 className="center">{key}</h5>
                        <h2 className="hidden">{key}</h2>
                        <div className="light center cardFont">
                          <ul>
                            {product.map((product, key) => {
                              return <li key={`product${key}`}> {product} </li>;
                            })}
                          </ul>
                        </div>
                      </CardPanel>
                    );

                    return this.detectMobile() ? (
                      <div key={`cardObj${key}`}>{element}</div>
                    ) : (
                      <Col key={`cardObj${key}`} m={3}>
                        {element}
                      </Col>
                    );
                  })}
                </Col>
              </div>
            </div>
            <ContactUs isMobile={this.detectMobile()} />

            <section style={{ height: this.detectMobile() ? '300px' : '450px' }}>
              <Button
                wave="light"
                className="waves-effect"
                style={{ position: 'absolute', margin: '10px' }}
                name="directions"
                onClick={e => {
                  e.preventDefault();
                  this.getDirections();
                }}>
                <Icon left style={{ transform: 'rotate(50deg)' }}>
                  navigation
                </Icon>Get Directions
              </Button>
              {/* NOTE: GOOGLE_API_KEY comes from an ENV variable */}
              <GoogleMapComponent
                isMobile={this.detectMobile()}
                googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${
                  process.env.GOOGLE_API_KEY
                }&v=3.exp&libraries=geometry,drawing,places`}
                loadingElement={<div style={{ width: '100%', height: '100%' }} />}
                containerElement={<div style={{ width: '100%', height: '100%' }} />}
                mapElement={<div style={{ width: '100%', height: '100%' }} />}
                location={this.state.location}
                isMarkerShown
              />
            </section>
            <Footerbar />
          </Parallax>
        </div>
      </div>
    );
  }
}
