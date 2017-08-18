import React                    from 'react';
import { connect }              from 'react-redux';
import { Link }                 from 'react-router-dom';
import assets                   from 'libs/assets';

import { logout }               from 'ducks/active_user/actions';
import { changeLanguage }       from 'ducks/ui/actions';

import Overlay                  from 'components/overlay';

class ProfileOverlay extends React.Component {

    render() {
        const styles = {
            container: {
                position: 'absolute',
                top: '67px',
                right: '10px',
                backgroundColor: 'rgb(255, 255, 255)',
                borderRadius: '5px',
                boxShadow: 'rgba(50, 50, 50, 0.4) 0px 2px 7px 0px',
                width: '250px',
                zIndex: '999',
                textAlign: 'left',
                fontSize: '20px',
                display: 'grid',
            },
            element: {
                padding: '10px',
                cursor: 'pointer',
    
                logout: {
                    padding: '10px',
                    cursor: 'pointer',
                }
            },
            profilePic: {
                borderRadius: '70px',
                margin: '20px',
            },
            username: {
                fontSize: '24px',
                marginTop: '30px'
            }
        };
    
        const profilePic = (this.props.activeUser.profilePic) ? assets(this.props.activeUser.profilePic) : assets('./images/icons-account.png');
    
        // <div><img src={profilePic} alt={this.props.username} height="70px" width="70px" style={styles.profilePic} /></div>
        // <Link to={`/settings`} style={styles.element} >Settings</Link>
        // <Link to={`/support`} style={styles.element} >Support</Link>
        // <div onClick={() => this.props.changeLanguage('english')} style={styles.element} >English / Espanol</div>
        return (
            <Overlay type="profile">
                <div style={styles.container}>
                    <div className="arrow-up"></div>
                    <div onClick={() => this.props.logout(this.props.activeUser.username)} style={styles.element.logout} >Log out </div>
                </div>
            </Overlay>
        );
    }
}

const select = (state) => ({
    activeUser  : state.activeUser.get('activeUser')
});

const actions = {
    logout,
    changeLanguage
};

export default connect(select, actions, null, { withRef: true })(ProfileOverlay);
