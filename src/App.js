import React, { Component }       from 'react'
import PropTypes                  from 'prop-types'
import { Parallax }               from 'react-parallax'
import _                          from 'lodash'
import { Grid, Card, Paper, CardContent, Fab } from '@material-ui/core'
import { withStyles }             from '@material-ui/core/styles'
import { Navigation }             from '@material-ui/icons'
import assets                     from './utils/assets'
import { Html, CardIcon, Li, BodyScroll } from './styles/common'
import { LOGO_BLUE, LOGO_YELLOW } from './styles/colors'

import withRoot           from './withRoot'

import HeaderBar          from './components/header_bar'
import ContactUs          from './components/contact_us'
import GoogleMapComponent from './components/google_maps'
import Footerbar          from './components/footer_bar'

const styles = theme => ({
  root: {
    flexGrow: 1,
    margin: '10px'
  },
  fab: {
    margin: theme.spacing.unit,
    position: 'absolute',
    top: theme.spacing.unit * 2,
    left: theme.spacing.unit * 2,
    zIndex: '9999',
    backgroundColor: LOGO_BLUE,
    color: '#FFF',
  },
  extendedIcon: {
    marginRight: theme.spacing.unit,
  },
  card: {
    textAlign: 'center',
    fontSize: '20px'
  },
  sectionTitle: {
    backgroundColor: LOGO_YELLOW,
    textAlign: 'center',
    margin: '20px 0',
    fontSize: '24px',
    padding: '10px',
    fontWeight: 'bold'
  }
})

class Home extends Component {
  state = {
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
  }

  detectMobile = () => {
    return navigator.userAgent.match(/Android/i) ||
      navigator.userAgent.match(/webOS/i) ||
      navigator.userAgent.match(/iPhone/i) ||
      navigator.userAgent.match(/iPad/i) ||
      navigator.userAgent.match(/iPod/i) ||
      navigator.userAgent.match(/BlackBerry/i) ||
      navigator.userAgent.match(/Windows Phone/i)
  }

  getDirections = e => {
    e.preventDefault()
    const { location } = this.state

    if (this.detectMobile) {
      navigator.userAgent.match(/iPhone/i) ||
      navigator.userAgent.match(/iPad/i) ||
      navigator.userAgent.match(/iPod/i)
        ? window.open(`https://maps.google.com/maps?daddr=${location.addr}&amp&z=17ll=`)
        : window.open(`maps://maps.google.com/maps?daddr=${location.addr}&amp&z=17ll=`)
    } else {
      window.open(`https://maps.google.com/maps?daddr=${location.addr}&amp&z=17ll=`)
    }
  }

  render() {
    const { classes } = this.props
    const { products, location } = this.state

    return (
      <Html>
        <HeaderBar />
        <Parallax
          blur={5}
          bgImage={assets('./images/paint_splatter_large_1920_1080.jpg')}
          bgImageAlt="Unsplashed background img 2"
          strength={500}
        >
          <BodyScroll height={`${window.innerHeight - 75}px`}>
            {/* <div id="index-banner" className="parallax-container" style={{ height: (window.innerWidth > 1200) ? '500px': '210px', width: (window.innerWidth > 1200) ? '75%': '100%' , margin: '0 auto' }}>
                <img src={assets('./images/Christmas_offer.png')} alt="" style={{ position: 'absolute', top: '25px', width: '100%', backgroundColor: '#FFF' }}/>
            </div> */}

            <div className={classes.root} >
              <Grid container spacing={24}>
                <Grid item xs={12} sm={6}>
                  <Card
                    raised
                    className={classes.card}
                  >
                    <CardContent>
                      <p>
                        We specialize in producing high quality products with a personal touch to
                        ensure the final product has the best presentation. We offer small quantity
                        full color and black and white printing from business cards to posters and
                        anything in between!
                      </p>
                      <p>
                        You don't need to order thousands to get a great price, and everything is
                        printed in-house so you are not waiting weeks for your product.
                      </p>
                      <p>
                        Our creative team will work with you on your project from start to finish to
                        ensure you get a quality final product. With over 20 years of experience and
                        knowledge we are confident we can help with your project. You can also send
                        us your designs to have printed. Give us a call today to see how we can help
                        with your printing needs.
                      </p>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Paper
                    style={{
                      backgroundColor: '#000'
                    }}
                  >
                    <img
                      src={assets('./images/products.jpeg')}
                      alt=""
                      width="100%"
                      height="100%"
                    />
                  </Paper>
                </Grid>
              </Grid>
            </div>

            <div className={classes.root} >
              <Paper className={classes.sectionTitle}>
                Products
              </Paper>
              <Grid container direction="row" spacing={16}>
                {_.map(products, (product, key) => (
                  <Grid key={`element${key}`} item xs={12} sm={3}>
                    <Card className={classes.card}>
                      <CardContent>
                        <CardIcon src={assets('./images/logo.png')} alt="" />
                        <h5>{key}</h5>
                        <ul>
                          {product.map((product, key) => (
                            <Li key={`product${key}`}>
                              {product}
                            </Li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </div>

            <ContactUs isMobile={this.detectMobile} />

            <div className={classes.root} >
              <Grid container spacing={24}>
                <Grid item xs={12}>
                  <Paper
                    style={{
                      backgroundColor: '#000',
                      position: 'relative',
                      height: this.detectMobile ? '300px' : '450px'
                    }}
                  >
                    <Fab
                      variant="extended"
                      aria-label="directions"
                      className={classes.fab}
                      name="directions"
                      onClick={this.getDirections}
                    >
                      <Navigation className={classes.extendedIcon} />
                      Get Directions
                    </Fab>
                    <GoogleMapComponent
                      isMobile={this.detectMobile}
                      googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${
                        process.env.REACT_APP_GOOGLE_API_KEY
                      }&v=3.exp&libraries=geometry,drawing,places`}
                      loadingElement={<div style={{ width: '100%', height: '100%' }} />}
                      containerElement={<div style={{ width: '100%', height: '100%' }} />}
                      mapElement={<div style={{ width: '100%', height: '100%' }} />}
                      location={location}
                      isMarkerShown
                    />
                  </Paper>
                </Grid>
              </Grid>
            </div>

            <Footerbar />
          </BodyScroll>
        </Parallax>
      </Html>
    )
  }
}

Home.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withRoot(withStyles(styles)(Home))