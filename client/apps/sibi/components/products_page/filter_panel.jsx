import React                    from 'react';
import _                        from 'lodash';

export default class FilterPanel extends React.Component {

    constructor(props) {
        super(props);

        this.state = {activeSection: ''};

        this.changeActiveSection = this.changeActiveSection.bind(this);
    }

    componentWillReceiveProps(nextProps) {

    }

    changeActiveSection(section) {
        let activeSection = (this.state.activeSection === section) ? '' : section;
        this.setState({activeSection});
    }

    render() {
        let styles = {
            container: {
                backgroundColor: '#FFF',
                borderRight: '1px solid rgba(50, 50, 50, 0.1)',
                width: '300px'
            }
        };

        let options = _.map(this.props.matchups, (elem, key)=>{
            if(key === 'Custom Matchups') {
                return (<div key={key} className="options" onClick={()=>this.props.changeContent('matchups', key)}>{key}</div>);
            } else {
                return (<div key={key} className="options" onClick={()=>this.props.changeContent('products', key)}>{key}</div>);
            }
        });

        let matchups =  <div>
                            <div className={((this.state.activeSection === 'matchups') ? 'headers-active' : 'headers')} onClick={()=>this.changeActiveSection('matchups')}>
                                <div id="title">MATCHUPS</div>
                                <div>{(this.state.activeSection === 'matchups') ? '+' : '-'}</div>
                            </div>
                            <div style={{display: (this.state.activeSection === 'matchups') ? 'block' : 'none'}}>{options}</div>
                        </div>;

        options = _.map(this.props.myLists, (elem, key)=>{
            return (<div key={key} className="options" onClick={()=>this.props.changeContent('products', key)}>{key}</div>);
        });

        let myLists =   <div>
                            <div className={((this.state.activeSection === 'myLists') ? 'headers-active' : 'headers')} onClick={()=>this.changeActiveSection('myLists')}>
                                <div id="title">MY LISTS</div>
                                <div>{(this.state.activeSection === 'myLists') ? '+' : '-'}</div>
                            </div>
                            <div style={{display: (this.state.activeSection === 'myLists') ? 'block' : 'none'}}>{options}</div>
                        </div>;

        let filterPanel = _.map(this.props.filterPanel, (section, key)=>{
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

            // TODO: what determines what info is shown in the info bar for each child element following
            if(key === 'hvac equipment') {
                options = _.map(section.types, (elem, key)=>{
                    return (<div key={key} className="options" onClick={()=>this.props.changeContent(parentId, key)}>{elem}</div>);
                });

            } else {
                options = _.map(section, (elem, key)=>{
                    return (<div key={key} className="options" onClick={()=>this.props.changeContent(parentId, key)}>{elem}</div>);
                });
            }

            return (
                <div key={key}>
                    <div className={((isActive) ? 'headers-active' : 'headers')} onClick={()=>this.changeActiveSection(key)}>
                        <div id="title">{key.toUpperCase()}</div>
                        <div>{(isActive) ? '+' : '-'}</div>
                    </div>
                    <div style={{display: (isActive) ? 'block' : 'none'}}>{options}</div>
                </div>
            );
        });

        return (
            <div className="accordion" style={styles.container}>
                {matchups}
                {myLists}
                {filterPanel}
            </div>
        );
    }
}



