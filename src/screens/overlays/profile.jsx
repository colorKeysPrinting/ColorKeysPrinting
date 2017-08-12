import React                    from 'react';
import { connect }              from 'react-redux';
import { Link }                 from 'react-router-dom';
import assets                   from 'libs/assets';

import { logout }               from 'actions/header';
import { changeLanguage }       from 'actions/application';

import Overlay                  from 'components/overlay';

class ProfileOverlay extends React.Component {

    render() {
        const styles = {
            container: {
                position: 'absolute',
                top: '80px',
                left: '80%',
                backgroundColor: 'rgb(255, 255, 255)',
                borderRadius: '5px',
                border: '1px solid rgba(50, 50, 50, 0.4)',
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
                    borderTop: '1px solid rgba(50, 50, 50, 0.4)',
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
    
        const profilePic = (this.props.activeUser.profilePic) ? assets(this.props.activeUser.profilePic) : '';
    
        return (
            <Overlay type="profile">
                <div style={styles.container}>
                    <div style={{ display: 'inline-flex' }}>
                        <div><img src={profilePic} alt={this.props.username} height="70px" width="70px" style={styles.profilePic} /></div>
                        <div style={styles.username}>{this.props.username}</div>
                    </div>
                    <Link to={`/settings`} style={styles.element} >Settings</Link>
                    <Link to={`/support`} style={styles.element} >Support</Link>
                    <div onClick={() => this.props.changeLanguage('english')} style={styles.element} >English / Espanol</div>
                    <div onClick={() => this.props.logout(this.props.activeUser.username)} style={styles.element.logout} >Log out </div>
                </div>
            </Overlay>
        );
    }
}

const select = (state) => ({
    activeUser  : state.application.get('activeUser')
});

const actions = {
    logout,
    changeLanguage
};

export default connect(select, actions, null, { withRef: true })(ProfileOverlay);
