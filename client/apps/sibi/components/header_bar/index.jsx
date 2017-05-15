import React                    from 'react';
import { connect }              from 'react-redux';
import _                        from 'lodash';

import Tabs                     from './tabs';
import * as HeaderActions       from '../../actions/header';
import assets                 	from '../../libs/assets';

let select = (state)=>{
    return {
        activeUser: state.application['activeUser'],
        activeTab:  state.application['activeTab']
    };
};

@connect(select, HeaderActions, null, {withRef: true})
export default class HeaderBar extends React.Component {

    constructor(props) {
        super(props);

        this.show = this.show.bind(this);
    }

    show(type) {
        console.log(type);
        this.props.showPage((type).toUpperCase());
    }

    render() {
        let loginSection = "";
        const sibiImg = assets('./images/sibi.png');

        let styles = {
            header: {
                height: '30px',
                background: '#FFF',
                display: 'inline-block',
                width: '970px'
            },
            login: {

            },
            signUp: {

            },
            image: {
                height: '40px',
                width: '60px'
            }
        };

        if(!this.props.activeUser.type) {
            loginSection =  <div>
                <div onClick={ ()=>this.props.login('foo','bar') }>Login</div>
                <div onClick={ ()=>this.props.signUp() }>Sign Up</div>
            </div>;
        }

        return (
            <div style={styles.header}>
                <div onClick={ ()=>this.props.goHome() } style={ styles.image }><image src={sibiImg} alt="sibi" /></div>
                <Tabs type={ this.props.activeUser.type }
                      activeTab={ this.props.activeTab }
                      show={ this.show }/>
                { loginSection }
            </div>
        );
    }
}