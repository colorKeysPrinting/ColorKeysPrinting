import React                    from 'react';
import { connect }              from 'react-redux';
import { Link }                 from 'react-router';
import _                        from 'lodash';
import assets                   from '../../libs/assets';

import Tabs                     from './tabs';
import * as HeaderActions       from '../../actions/header';
import { showOverlay }          from '../../actions/application';

let select = (state)=>{
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
                height: '85px',
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
                border: '1px solid #C0C0C0',
                borderRadius: '10px',
                color: 'rgb(47, 205, 237)',
                cursor: 'pointer',
                outline: 'none',
                padding: '11px',
                textDecoration: 'none',
            },
            sibiLogo: {
                width: '160px',
                cursor: 'pointer'
            }
        };

        if(!this.props.activeUser.get('type') || this.props.activeUser.get('type') === 'signUp') {
            loginSection = <div style={styles.loginSection}>
                <div onClick={ ()=>this.props.showOverlay('login') } style={styles.login}>Login</div>
                <Link to={`/signup`} style={styles.signUp} onClick={()=>this.props.signUpPage()}>Sign Up</Link>
            </div>;

        } else {
            loginSection = <div style={styles.profileSection}>
                <div /*onHover={ ()=>{console.log('profileDropdown')}}*/><image src={''} alt="profilePicture"/>picture</div>
                <div onClick={ ()=>{console.log('TODO: activate search window')}}><image src={''} alt="search"/>search</div>
                <Link to={`/truck`}><image src={''} alt="truck"/>truck</Link>
            </div>;
        }

        // let searchSection = (this.state.isSearch) ? <input type="text" onChange={ (e)=>{this.search()} } /> : <image src={''} alt="search" onClick={(e)=>{ this.setState(isSearch, true)}}/>

        return (
            <div id="header-bar" style={styles.header}>
                <Link to={`/`} onClick={ (e)=>{ this.props.activateTab('products')}} ><img src={sibiLogo} alt="sibi logo" style={styles.sibiLogo}/></Link>
                <Tabs type={ this.props.activeUser.get('type') }
                      activeTab={ this.props.activeTab }
                      activateTab={ this.props.activateTab }/>
                { loginSection }
            </div>
        );
    }
}