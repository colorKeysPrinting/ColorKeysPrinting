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
        activeUserType  : state.application.getIn(['activeUser', 'type']),
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

    componentWillReceiveProps(nextProps) {
    }

    search(term) {
        console.log(term);
        this.props.search(term);
    }

    render() {
        const sibiLogo = assets('./images/sibi_logo_white.png');
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
                margin: '20px'
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
                height: '42px'
            },
            sibiLogo: {
                width: '273px',
                cursor: 'pointer'
            }
        };

        if(!this.props.activeUserType || this.props.activeUserType === 'signUp') {
            loginSection = <div style={styles.loginSection}>
                <div onClick={ ()=>this.props.showOverlay('login') } style={styles.login}>Login</div>
                <Link to={`/signup`} style={styles.signUp} >Sign Up</Link>
            </div>;

        } else {
            loginSection = <div style={styles.profileSection}>
                <div /*onHover={ ()=>{console.log('profileDropdown')}}*/><image src={''} alt="profilePicture"/>picture</div>
                <div onClick={ ()=>{console.log('TODO: activate search window')}}><image src={''} alt="search"/>search</div>
                <Link to={`/truck`}><image src={''} alt="truck"/>truck</Link>
            </div>;
        }

        // let searchSection = (this.state.isSearch) ? <input type="text" onChange={ (e)=>{this.search()} } /> : <image src={''} alt="search" onClick={(e)=>{ this.setState(isSearch, true)}}/>
        let to = (this.props.activeUserType && this.props.activeUserType !== 'signUp') ? `/products` : `/`;

        return (
            <div id="header-bar" style={styles.header}>
                <Link to={to} onClick={ (e)=>{ this.props.setActivateTab('products')}} ><img src={sibiLogo} alt="sibi logo" style={styles.sibiLogo}/></Link>
                <Tabs type={ this.props.activeUserType }
                      activeTab={ this.props.activeTab }
                      setActivateTab={ this.props.setActivateTab } />
                { loginSection }
            </div>
        );
    }
}