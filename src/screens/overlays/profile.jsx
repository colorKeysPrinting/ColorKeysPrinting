import React                    from 'react';
import { connect }              from 'react-redux';
import { Link }                 from 'react-router-dom';
import assets                   from 'libs/assets';

import { logout }               from 'ducks/active_user/actions';
import { changeLanguage }       from 'ducks/ui/actions';

import Overlay                  from 'components/overlay';

class ProfileOverlay extends React.Component {

    render() {




        // <div><img src={profilePic} alt={this.props.username} height="70px" width="70px" style={styles.profilePic} /></div>
        // <Link to={`/settings`} style={styles.element} >Settings</Link>
        // <Link to={`/support`} style={styles.element} >Support</Link>
        // <div onClick={() => this.props.changeLanguage('english')} style={styles.element} >English / Espanol</div>
        return (
            <Overlay type="profile">

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
