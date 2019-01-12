import React, { Component } from 'react'
import PropTypes            from 'prop-types'
import { Element }          from 'react-scroll'
import { Paper, Grid, Card, CardContent } from '@material-ui/core'
import { withStyles }       from '@material-ui/core/styles'
import { FacebookIcon, TwitterIcon, GooglePlusIcon } from 'react-share'
import { LOGO_YELLOW }      from '../styles/colors'

import { Header, CardFont, SocialMedia, SocialMediaBtn, Li } from '../styles/common'

const styles = theme => ({
  root: {
    flexGrow: 1,
    margin: '10px'
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

class ContactUs extends Component {
  constructor(props) {
    super(props)
    this.state = { isMobile: this.props.isMobile }
  }

  componentWillMount() {
    this.setState({
      name: this.refs['name'],
      email: this.refs['email'],
      message: this.refs['message'],
    })
  }

  sendEmail = () => {
    const subject = 'Color Keys Printing Website'
    let body = 'Hello my name is ' + this.refs['name'].value + '\n\n'
    body += this.refs['message'].value
    body += '\n\nMy email is: ' + this.refs['email'].value + '\n\n'
    body += 'Thank you !\n\n I hope to hear from you soon\n\n' + this.refs['name'].value

    let uri = 'mailto:colorkeys13@gmail.com?subject='
    uri += encodeURIComponent(subject)
    uri += '&body='
    uri += encodeURIComponent(body)
    window.window.location.href = uri
  }

  render() {
    const { classes } = this.props
    const email = 'colorkeys13@gmail.com'

    // const emailCard = (
    //   <Card className="large blue-grey lighten-5" title="Drop us a line!">
    //     <div className="card-content">
    //       <form
    //         onSubmit={e => {
    //           e.preventDefault()
    //           this.sendEmail()
    //         }}>
    //         <div className="row">
    //           <div className="input-field col s12">
    //             <input ref="name" id="first_name" type="text" className="validate" required />
    //             <label htmlFor="first_name">Name</label>
    //           </div>
    //         </div>

    //         <div className="row">
    //           <div className="input-field col s12">
    //             <input ref="email" id="email" type="email" className="validate" required />
    //             <label htmlFor="email">Email</label>
    //           </div>
    //         </div>

    //         <div className="row">
    //           <div className="input-field col s12">
    //             <textarea ref="message" id="textarea1" className="materialize-textarea" required />
    //             <label htmlFor="textarea1">Message</label>
    //           </div>
    //         </div>

    //         <button className="btn waves-effect waves-light" type="submit" name="action">
    //           Submit
    //           <i className="material-icons right">send</i>
    //         </button>
    //       </form>
    //     </div>
    //   </Card>
    // )

    return (
      <div className={classes.root} >
        <Element name="email">
          <Paper className={classes.sectionTitle}>
            Contact Us
          </Paper>
        </Element>
        <Grid container direction="row">
          <Grid item xs={12} >
            <Card className={classes.card}>
              <CardContent>
                <h2>Come see us in person!</h2>
                <CardFont>Set up an appointment so we can get started on the project in person!</CardFont>
                <h2>Color Keys Printing</h2>
                <CardFont>3342 E 113 N<br/>Idaho Falls, Idaho 83401<br/>United States</CardFont>
                <CardFont>
                  <a href="tel:208-589-7436"> 208-589-7436 </a> / 208-524-0456
                </CardFont>
                <CardFont>
                  <a href={`mailto:${email}`}>{email}</a>
                </CardFont>

                <Header>Hours</Header>
                <ul>
                  <Li>By Appointment</Li>
                  <Li>Monday - Thursday: 8:30am - 5pm</Li>
                  <Li>Friday: 8:30am - 12:00pm</Li>
                  <Li>Saturday: Closed</Li>
                  <Li>Sunday: Closed</Li>
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
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </div>
    )
  }
}

ContactUs.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(ContactUs)