import React                    from 'react';
import { connect }              from 'react-redux';
import _                        from 'lodash';
import assets                   from '../../libs/assets';

import {}         from '../../actions/products';
import {activateTab}         from '../../actions/header';

import InfoBar                  from './info_bar';
import FilterPanel              from './filter_panel';
import ContentPanel             from './content_panel';

let select = (state)=>{
    return {
        currLang    : state.application.get('currLanguage'),
        activePage  : state.application.get('activePage'),
        infoBar     : state.application.getIn(['activeUser', 'settings', 'infoBar']).toJS(),
        matchups    : state.application.getIn(['activeUser', 'matchups']).toJS(),
        myLists     : state.application.getIn(['activeUser', 'myLists']).toJS(),
        filterPanel : state.application.getIn(['activeUser', 'filterPanel']).toJS(),
    };
};

@connect(select, {activateTab}, null, {withRef: true})
export default class ProductsPage extends React.Component {

    constructor(props) {
        super(props);

        // activePage: products, matchups, equipment, partsSupplies, productDetails
        // products is the default to be loaded
        this.state = {activePage: this.props.activePage};

        this.changeContent = this.changeContent.bind(this);

        this.props.activateTab('products');
        // TODO: may need to have a server call here to get all products,
        //       or maybe have "most ordered products" load first from the server
        //       and then have a webworker load the rest of the products in the background?
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.activePage) {
            this.setState({activePage: nextProps.activePage});
        }
    }

    changeContent(type, content) {
        console.log(type, content);
        this.setState({activePage: type});
    }

    render() {
        let content;

        let styles = {
        };

        if(this.state.activePage === 'productDetails') {
            content = <div>content page</div>;
        } else {
            content = <div>
                <InfoBar activeInfoBar={this.props.infoBar[this.state.activePage]}/>
                <div style={{display: 'inline-flex', width: '100%'}}>
                    <FilterPanel
                        changeContent={this.changeContent}
                        matchups={this.props.matchups}
                        myLists={this.props.myLists}
                        filterPanel={this.props.filterPanel} />
                    <ContentPanel
                        activePage={this.state.activePage} />
                </div>
            </div>;
        }

        return (
            <div style={{}}>
                {content}
            </div>
        );
    }
}



