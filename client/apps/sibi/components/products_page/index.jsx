import React                    from 'react';
import { connect }              from 'react-redux';
import _                        from 'lodash';
import assets                   from '../../libs/assets';

import { setActivateTab }       from '../../actions/header';
import { setActivePage }        from '../../actions/products';

import KeyIndicatorsBar         from './key_indicators_bar';
import FilterPanel              from './filter_panel';
import ContentPanel             from './content_panel';

let select = (state)=>{
    return {
        currLang            : state.application.get('currLanguage'),
        activePage          : state.application.get('activePage'),
        activePageContent   : state.application.get('activePageContent'),
        keyIndicatorBars    : state.application.getIn(['activeUser', 'settings', 'keyIndicatorBars']).toJS(),
        keyIndicatorTypes   : state.application.get('keyIndicatorTypes'),
        myMatchups          : state.application.getIn(['activeUser', 'myMatchups']).toJS(),
        myLists             : state.application.getIn(['activeUser', 'myLists']).toJS(),
        myFilterPanel       : state.application.getIn(['activeUser', 'filterPanel']).toJS(),
    };
};

@connect(select, {setActivateTab, setActivePage}, null, {withRef: true})
export default class ProductsPage extends React.Component {

    constructor(props) {
        super(props);

        // activePage: products, matchups, equipment, partsSupplies, productDetails <- TODO: need to update types
        // content: 'Standard Matchups', 'Custom Matchups'
        // products is the default to be loaded
        this.state = {activePage: this.props.activePage, content: '', keyIndicatorBars: this.props.keyIndicatorBars};

        this.changeContent = this.changeContent.bind(this);

        // TODO: may need to have a server call here to get all products,
        //       or maybe have "most ordered products" load first from the server
        //       and then have a webworker load the rest of the products in the background?
    }

    componentWillMount() {
        this.props.setActivateTab('products');
    }

    componentWillReceiveProps(nextProps) {
        console.log('productPage nextProps:', nextProps);
        if(nextProps.activePage) {
            this.setState({activePage: nextProps.activePage, content: nextProps.activePageContent});
        }
    }

    changeContent(type, content) { //e.g. (matchups, (standard/custom))
        console.log(type, content);

        this.props.setActivePage(type, content);
    }

    // changeSection(type, section, value) {
    //     let keyIndicatorBars = this.state.keyIndicatorBars;
    //     let indicatorBar = this.state.keyIndicatorBars[type];

    //     indicatorBar[section] = value;

    //     keyIndicatorBars[type] = indicatorBar;
    //     this.setState({keyIndicatorBars});
    // }

    render() {
        let content;

        let styles = {
        };

        if(this.state.activePage === 'productDetails') {
            content = <div>content page</div>;

        } else {
            content =   <div>
                            <KeyIndicatorsBar activeKeyIndicatorBar={this.props.keyIndicatorBars[this.state.activePage]}/>
                            <div style={{display: 'inline-flex', width: '97%'}}>
                                <FilterPanel
                                    changeContent={this.changeContent}
                                    myMatchups={this.props.myMatchups}
                                    myLists={this.props.myLists}
                                    myFilterPanel={this.props.myFilterPanel} />
                                <ContentPanel
                                    activePage={this.state.activePage}
                                    content={this.state.content} />
                            </div>
                        </div>;
        }

        return (
            <div>
                {content}
            </div>
        );
    }
}



