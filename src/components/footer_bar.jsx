import React from 'react';
import { animateScroll } from 'react-scroll';
import { Col, CardPanel, Card, Button } from 'react-materialize';
import _ from 'lodash';
import { ShareButtons, generateShareIcon } from 'react-share';
import assets from 'utils/assets';

export default class Navbar extends React.Component {
  constructor(props) {
    super(props);

    this.state = { scroll: animateScroll };

    this.scrollToTop = this.scrollToTop.bind(this);
  }

  scrollToTop() {
    this.state.scroll.scrollToTop();
  }

  render() {
    const {
      FacebookShareButton,
      GooglePlusShareButton,
      TwitterShareButton,
      TelegramShareButton,
      WhatsappShareButton,
      RedditShareButton,
      TumblrShareButton,
    } = ShareButtons;

    const FacebookIcon = generateShareIcon('facebook');
    const TwitterIcon = generateShareIcon('twitter');
    const TelegramIcon = generateShareIcon('telegram');
    const WhatsappIcon = generateShareIcon('whatsapp');
    const GooglePlusIcon = generateShareIcon('google');
    const RedditIcon = generateShareIcon('reddit');
    const TumblrIcon = generateShareIcon('tumblr');

    const shareUrl = 'https://www.colorkeysprinting.com/home';
    const title = 'Color Keys Printing';

    return (
      <div>
        <br />
        <div className="center">
          <Button waves="light" className="waves-effect" onClick={this.scrollToTop}>
            Back To Top
          </Button>
        </div>
        <footer className="page-footer black">
          <div className="heading">Tell about us on:</div>
          <div className="social-media-section">
            <div className="social-media-networks">
              <FacebookShareButton url={shareUrl} quote={title} className="social-media-butto">
                <FacebookIcon size={32} round />
              </FacebookShareButton>
            </div>

            <div className="social-media-networks">
              <TwitterShareButton url={shareUrl} title={title} className="social-media-butto">
                <TwitterIcon size={32} round />
              </TwitterShareButton>
            </div>

            <div className="social-media-networks">
              <TelegramShareButton url={shareUrl} title={title} className="social-media-butto">
                <TelegramIcon size={32} round />
              </TelegramShareButton>
            </div>

            <div className="social-media-networks">
              <WhatsappShareButton
                url={shareUrl}
                title={title}
                separator=":: "
                className="social-media-butto">
                <WhatsappIcon size={32} round />
              </WhatsappShareButton>
            </div>

            <div className="social-media-networks">
              <GooglePlusShareButton url={shareUrl} className="social-media-butto">
                <GooglePlusIcon size={32} round />
              </GooglePlusShareButton>
            </div>

            <div className="social-media-networks">
              <RedditShareButton
                url={shareUrl}
                title={title}
                windowWidth={660}
                windowHeight={460}
                className="social-media-butto">
                <RedditIcon size={32} round />
              </RedditShareButton>
            </div>

            <div className="social-media-networks">
              <TumblrShareButton
                url={shareUrl}
                title={title}
                windowWidth={660}
                windowHeight={460}
                className="social-media-butto">
                <TumblrIcon size={32} round />
              </TumblrShareButton>
            </div>
          </div>
          <div className="container">
            <div className="row">
              <Col s={12} m={16}>
                <p className="grey-text text-lighten-4">
                  Copyright © 2016 Color Keys Printing - All Rights Reserved.
                </p>
              </Col>
              <Col s={12} m={16}>
                Made with{' '}
                <a className="brown-text text-lighten-3" href="http://materializecss.com">
                  Materialize
                </a>
              </Col>
            </div>
          </div>
        </footer>
      </div>
    );
  }
}
