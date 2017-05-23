import React                    from 'react';
import { connect }              from 'react-redux';
import _                        from 'lodash';
import assets                   from '../../libs/assets';

import {}         from '../../actions/products';

import InfoBar                  from './info_bar';
import FilterPanel              from './filter_panel';

let select = (state)=>{
    return {
        currLang    : state.application.get('currLanguage'),
        infoBar     : state.application.getIn(['activeUser', 'settings', 'infoBar']).toJS(),
        filterPanel : state.application.getIn(['activeUser', 'filterPanel']).toJS(),
    };
};

@connect(select, {}, null, {withRef: true})
export default class ProductsPage extends React.Component {

    constructor(props) {
        super(props);

        // activePage: products, matchups, equipment, partsSupplies
        // products is the default to be loaded
        this.state = {activePage: 'products'};

        this.changeContent = this.changeContent.bind(this);
    }

    changeContent(type, content) {
        console.log(type, content);
        this.setState({activePage: type});
    }

    render() {

        let styles = {
        };

        return (
            <div style={{}}>
                <InfoBar activeInfoBar={this.props.infoBar[this.state.activePage]}/>
                <div>
                    <FilterPanel
                        changeContent={this.changeContent}
                        filterPanel={this.props.filterPanel} />

                </div>
            </div>
        );
    }
}



