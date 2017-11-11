'use strict';

import React                    from 'react';
import Scroll                   from 'react-scroll';
import SideNav                  from 'react-simple-sidenav';
import _                        from 'lodash';
import assets                   from 'utils/assets';

// This is for the react-scroll to work correctly
const Link = Scroll.Link;

export default class Navbar extends React.Component {
    constructor(props){
        super(props)
        const scroll = Scroll.animateScroll;
        const Link   = Scroll.Link;
        const items = [
            <a className='navItem'
                href="tel:208-589-7436"
                onClick={()=>{this.closeNav()}}
                style={{backgroundColor: '#00acf6'}}>
                <i className="material-icons navIcon">phone</i> Call
            </a>,
            <Link className='navItem' activeClass="active" to="navigation" spy={true} smooth={true} offset={50} duration={500}
                onClick={()=>{this.closeNav()}}
                style={{backgroundColor: '#ed0089'}}>
                <div className="navIcon"><i className="material-icons" style={{transform: 'rotate(50deg)'}}>navigation</i></div> Navigation
            </Link>,
            <Link className='navItem' activeClass="active" to="email" spy={true} smooth={true} offset={50} duration={500}
                onClick={()=>{this.closeNav()}}
                style={{backgroundColor: '#fef400'}}>
                <i className="material-icons navIcon">email</i> Email
            </Link>
        ]

        this.state = { scroll, Link, items, showNav: false};

        this.scrollTo = this.scrollTo.bind(this);
        this.openNav = this.openNav.bind(this);
        this.closeNav = this.closeNav.bind(this);
    }

    scrollTo(place) {
        this.state.scroll.scrollTo(place);
    }

    openNav(){
        this.setState({showNav: true});
    }

    closeNav(){
        this.setState({showNav: false});
    }

    render(){
        return (
            <div className="navbar-fixed" style={{ top:'0', position:'absolute' }}>
                <nav className="black" role="navigation">
                    <div className="nav-wrapper container">
                        <a id="logo-container" href="#" className="brand-logo"><img src={"\." + assets('./images/full_logo.png')} alt="Unsplashed background img 1" style={{height: '55px'}}/></a>
                        <ul className="right hide-on-med-and-down">
                            <li><a className='topNavItem' href="tel:208-589-7436" style={{backgroundColor: '#00acf6'}}> Call </a></li>
                            <li><Link className='topNavItem' activeClass="active" to="navigation" spy={true} smooth={true} offset={50} duration={500} style={{backgroundColor: '#ed0089'}}> Navigation </Link></li>
                            <li><Link className='topNavItem' activeClass="active" to="email" spy={true} smooth={true} offset={50} duration={500} style={{backgroundColor: '#fef400'}}> Email </Link></li>
                        </ul>
                    </div>

                    <a data-activates="nav-mobile"
                        className="button-collapse"
                        style={{position: 'absolute', top: '0', left: '15px'}}
                        onClick={(e)=>{e.preventDefault(); this.openNav();}}>
                        <i className="material-icons">menu</i>
                    </a>

                    <SideNav
                        showNav={ this.state.showNav }
                        onHideNav={ ()=>{this.setState({showNav: false});} }
                        title={<div style={{background: '#000'}}><img src={"\." + assets('./images/full_logo.png')} alt="Unsplashed background img 1"/></div>}
                        titleStyle={{ backgroundColor: '#000' }}
                        itemStyle={{ width: '100%', padding: '0px' }}
                        items={this.state.items}
                    />
                </nav>
                <br/>
            </div>
        );
    }
}
