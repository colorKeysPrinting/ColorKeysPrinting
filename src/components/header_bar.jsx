import React from 'react';
import { Link, animateScroll } from 'react-scroll';
import SideNav from 'react-simple-sidenav';
import { Icon } from 'react-materialize';
import _ from 'lodash';
import assets from 'utils/assets';
import {
  NavBar,
  NavBarItem,
  NavBarItemLink,
  SideNavTitle,
  SideNavItem,
  LogoImg,
  BrandLogo,
} from 'styles/common';
import { LOGO_BLUE, LOGO_RED, LOGO_YELLOW } from 'styles/colors';

export default class HeaderBar extends React.Component {
  state = { scroll: animateScroll, showNav: false };

  scrollTo = place => {
    this.state.scroll.scrollTo(place);
  };

  render() {
    const { showNav } = this.state;
    const links = {
      [`${LOGO_BLUE}`]: <a href="tel:208-589-7436"> Call </a>,
      [`${LOGO_RED}`]: (
        <Link to="navigation" spy={true} smooth={true} offset={50} duration={500}>
          {' '}
          Navigation{' '}
        </Link>
      ),
      [`${LOGO_YELLOW}`]: (
        <Link to="email" spy={true} smooth={true} offset={50} duration={500}>
          {' '}
          Contact{' '}
        </Link>
      ),
    };
    let linkArray = [];

    return (
      <NavBar>
        <div className="nav-wrapper">
          <BrandLogo href="#!">
            <LogoImg
              src={assets('./images/full_logo.png')}
              alt=""
              style={{ marginLeft: window.innerWidth > 1000 ? '45px' : '' }}
            />
          </BrandLogo>
          <div
            data-activates="mobile-demo"
            className="button-collapse"
            onClick={() => this.setState({ showNav: showNav ? false : true })}>
            <Icon className="material-icons">menu</Icon>
          </div>
          <ul className="right hide-on-med-and-down">
            {_.map(links, (link, key) => {
              linkArray.push(
                <SideNavItem key={key} color={key} className={'waves-effect'}>
                  {link}
                </SideNavItem>
              );
              return (
                <NavBarItem key={key} color={key} className={'waves-effect'}>
                  <NavBarItemLink>{link}</NavBarItemLink>
                </NavBarItem>
              );
            })}
          </ul>
          <SideNav
            id="mobile-demo"
            className="side-nav"
            showNav={showNav}
            onHideNav={() => this.setState({ showNav: false })}
            title={
              <SideNavTitle>
                <img src={assets('./images/full_logo.png')} alt="" />
              </SideNavTitle>
            }
            items={linkArray}
          />
        </div>
      </NavBar>
    );
  }
}
