import React                    from 'react';
import { connect }              from 'react-redux';
import { Link }                 from 'react-router';
import _                        from 'lodash';
import assets                   from '../../libs/assets';

import ReactSlider              from 'react-slider';

import { setActiveFilters }     from '../../actions/products';
import { showOverlay }          from '../../actions/application';

let select = (state)=>{
    return {
        currLang            : state.application.get('currLanguage'),
        myMatchups          : state.application.getIn(['activeUser', 'myMatchups']),
        myLists             : state.application.getIn(['activeUser', 'myLists']),
        myFilterPanel       : state.application.getIn(['activeUser', 'filterPanel']),
        availableFilters    : state.application.get('availableFilters'),
        activeFilters       : state.application.get('activeFilters'),
    };
};

@connect(select, {setActiveFilters, showOverlay}, null, {withRef: true})
export default class FilterPanel extends React.Component {

    constructor(props) {
        super(props);

        this.state = {activeSection: '', activeFilterSection: '', activeFilters: this.props.activeFilters.toJS() || {}, priceMin: 0, priceMax: 100};

        this.changeActiveSection = this.changeActiveSection.bind(this);
        this.changeActiveFilterSection = this.changeActiveFilterSection.bind(this);
        this.update = this.update.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.activeFilters) {
            this.setState({activeFilters: nextProps.activeFilters.toJS()});
        }
    }

    changeActiveSection(section) {
        let activeSection = (this.state.activeSection === section) ? '' : section;
        this.setState({activeSection});
    }

    changeActiveFilterSection(section) {
        let activeFilterSection = (this.state.activeFilterSection === section) ? '' : section;
        this.setState({activeFilterSection});
    }

    update(props) {
        this.props.setActiveFilters('price', {min: props[0], max: props[1]});
    }

    render() {
        let styles = {
            container: {
                backgroundColor: '#FFF',
                borderRight: '1px solid rgba(50, 50, 50, 0.1)',
                width: '300px'
            },
            submitBtn: {
                backgroundColor: '#06cfe5',
                borderRadius: '5px',
                color: '#FFF',
                cursor: 'pointer',
                width: '200px',
                height: '46px',
                margin: '20px auto',
                paddingTop: '13px'
            },
            filterHeader: {
                textAlign: 'left',
                marginTop: '30px'
            }
        };

        let options = _.map(this.props.myMatchups.toJS() || [], (option, key)=>{ // standard, custom
            let title = (option.type === 'standard') ? 'Standard' : 'Custom';
            return (<Link to={'/products/matchup-' + option.type} key={key}><div className="options">{ title } Matchups</div></Link>);
        });

        let matchups =  <div>
                            <div className={((this.state.activeSection === 'matchups') ? 'headers-active' : 'headers')} onClick={()=>this.changeActiveSection('matchups')}>
                                <div id="title">MATCHUPS</div>
                                <div>{(this.state.activeSection === 'matchups') ? '-' : '+'}</div>
                            </div>
                            <div style={{display: (this.state.activeSection === 'matchups') ? 'block' : 'none'}}>{options}</div>
                        </div>;

        options = _.map(this.props.myLists.toJS() || [], (option, key)=>{
            return (<Link to={'/products/myList-' + key} key={key}><div className="options">{ option.name }</div></Link>);
        });

        let myLists =   <div>
                            <div className={((this.state.activeSection === 'myLists') ? 'headers-active' : 'headers')} onClick={()=>this.changeActiveSection('myLists')}>
                                <div id="title">MY LISTS</div>
                                <div>{(this.state.activeSection === 'myLists') ? '-' : '+'}</div>
                            </div>
                            <div style={{display: (this.state.activeSection === 'myLists') ? 'block' : 'none'}}>
                                { options }
                                <div onClick={()=>this.props.showOverlay('addNewList', {type: 'myLists'})} style={styles.submitBtn}>New List</div>
                            </div>
                        </div>;

        let filterPanel = _.map(this.props.myFilterPanel.toJS() || [], (section, key)=>{
            let options;
            let isActive = (this.state.activeSection === key);
            let parentId;

            switch(key) {
                case 'parts & supplies':
                    parentId = 'partsSupplies';
                    break;
                default:
                    parentId = 'products';
            }

            if(key === 'hvac equipment') {
                options = _.map(section.types, (elem, key)=>{
                    return (<Link to={`/products/equipment-${key}`} key={key}><div className="options" >{ elem }</div></Link>);
                });

            } else {
                options = _.map(section, (elem, key)=>{
                    return (<Link to={`/products/supplies-${key}`} key={key}><div className="options" >{ elem }</div></Link>);
                });
            }

            return (
                <div key={key}>
                    <div className={((isActive) ? 'headers-active' : 'headers')} onClick={()=>this.changeActiveSection(key)}>
                        <div id="title">{key.toUpperCase()}</div>
                        <div>{(isActive) ? '-' : '+'}</div>
                    </div>
                    <div style={{display: (isActive) ? 'block' : 'none'}}>{ options }</div>
                </div>
            );
        });

        let filters
        let availableFilters = (this.props.availableFilters.size > 0) ? this.props.availableFilters.toJS() : {};

        if(availableFilters.types[this.state.activeSection]) {
            filters = _.map(availableFilters.types[this.state.activeSection] || [], (filter, key)=>{
                let options;

                if(filter === 'btu' || filter === 'seer') {
                    options = _.map(availableFilters.filters[filter], (option, key)=>{
                        return (
                            <div key={key} className="options">
                                <input type="checkbox"
                                       onClick={()=>this.props.setActiveFilters(option, (this.state.activeFilters[option]) ? false : true)}
                                       checked={this.state.activeFilters[option]} />
                                { option }
                            </div>
                        );
                    });
                } else if(filter === 'price') {
                    let priceMin = availableFilters.filters.price.min;
                    let priceMax = availableFilters.filters.price.max;
                    let filterPriceMin = (this.state.activeFilters.price) ? this.state.activeFilters.price.min : availableFilters.filters.price.min;
                    let filterPriceMax = (this.state.activeFilters.price) ? this.state.activeFilters.price.max : availableFilters.filters.price.max;

                    options = <div id="price-slider" >
                                  <div>${ filterPriceMin } - ${ filterPriceMax }</div>
                                  <div>
                                      <ReactSlider
                                              className="horizontal-slider"
                                              min={priceMin}
                                              max={priceMax}
                                              minDistance={62}
                                              defaultValue={[priceMin, priceMax]}
                                              onChange={this.update}
                                              withBars
                                              pearling >
                                          <div className="my-handle"><img src={assets('./images/oval-1.png')} alt="min" /></div>
                                          <div className="my-handle"><img src={assets('./images/oval-1.png')} alt="max" /></div>
                                      </ReactSlider>
                                  </div>
                              </div>;
                }

                return (
                    <div key={key}>
                        <div className={((this.state.activeFilterSection === filter) ? 'headers-active' : 'headers')} onClick={()=>this.changeActiveFilterSection(filter)}>
                            <div id="title">{ (filter).toUpperCase() }</div>
                            <div>{(this.state.activeFilterSection === filter) ? '-' : '+'}</div>
                        </div>
                        <div style={{display: (this.state.activeFilterSection === filter) ? 'block' : 'none'}}>
                            { options }
                        </div>
                    </div>
                );
            });

            filters = <div>
                          <div style={styles.filterHeader} ><h1>Filters</h1></div>
                          { filters }
                      </div>;
        }

        return (
            <div className="accordion" style={styles.container}>
                { matchups }
                { myLists }
                { filterPanel }
                { filters }
            </div>
        );
    }
}



