import React                    from 'react';
import { connect }              from 'react-redux';
import { withRouter }           from 'react-router';
import { Link }                 from 'react-router-dom';
import _                        from 'lodash';
import { withCookies }          from 'react-cookie';
import assets                   from 'libs/assets';

import { getCurrentUser }       from 'ducks/active_user/actions';

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
            // const path = (nextProps.activeUser.size > 0) ? `/orders` : `/`;
            // this.props.history.push(path);
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

        const activeUser = this.props.activeUser.toJS();
        const sibiLogo = assets('./images/SIBI_Logo.png');

        if (!activeUser.type || activeUser.type === 'signUp') {
            loginSection = <Link to={`/login`} className="btn submit-btn" >Login</Link>;

        } else {
            loginSection = <Link to={{ pathname: `/profile`, state: { prevPath: this.props.location.pathname }}} >
                <img className="settings-icon" src={assets('./images/icon-settings.svg')} alt="settingsButtons" width="40px" height="40px" className="profile-pic" />
            </Link>;
        }

        // let searchSection = (this.state.isSearch) ? <input type="text" onChange={ (e)=>{this.search()} } /> : <img src={''} alt="search" onClick={(e)=>{ this.setState(isSearch, true)}}/>
        // const to = (activeUser.type && activeUser.type !== 'signUp') ? `/orders` : `/`;
        return (
            <div id="header-bar">
                <img src={sibiLogo} id="logo"/>
                <Tabs
                    type={activeUser.type}
                    activeTab={this.props.activeTab}
                />
                <div className="login-section">
                    { loginSection }
                </div>
            </div>
        );
    }
}

const select = (state) => ({
    isLogout        : state.jwt.get('isLogout'),
    activeUser      : state.activeUser.get('activeUser'),
    activeTab       : state.header.get('activeTab')
});

export default connect(select, { getCurrentUser }, null, { withRef: true })(withRouter(withCookies(HeaderBar)));
