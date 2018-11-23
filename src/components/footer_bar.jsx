import React, { Component } from 'react'
import { animateScroll }    from 'react-scroll'
import { Col, Button }      from 'react-materialize'
import {
  FacebookShareButton,
  GooglePlusShareButton,
  TwitterShareButton,
  TelegramShareButton,
  WhatsappShareButton,
  RedditShareButton,
  TumblrShareButton,
  FacebookIcon,
  TwitterIcon,
  GooglePlusIcon,
  TelegramIcon,
  WhatsappIcon,
  RedditIcon,
  TumblrIcon
} from 'react-share'

import { FooterHeading, SocialMedia, SocialMediaNetworks, SocialMediaBtn } from '../styles/common'

export default class Navbar extends Component {
  state = { scroll: animateScroll }

  scrollToTop = () => {
    this.state.scroll.scrollToTop()
  }

  render() {
    const shareUrl = 'https://www.colorkeysprinting.com/home'
    const title = 'Color Keys Printing'

    return (
      <div>
        <br />
        <div className="center">
          <Button waves="light" className="waves-effect" onClick={this.scrollToTop}>
            Back To Top
          </Button>
        </div>
        <footer className="page-footer black">
          <FooterHeading>Tell about us on:</FooterHeading>
          <SocialMedia>
            <SocialMediaNetworks>
              <SocialMediaBtn>
                <FacebookShareButton url={shareUrl} quote={title}>
                  <FacebookIcon size={32} round />
                </FacebookShareButton>
              </SocialMediaBtn>
            </SocialMediaNetworks>

            <SocialMediaNetworks>
              <SocialMediaBtn>
                <TwitterShareButton url={shareUrl} title={title}>
                  <TwitterIcon size={32} round />
                </TwitterShareButton>
              </SocialMediaBtn>
            </SocialMediaNetworks>

            <SocialMediaNetworks>
              <SocialMediaBtn>
                <TelegramShareButton url={shareUrl} title={title}>
                  <TelegramIcon size={32} round />
                </TelegramShareButton>
              </SocialMediaBtn>
            </SocialMediaNetworks>

            <SocialMediaNetworks>
              <SocialMediaBtn>
                <WhatsappShareButton url={shareUrl} title={title} separator=":: ">
                  <WhatsappIcon size={32} round />
                </WhatsappShareButton>
              </SocialMediaBtn>
            </SocialMediaNetworks>

            <SocialMediaNetworks>
              <SocialMediaBtn>
                <GooglePlusShareButton url={shareUrl}>
                  <GooglePlusIcon size={32} round />
                </GooglePlusShareButton>
              </SocialMediaBtn>
            </SocialMediaNetworks>

            <SocialMediaNetworks>
              <SocialMediaBtn>
                <RedditShareButton
                  url={shareUrl}
                  title={title}
                  windowWidth={660}
                  windowHeight={460}>
                  <RedditIcon size={32} round />
                </RedditShareButton>
              </SocialMediaBtn>
            </SocialMediaNetworks>

            <SocialMediaNetworks>
              <SocialMediaBtn>
                <TumblrShareButton
                  url={shareUrl}
                  title={title}
                  windowWidth={660}
                  windowHeight={460}>
                  <TumblrIcon size={32} round />
                </TumblrShareButton>
              </SocialMediaBtn>
            </SocialMediaNetworks>
          </SocialMedia>
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
    )
  }
}
