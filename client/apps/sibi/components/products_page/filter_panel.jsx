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
                width: '300px',
                borderRight: '1px solid rgba(50, 50, 50, 0.1)',
            },
            element: {
                width: '25%',
                padding: '2%',
                borderBottom: '1px solid rgba(50, 50, 50, 0.1)',
            }
        };

        let accordion = _.map(this.props.filterPanel, (section, key)=>{
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
                    if(key === 'Custom Matchups') {
                        return (<div key={key} className="options" onClick={()=>this.props.changeContent('matchups', key)}>{key}</div>);
                    } else {
                        return (<div key={key} className="options" onClick={()=>this.props.changeContent(parentId, key)}>{key}</div>);
                    }
                });
            }

            return (
                <div key={key}>
                    <div className={(isActive) ? 'headers-active' : 'headers'} onClick={()=>this.changeActiveSection(key)}>
                        <div id="title">{key.toUpperCase()}</div>
                        <div>{(isActive) ? '+' : '-'}</div>
                    </div>
                    <div style={{display: (isActive) ? 'block' : 'none'}}>{options}</div>
                </div>
            );
        });

        return (
            <div className="accordion" style={styles.container}>
                {accordion}
            </div>
        );
    }
}



