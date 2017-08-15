import React                    from 'react';
import _                        from 'lodash';
import assets                   from 'libs/assets';

export default class MyTable extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            searchTerm: '',
            isAscending: false,
            data: this.props.data,
            handleAction: (this.props.handleAction) ? this.props.handleAction : () => {},
            handleItem: (this.props.handleItem) ? this.props.handleItem : () => {}
        };

        this.orderBy = this.orderBy.bind(this);
        this.update = this.update.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        console.log('nextProps:', nextProps);
        const data = (nextProps.data) ? nextProps.data : [];

        this.setState({ data });
    }

    orderBy(value, isAscending) {
        const data = _.orderBy(this.state.data, [value], [(isAscending) ? 'asc' : 'desc']);
        this.setState({ data });
    }

    update(type, value) {
        this.setState({ [type]: value });
    }

    render() {
        let title, headers = [], search = '';

        if (this.props.headers) {
            headers = _.map(this.props.headers, (header, id) => {
                if (id !== 'id') {
                    if (id !== 'action') {
                        return (<td key={`table-header-${id}`} ><div onClick={() => this.orderBy(header, (this.state.isAscending) ? false : true)}>{ header }</div></td>);

                    } else if (id !== 'id') {
                        return (<td></td>);
                    }
                }
            });
        }

        if (this.props.hasSearch) {
            search = <td><input type="text" onChange={(e) => this.update('searchTerm', e.target.value)} value={this.state.searchTerm} /></td>;
        }

        const data = _.map(this.state.data, (item, id) => {

            const col = _.map(item, (col, id) => {
                if (id !== 'id') {
                    if (id === 'action') {
                        return (col === 'approve' || this.props.type === 'products') ? <td key={`table-item-${id}`} ><div onClick={() => this.state.handleAction({ item })}>{ col }</div></td> : <td></td>;
                    } else {
                        return (<td key={`table-item-${id}`} ><div onClick={() => this.state.handleItem({ item })}>{ col }</div></td>);
                    }
                }
            });

            return (<tr key={`table-row-${id}`}>{ col }</tr>);
        });

        return (
            <div id="admin-table" className="header-margin">
                <table className="table">
                    <thead className="head">
                        <tr>
                            <td>{ title }</td>
                            { search }
                        </tr>
                        <tr>
                            { headers }
                        </tr>
                    </thead>
                    <tbody>
                        { data }
                    </tbody>
                </table>
            </div>
        );
    }
}
