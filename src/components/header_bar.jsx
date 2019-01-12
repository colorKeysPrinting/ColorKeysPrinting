import React, { Component }     from 'react'
import PropTypes                from 'prop-types'
import { Link, animateScroll }  from 'react-scroll'
import SideNav                  from 'react-simple-sidenav'
import { AppBar, Toolbar, Button, IconButton } from '@material-ui/core'
import { Menu }                 from '@material-ui/icons'
import { withStyles }           from '@material-ui/core/styles'
import _                        from 'lodash'
import assets                   from '../utils/assets'
import { SideNavTitle, LogoImg, MenuButton, NavButtons } from '../styles/common'
import { LOGO_BLUE, LOGO_RED, LOGO_YELLOW } from '../styles/colors'

const styles = {
  root: {
    flexGrow: 1,
  },
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    lineHeight: '2',
    height: '40px',
    width: '115px',
    color: '#000'
  },
}

class HeaderBar extends Component {
  state = { scroll: animateScroll, showNav: false }

  scrollTo = place => {
    this.state.scroll.scrollTo(place)
  }

  toggleSideNav = key => () => {
    this.setState(prevState => {
      const value = !prevState[key]
      return { [key]: value }
    })
  }

  render() {
    const { classes } = this.props
    const { showNav } = this.state
    const links = {
      [`${LOGO_BLUE}`]: {
        href: 'tel:208-589-7436',
        element: 'Call'
      },
      [`${LOGO_RED}`]: {
        element: <Link className={classes.menuButton} to="navigation" spy={true} smooth={true} offset={50} duration={500}>
          Navigation
        </Link>
      },
      [`${LOGO_YELLOW}`]: {
        element: <Link className={classes.menuButton} to="email" spy={true} smooth={true} offset={50} duration={500}>
          Contact
        </Link>
      }
    }
    let linkArray = []

    return (
      <div className={classes.root}>
        <AppBar position="static" style={{ backgroundColor: '#000' }}>
          <Toolbar>
            <MenuButton>
              <IconButton color="inherit" aria-label="Menu" onClick={this.toggleSideNav('showNav')}>
                <Menu />
              </IconButton>
            </MenuButton>
            <div className={classes.grow}>
              <Button
                varient="flat"
                href="#!"
              >
                <LogoImg
                  src={assets('./images/full_logo.png')}
                  alt=""
                  style={{ marginLeft: window.innerWidth > 1000 ? '45px' : '' }}
                />
              </Button>
            </div>
            <NavButtons>
              {_.map(links, (item, key) => {
                linkArray.push(
                  <Button
                    key={key}
                    varient="flat"
                    href={item.href ? item.href : null}
                    className={classes.menuButton}
                    style={{ backgroundColor: key }}
                    fullWidth
                  >
                    {item.element}
                  </Button>
                )
                return (
                  <Button
                    key={key}
                    varient="flat"
                    href={item.href ? item.href : null}
                    className={classes.menuButton}
                    style={{ margin: '0 2px', backgroundColor: key }}
                  >
                    {item.element}
                  </Button>
                )
              })}
            </NavButtons>
          </Toolbar>
          <SideNav
            id="mobile-demo"
            showNav={showNav}
            onHideNav={this.toggleSideNav('showNav')}
            title={
              <SideNavTitle>
                <img src={assets('./images/full_logo.png')} alt="" />
              </SideNavTitle>
            }
            items={linkArray}
          />
        </AppBar>
      </div>
    )
  }
}

HeaderBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(HeaderBar);