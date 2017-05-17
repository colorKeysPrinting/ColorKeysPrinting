import React                    from 'react';
import { connect }              from 'react-redux';
import _                        from 'lodash';

import Tabs                     from './tabs';
import * as HeaderActions       from '../../actions/header';
import { showOverlay }          from '../../actions/application';
import assets                   from '../../libs/assets';

let select = (state, props)=>{
    return {
        activeUser      : state.application.get('activeUser'),
        activeTab       : state.application.get('activeTab')
    };
};

@connect(select, {...HeaderActions, showOverlay}, null, {withRef: true})
export default class HeaderBar extends React.Component {

    constructor(props) {
        super(props);

        this.state = {isSearch: false};
        this.search = this.search.bind(this);
    }

    search(term) {
        console.log(term);
        this.props.search(term);
    }

    render() {
        const sibiLogo = assets('./images/blue_sibi_logo.png');
        let loginSection;

        let styles = {
            header: {
                position: 'absolute',
                top: '0px',
                left: '10px',
                height: '50px',
                width: '97%',
                margin: '0 5px',
                display: 'inline-flex',
                background: '#FFF',
                boxShadow: '0px 2px 7px 0px rgba(50, 50, 50, 0.4)'
            },
            loginSection: {
                display: 'inline-flex',
                margin: '7px'
            },
            profileSection: {
                display: 'inline-flex'
            },
            login: {
                padding: '11px',
                cursor: 'pointer'
            },
            signUp: {
                padding: '11px',
                color: 'rgb(47, 205, 237)',
                border: '1px solid #C0C0C0',
                borderRadius: '10px',
                cursor: 'pointer'
            },
            sibiLogo: {
                width: '160px',
                cursor: 'pointer'
            }
        };

        if(!this.props.activeUser.get('type')) {
            loginSection = <div style={styles.loginSection}>
                <div onClick={ ()=>this.props.showOverlay('Login') } style={styles.login}>Login</div>
                <div onClick={ ()=>this.props.showPage('signUp') } style={styles.signUp}>Sign Up</div>
            </div>;
        } else {
            loginSection = <div style={styles.profileSection}>
                <div /*onHover={ ()=>{console.log('profileDropdown')}}*/><image src={''} alt="profilePicture"/>picture</div>
                <div onClick={ ()=>{console.log('searching...')}}><image src={''} alt="search"/>search</div>
                <div onClick={ ()=>this.props.showPage('truck')}><image src={''} alt="truck"/>truck</div>
            </div>;
        }

        // let searchSection = (this.state.isSearch) ? <input type="text" onChange={ (e)=>{this.search()} } /> : <image src={''} alt="search" onClick={(e)=>{ this.setState(isSearch, true)}}/>

        return (
            <div id="header-bar" style={styles.header}>
                <img src={sibiLogo} alt="sibi logo" onClick={ ()=>this.props.goHome() } style={styles.sibiLogo}/>
                <Tabs type={ this.props.activeUser.get('type') }
                      activeTab={ this.props.activeTab }
                      showPage={ this.props.showPage }/>
                { loginSection }
            </div>
        );
    }
}