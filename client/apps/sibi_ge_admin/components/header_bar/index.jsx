import React                    from 'react';
import { connect }              from 'react-redux';
import { browserHistory, Link } from 'react-router';
import _                        from 'lodash';
import { withCookies }          from 'react-cookie';
import assets                   from '../../libs/assets';

import * as HeaderActions       from '../../actions/header';
import { showOverlay }          from '../../actions/application';

import Tabs                     from './tabs';

class HeaderBar extends React.Component {

    constructor(props) {
        super(props);

        this.state = { isSearch: false };
        this.search = this.search.bind(this);
    }

    componentWillMount() {
        const { cookies } = this.props;
        const jwt = cookies.get('sibi-admin-jwt');

        if (jwt) {
            this.props.getCurrentUser(jwt.token);
        } else {
            console.log('TODO: trigger logout function *** no JWT ***');
        }
    }

    componentWillUpdate(nextProps) {
        if (nextProps.activeUser) {
            const path = (nextProps.activeUser.size > 0) ? `/products` : `/`;
            browserHistory.push(path);
        }

        if (nextProps.isLogout) {
            this.props.logout();
        }
    }

    search(term) {
        console.log(term);
        this.props.search(term);
    }

    render() {
        let loginSection;

        const styles = {
            header: {
                height: '85px',
                width: '95%',
                margin: '0 auto',
                display: 'inline-flex',
                background: '#2D324C',
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
            sibiLogo: {
                width: '273px',
                cursor: 'pointer'
            }
        };

        const activeUser = this.props.activeUser.toJS();

        if (!activeUser.type || activeUser.type === 'signUp') {
            loginSection = (<div style={styles.loginSection}>
                <div className="submit-btn" onClick={() => this.props.showOverlay('login')} >Login</div>
            </div>);

        } else {
            const profilePic = (activeUser.profilePic) ? assets(activeUser.profilePic) : '';

            loginSection = (<div style={styles.profileSection}>
                <div onClick={() => this.props.showOverlay('profile')}><img src={profilePic} alt="profilePicture" width="40px" height="40px" style={styles.profileSection.profilePic} /></div>
                <div onClick={() => { console.log('TODO: activate search window') }}><img src={assets('./images/icons-search-large.png')} alt="search" width="25px" height="25px" style={styles.profileSection.search} /></div>
                <Link to={`/truck`}><img src={assets('./images/icons-truck.png')} alt="truck" height="25px" style={styles.profileSection.truck} /></Link>
            </div>);
        }

        // let searchSection = (this.state.isSearch) ? <input type="text" onChange={ (e)=>{this.search()} } /> : <img src={''} alt="search" onClick={(e)=>{ this.setState(isSearch, true)}}/>
        const to = (activeUser.type && activeUser.type !== 'signUp') ? `/orders` : `/`;
        return (
            <div id="header-bar" style={styles.header}>
                <Tabs
                    type={activeUser.type}
                    activeTab={this.props.activeTab}
                    setActivateTab={this.props.setActivateTab}
                />
                { loginSection }
            </div>
        );
    }
}

const select = (state) => ({
    isLogout        : state.jwt.isLogout,
    activeUser      : state.application.get('activeUser'),
    activeTab       : state.application.get('activeTab')
});

export default connect(select, { ...HeaderActions, showOverlay }, null, { withRef: true })(withCookies(HeaderBar));