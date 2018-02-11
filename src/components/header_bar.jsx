import React from 'react';
import { Link, animateScroll } from 'react-scroll';
import SideNav from 'react-simple-sidenav';
import { Icon } from 'react-materialize';
import _ from 'lodash';
import assets from 'utils/assets';

export default class HeaderBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = { scroll: animateScroll, showNav: false };

    this.scrollTo = this.scrollTo.bind(this);
  }

  scrollTo(place) {
    this.state.scroll.scrollTo(place);
  }

  render() {
    const { showNav } = this.state;
    const links = {
      'call-btn': <a href="tel:208-589-7436"> Call </a>,
      'nav-btn': (
        <Link to="navigation" spy={true} smooth={true} offset={50} duration={500}>
          {' '}
          Navigation{' '}
        </Link>
      ),
      'email-btn': (
        <Link to="email" spy={true} smooth={true} offset={50} duration={500}>
          {' '}
          Contact{' '}
        </Link>
      ),
    };
    let linkArray = [];

    return (
      <nav className="navbar-fixed">
        <div className="nav-wrapper">
          <a href="#!" className="brand-logo">
            <img
              className="logo-image"
              src={assets('./images/full_logo.png')}
              alt=""
              style={{ marginLeft: window.innerWidth > 1000 ? '45px' : '' }}
            />
          </a>
          <div
            data-activates="mobile-demo"
            className="button-collapse"
            onClick={() => this.setState({ showNav: showNav ? false : true })}>
            <Icon className="material-icons">menu</Icon>
          </div>
          <ul className="right hide-on-med-and-down">
            {_.map(links, (link, key) => {
              linkArray.push(
                <div>
                  <li key={key} className={`side-nav-item waves-effect ${key}`}>
                    {link}
                  </li>
                </div>
              );
              return (
                <li key={key} className={`nav-bar-item waves-effect ${key}`}>
                  {link}
                </li>
              );
            })}
          </ul>
          <SideNav
            id="mobile-demo"
            className="side-nav"
            showNav={showNav}
            onHideNav={() => this.setState({ showNav: false })}
            title={
              <div className="side-nav-title">
                <img src={assets('./images/full_logo.png')} alt="" />
              </div>
            }
            items={linkArray}
          />
        </div>
      </nav>
    );
  }
}
