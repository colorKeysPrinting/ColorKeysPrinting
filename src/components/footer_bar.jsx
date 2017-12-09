'use strict';

import React                    from 'react';
import { animateScroll }        from 'react-scroll';
import { Col, CardPanel, Card, Button } from 'react-materialize';
import _                        from 'lodash';
import { ShareButtons, ShareCounts, generateShareIcon } from 'react-share';
import assets                   from 'utils/assets';

export default class Navbar extends React.Component {
    constructor(props){
        super(props)

        this.state = { scroll: animateScroll }

        this.scrollToTop = this.scrollToTop.bind(this)
    }

    scrollToTop() {
        this.state.scroll.scrollToTop();
    }

    render(){

        const { FacebookShareButton, GooglePlusShareButton, TwitterShareButton } = ShareButtons;

        const FacebookIcon = generateShareIcon('facebook');
        const GooglePlusIcon = generateShareIcon('google');
        const TwitterIcon = generateShareIcon('twitter');

        const title = 'Color Keys Printing';

        return (
            <div>
                <br/>
                <div className="center">
                    <Button waves="light" className="waves-effect" onClick={this.scrollToTop}>Back To Top</Button>
                </div>
                <footer className="page-footer black">
                    <div className="social-media-section">
                        <FacebookShareButton
                            url={'https://www.facebook.com/colorkeysprinting'}
                            quote={title}
                            className="social-media-button">
                            <FacebookIcon
                                size={32}
                                round />
                        </FacebookShareButton>

                        <TwitterShareButton
                            url={'https://twitter.com/colorkeys13'}
                            title={title}
                            className="social-media-button">
                            <TwitterIcon
                                size={32}
                                round />
                        </TwitterShareButton>

                        <GooglePlusShareButton
                            url={'https://plus.google.com/u/0/113724115750329359769'}
                            className="social-media-button">
                            <GooglePlusIcon
                                size={32}
                                round />
                        </GooglePlusShareButton>
                    </div>
                    <div className="container">
                        <div className="row">
                            <Col s={12} m={16} >
                                <p className="grey-text text-lighten-4">Copyright © 2016 Color Keys Printing - All Rights Reserved.</p>
                            </Col>
                        </div>
                    </div>
                    <div className="footer-copyright">
                        <div className="container">
                        Made with <a className="brown-text text-lighten-3" href="http://materializecss.com">Materialize</a>
                        </div>
                    </div>
                </footer>
            </div>
        );
    }
}
