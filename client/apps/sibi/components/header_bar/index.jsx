import React                    from 'react';
import { connect }              from 'react-redux';
import _                        from 'lodash';

import Tabs                     from './tabs';
import * as HeaderActions       from '../../actions/header';
import assets                 	from '../../libs/assets';

let select = (state, props)=>{
    return {
        activeUser      : state.application.get('activeUser'),
        activeTab       : state.application.get('activeTab')
    };
};

@connect(select, HeaderActions, null, {withRef: true})
export default class HeaderBar extends React.Component {

    constructor(props) {
        super(props);

        this.state = {isSearch: false};

        this.show = this.show.bind(this);
        this.search = this.search.bind(this);
    }

    show(type) {
        this.props.showPage(type);
    }

    search(term) {
        console.log(term);
        this.props.search(term);
    }

    render() {
        const sibiImg = assets('./images/sibi.png');
        let loginSection;

        let styles = {
            header: {
                position: 'absolute',
                top: '10px',
                left: '10px',
                height: '50px',
                width: '970px',
                display: 'inline-flex',
                background: '#FFF',
                boxShadow: '2px 2px 2px 1px rgba(0, 0, 0, 0.2)',

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
        } else {
            loginSection =  <div>
                <div /*onHover={ ()=>{console.log('profileDropdown')}}*/><image alt="profilePicture"/></div>
                <div onClick={ ()=>{console.log('searching...')}}><image alt="search"/></div>
                <div onClick={ ()=>{console.log('truck')}}><image alt="truck"/></div>
            </div>;
        }

        // let searchSection = (this.state.isSearch) ? <input type="text" onChange={ (e)=>{this.search()} } /> : <image src={''} alt="search" onClick={(e)=>{ this.setState(isSearch, true)}}/>

        return (
            <div style={styles.header}>
                <div><image src={sibiImg} alt="sibi" style={ styles.image } onClick={ ()=>this.props.goHome() }/></div>
                <Tabs type={ this.props.activeUser.get('type') }
                      activeTab={ this.props.activeTab }
                      show={ this.show }/>
                { loginSection }
            </div>
        );
    }
}