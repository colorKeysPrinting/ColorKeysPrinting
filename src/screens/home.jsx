'use strict';

import React                    from 'react';
import { Parallax, Background } from 'react-parallax';
import _                        from 'lodash';
import { Element }              from 'react-scroll';
import assets                   from 'libs/assets';
import Navbar                   from 'components/nav_bar';
import ContactUs                from 'components/contact_us';
import GoogleMapComponent       from 'components/google_maps';
import Footerbar                from 'components/footer_bar';

export default class Home extends React.Component {
    constructor(props){
        super(props);

        this.state = {
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
                    'thank you cards'
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
                promotional: [
                    'flyers',
                    'posters',
                    'banners',
                    'tickets',
                    'calendars',
                    'magnets',
                ]
            }
        };
    }

    detectmob() {
        return (navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/webOS/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) ||
                navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/BlackBerry/i) || navigator.userAgent.match(/Windows Phone/i))
            ? true
            : false;
    }

    render(){
        const productCards = _.map(this.state.products, (product, key)=>{
            const productList = product.map((product, key)=>{
                return ( <li key={'product' + key}> {product} </li> );
            });

            const element = (
                <div key={'element' + key} className="card-panel blue-grey lighten-5">
                    <div className="center"><img src={"\." + assets("./images/logo.png")} alt="" className="cardIcon"/></div>
                    <h5 className="center">{key}</h5>
                    <div className="light center cardFont"><ul>{ productList }</ul></div>
                </div>
            );

            if(this.detectmob()){
                return ( <div key={'cardObj' + key}>{ element }</div> );
            } else {
                return ( <div key={'cardObj' + key} className="col m3">{ element }</div> );
            }
        });

        return (
            <div>
                <Navbar />
                <br/>
                <div id="index-banner" className="parallax-container" style={{ height:'220px' }}>
                    <img src={"\." + assets("./images/color_bar_for_website.png")} alt="" height="220px" style={{ position: 'absolute', top: '25px'}}/>
                </div>

                <div className="section">
                    <div className="row">
                        <div className="col s12 cards-container">
                            <div className="col m6">
                                <div className="card-panel blue-grey lighten-5" style={{fontSize: '20px'}}>
                                    <p> We specialize in producing high quality products with a personal touch to ensure the final product has the best presentation.  We offer small quantity full color and black and white printing from business cards to posters and anything in between! </p>
                                    <p> You don't need to order thousands to get a great price, and everything is printed in-house so you are not waiting weeks for your product. </p>
                                    <p> Our creative team will work with you on your project from start to finish to ensure you get a quality final product.  With over 20 years of experience and knowledge we are confident we can help with your project.  You can also send us your designs to have printed.  Give us a call today to see how we can help with your printing needs. </p>
                                </div>
                            </div>
                            <div className="col m6">
                                <div className="card large">
                                    <img src={"\." + assets("./images/products.png")} alt="" width="100%" height="100%"/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <Parallax strength={300}>
                    <Background>
                        <img src={"\." + assets("./images/ink-flowing-in-the-water.png")} alt="Unsplashed background img 2" height="3500px"/>
                    </Background>
                    <div className="section">
                        <div className="row">
                            <div className="yellow"><h3 className="header center"> Products </h3></div>
                        </div>
                        <div className="row">
                            <div className="col s12 cards-container">
                                { productCards }
                            </div>
                        </div>
                    </div>
                    <ContactUs isMobile={ this.detectmob() }/>
                </Parallax>
                <section style={{ height: (this.detectmob()) ? '300px' : '450px' }}>
                    <GoogleMapComponent
                        isMobile={ this.detectmob() }
                        googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places"
                        loadingElement={<div style={{ width: "100%", height: "100%" }} />}
                        containerElement={<div style={{ width: "100%", height: "100%" }} />}
                        mapElement={<div style={{ width: "100%", height: "100%" }} />}
                        isMarkerShown
                    />
                </section>
                <Footerbar />
            </div>
        );
    }
}
