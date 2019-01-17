import React, { Component }     from 'react'
import PropTypes                from 'prop-types'
import SideNav                  from 'react-simple-sidenav'
import { AppBar, Toolbar, Button, IconButton } from '@material-ui/core'
import { Menu }                 from '@material-ui/icons'
import { withStyles }           from '@material-ui/core/styles'
import _                        from 'lodash'
import assets                   from '../utils/assets'
import { SideNavTitle, LogoImg, MenuButton, NavButtons, SideNavLogo, SideNavBackground } from '../styles/common'
import { LOGO_BLUE, LOGO_RED, LOGO_YELLOW } from '../styles/colors'

const styles = {
  root: {
    flexGrow: 1,
  },
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    width: '115px',
    color: '#000'
  },
}

class HeaderBar extends Component {
  state = { showNav: false }

  toggleSideNav = key => () => {
    this.setState(prevState => {
      const value = !prevState[key]
      return { [key]: value }
    })
  }

  scrollTo = link => {
    this.setState({ showNav : false })
    this.props.scrollTo(link)
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
        href: 'navigation',
        onClick: this.scrollTo,
        element: 'Navigation'
      },
      [`${LOGO_YELLOW}`]: {
        href: 'contact',
        onClick: this.scrollTo,
        element: 'Contact'
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
              <Button varient="flat">
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
                    href={!item.onClick && item.href ? item.href : null}
                    onClick={item.onClick ? () => item.onClick(item.href) : null}
                    className={classes.menuButton}
                    style={{
                      backgroundColor: key,
                      width: '95%',
                      height: '80px',
                      fontSize: '24px',
                      margin: '10px',
                    }}
                  >
                    {item.element}
                  </Button>
                )
                return (
                  <Button
                    key={key}
                    varient="flat"
                    href={!item.onClick && item.href ? item.href : null}
                    onClick={item.onClick ? () => item.onClick(item.href) : null}
                    className={classes.menuButton}
                    style={{ margin: '0 2px', backgroundColor: key }}
                    size="large"
                    fullWidth
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
          >
            <SideNavBackground>
              <SideNavTitle>
                <SideNavLogo src={assets('./images/full_logo.png')} alt="" />
              </SideNavTitle>
              {linkArray}
            </SideNavBackground>
          </SideNav>
        </AppBar>
      </div>
    )
  }
}

HeaderBar.propTypes = {
  classes: PropTypes.object.isRequired,
  scrollTo: PropTypes.func.isRequired,
}

export default withStyles(styles)(HeaderBar)