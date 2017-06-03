import React                    from 'react';
import { Link }                 from 'react-router';
import assets                   from '../../libs/assets';

export default function ProfileOverlay(props) {

    let styles = {
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

    return (
        <div style={styles.container}>
            <div style={{display: 'inline-flex'}}>
                <div><img src={assets(props.profilePic)} alt={props.username} height="70px" width="70px" style={styles.profilePic} /></div>
                <div style={styles.username}>{props.username}</div>
            </div>
            <Link to={`/settings`} style={styles.element} >Settings</Link>
            <Link to={`/support`} style={styles.element} >Support</Link>
            <div onClick={()=>props.changeLanguage('english')} style={styles.element} >English / Espanol</div>
            <div onClick={()=>props.logout(props.username)} style={styles.element.logout} >Log out </div>
        </div>
    );
}
