import React                    from 'react';
import _                        from 'lodash';
import { Link }                 from 'react-router';

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
            }
        };

        let options = _.map(this.props.myMatchups, (option, key)=>{ // standard, custom
            let title = (option.type === 'standard') ? 'Standard' : 'Custom';
            return (<div key={key} className="options"><Link to={'/products/matchup-' + option.type} >{ title } Matchups</Link></div>);
        });

        let matchups =  <div>
                            <div className={((this.state.activeSection === 'matchups') ? 'headers-active' : 'headers')} onClick={()=>this.changeActiveSection('matchups')}>
                                <div id="title">MATCHUPS</div>
                                <div>{(this.state.activeSection === 'matchups') ? '+' : '-'}</div>
                            </div>
                            <div style={{display: (this.state.activeSection === 'matchups') ? 'block' : 'none'}}>{options}</div>
                        </div>;

        options = _.map(this.props.myLists, (option, key)=>{
            return (<div key={key} className="options"><Link to={'/products/myList-' + key}>{ option.name }</Link></div>);
        });

        let myLists =   <div>
                            <div className={((this.state.activeSection === 'myLists') ? 'headers-active' : 'headers')} onClick={()=>this.changeActiveSection('myLists')}>
                                <div id="title">MY LISTS</div>
                                <div>{(this.state.activeSection === 'myLists') ? '+' : '-'}</div>
                            </div>
                            <div style={{display: (this.state.activeSection === 'myLists') ? 'block' : 'none'}}>
                                {options}
                                <div onClick={()=>this.props.showOverlay('addNewList', {type: 'myLists'})} style={styles.submitBtn}>New List</div>
                            </div>
                        </div>;

        let filterPanel = _.map(this.props.myFilterPanel, (section, key)=>{
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



