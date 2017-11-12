'use strict';

import React                    from 'react';
import { Link, animateScroll }  from 'react-scroll';
import SideNav                  from 'react-simple-sidenav';
import { Icon, Navbar, NavItem }from 'react-materialize';
import _                        from 'lodash';
import assets                   from 'utils/assets';

export default class HeaderBar extends React.Component {
    constructor(props){
        super(props)
        this.state = { scroll: animateScroll, showNav: false };

        this.scrollTo = this.scrollTo.bind(this);
    }

    scrollTo(place) {
        this.state.scroll.scrollTo(place);
    }

    render() {
        const { showNav } = this.state;
        const links = [
            <NavItem className="nav-bar-item call-btn" href="tel:208-589-7436" divider> Call </NavItem>,
            <NavItem className="nav-bar-item nav-btn" divider><Link to="navigation" spy={true} smooth={true} offset={50} duration={500}> Navigation </Link></NavItem>,
            <NavItem className="nav-bar-item email-btn" divider><Link to="email" spy={true} smooth={true} offset={50} duration={500}> Email </Link></NavItem>
        ]

        return (
            <Navbar className="navbar-fixed" brand={<img className="logo-image" src={assets('./images/full_logo.png')} alt="" />} right options={links}>
                { links }
            </Navbar>
        );
    }
}
