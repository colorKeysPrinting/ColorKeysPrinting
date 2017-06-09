import React                    from 'react';
import { connect }              from 'react-redux';
import _                        from 'lodash';
import assets                   from '../../libs/assets';

import { setActivateTab }       from '../../actions/header';
import { setActivePage }        from '../../actions/products';
import { showOverlay }          from '../../actions/application';

import KeyIndicatorsBar         from './key_indicators_bar';
import FilterPanel              from './filter_panel';
import ContentPanel             from './content_panel';

let select = (state)=>{
    return {
        currLang            : state.application.get('currLanguage'),
        keyIndicatorBars    : state.application.getIn(['activeUser', 'settings', 'keyIndicatorBars']),
        keyIndicatorTypes   : state.application.get('keyIndicatorTypes'),
        myMatchups          : state.application.getIn(['activeUser', 'myMatchups']),
        myLists             : state.application.getIn(['activeUser', 'myLists']),
        myFilterPanel       : state.application.getIn(['activeUser', 'filterPanel']),
    };
};

@connect(select, {setActivateTab, setActivePage, showOverlay}, null, {withRef: true})
export default class ProductsPage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {activePage: this.props.params.activePage, keyIndicatorBars: this.props.keyIndicatorBars};

        // TODO: may need to have a server call here to get all products,
        //       or maybe have "most ordered products" load first from the server
        //       and then have a webworker load the rest of the products in the background?
    }

    componentWillReceiveProps(nextProps) {
        // console.log('productPage nextProps:', nextProps);
        if(nextProps.params.activePage) {
            this.setState({activePage: nextProps.params.activePage});
        }
    }

    render() {
        let content;

        let styles = {
        };

        let activeKeyIndicatorBar   = (this.state.keyIndicatorBars.size > 0)                          ? this.state.keyIndicatorBars.get('products').toJS() : '';
        let myMatchups              = (this.props.myMatchups && this.props.myMatchups.size > 0)       ? this.props.myMatchups.toJS() : [];
        let myLists                 = (this.props.myLists && this.props.myLists.size > 0)             ? this.props.myLists.toJS() : [];
        let myFilterPanel           = (this.props.myFilterPanel && this.props.myFilterPanel.size > 0) ? this.props.myFilterPanel.toJS() : [];

        content = <div>
                      <KeyIndicatorsBar activeKeyIndicatorBar={activeKeyIndicatorBar}/>
                      <div style={{display: 'inline-flex', width: '97%'}}>
                          <FilterPanel
                              myMatchups={myMatchups}
                              myLists={myLists}
                              myFilterPanel={myFilterPanel}
                              showOverlay={this.props.showOverlay} />
                          <ContentPanel
                              activePage={this.state.activePage} />
                      </div>
                  </div>;

        return (
            <div>
                {content}
            </div>
        );
    }
}



