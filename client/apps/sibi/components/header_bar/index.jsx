import React                    from 'react';
import { connect }              from 'react-redux';
import { Link }                 from 'react-router';
import _                        from 'lodash';
import assets                   from '../../libs/assets';

import * as HeaderActions       from '../../actions/header';
import { showOverlay }          from '../../actions/application';

import Tabs                     from './tabs';

let select = (state)=>{
    return {
        activeUserType  : state.application.getIn(['activeUser', 'type']),
        profilePic      : state.application.getIn(['activeUser', 'profilePic']),
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
                display: 'inline-flex',

                profilePic: {
                    borderRadius: '40px',
                    margin: '20px 10px',
                    cursor: 'pointer'
                },
                search: {
                    margin: '28px 10px',
                    cursor: 'pointer'
                },
                truck: {
                    margin: '28px 10px',
                    cursor: 'pointer'
                }
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
                <div onClick={()=>this.props.showOverlay('login') } style={styles.login}>Login</div>
                <Link to={`/signup`} style={styles.signUp} >Sign Up</Link>
            </div>;

        } else {
            let profilePic = (this.props.profilePic) ? assets(this.props.profilePic) : '';

            loginSection = <div style={styles.profileSection}>
                <div onClick={()=>this.props.showOverlay('profile')}><img src={profilePic} alt="profilePicture" width="40px" height="40px" style={styles.profileSection.profilePic}/></div>
                <div onClick={()=>{console.log('TODO: activate search window')}}><img src={assets('./images/icons-search-large.png')} alt="search" width="25px" height="25px" style={styles.profileSection.search}/></div>
                <Link to={`/truck`}><img src={assets('./images/icons-truck.png')} alt="truck" height="25px" style={styles.profileSection.truck}/></Link>
            </div>;
        }

        // let searchSection = (this.state.isSearch) ? <input type="text" onChange={ (e)=>{this.search()} } /> : <img src={''} alt="search" onClick={(e)=>{ this.setState(isSearch, true)}}/>
        let to = (this.props.activeUserType && this.props.activeUserType !== 'signUp') ? `/products` : `/`;

        return (
            <div id="header-bar" style={styles.header}>
                <Link to={to} onClick={ (e)=>this.props.setActivateTab('products')} ><img src={assets('./images/sibi_logo_white.png')} alt="sibi logo" style={styles.sibiLogo}/></Link>
                <Tabs type={ this.props.activeUserType }
                      activeTab={ this.props.activeTab }
                      setActivateTab={ this.props.setActivateTab } />
                { loginSection }
            </div>
        );
    }
}