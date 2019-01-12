import React, { Component } from 'react'
import PropTypes            from 'prop-types'
import { animateScroll }    from 'react-scroll'
import { AppBar, Toolbar, Button } from '@material-ui/core'
import { withStyles }       from '@material-ui/core/styles'
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

import { LOGO_BLUE } from '../styles/colors'
import { FooterHeading, SocialMedia, SocialMediaNetworks, SocialMediaBtn } from '../styles/common'

const styles = {
  root: {
    flexGrow: 1,
  },
  menuButton: {
    lineHeight: '2',
    height: '40px',
    width: '115px',
    color: '#FFF',
    backgroundColor: LOGO_BLUE,
  },
}

class FooterBar extends Component {
  state = { scroll: animateScroll }

  scrollToTop = () => {
    this.state.scroll.scrollToTop()
  }

  render() {
    const { classes } = this.props
    const shareUrl = 'https://www.colorkeysprinting.com/home'
    const title = 'Color Keys Printing'

    return (
      <div className={classes.root}>
        <div className={classes.root} style={{ textAlign: 'center' }}>
          <Button
            varient="flat"
            className={classes.menuButton}
            style={{ margin: 'auto', backgroundColor: LOGO_BLUE }}
            onClick={this.scrollToTop}
          >
            Back To Top
          </Button>
        </div>
        <AppBar position="static" style={{ backgroundColor: '#000' }}>
          <Toolbar>
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
          </Toolbar>
        </AppBar>
      </div>
    )
  }
}

FooterBar.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(FooterBar)
