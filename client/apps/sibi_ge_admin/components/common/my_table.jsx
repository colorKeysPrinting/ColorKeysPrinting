import React                    from 'react';
import _                        from 'lodash';
import { browserHistory }       from 'react-router';
import assets                   from '../../libs/assets';

export default class MyTable extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            searchTerm: '',
            isAscending: false,
            headers: this.props.headers,
            data: this.props.data
        };

        this.orderBy = this.orderBy.bind(this);
        this.update = this.update.bind(this);
        this.handleItem = this.handleItem.bind(this);
        this.handleAction = this.handleAction.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        console.log('nextProps:', nextProps);
        const token = nextProps.token;
        const headers = nextProps.headers;
        const data = nextProps.data;

        this.setState({ token, headers, data });
    }

    orderBy(value, isAscending) {
        const data = _.orderBy(this.state.data, [value], [(isAscending) ? 'asc' : 'desc']);
        this.setState({ data });
    }

    update(type, value) {
        this.setState({ [type]: value });
    }

    handleItem(item) {
        switch (this.props.type) {
        case 'orders':
            browserHistory.push({ pathName: `/order_details`, state: { id: item.id } });
            break;

        default:
            console.log('no action for:', this.props.type);
        }
    }

    handleAction(item) {
        switch (this.props.type) {
        case 'orders':
            this.props.approveOrder({ token: this.props.token, id: item.id, status: true });
            break;

        case 'users':
            this.props.approveUser({ token: this.props.token, id: item.id });
            break;

        case 'products':

            break;
        default:
            console.log('no action for:', this.props.type);
        }
    }

    render() {
        let title;
        
        const headers = _.map(this.state.headers, (header, id) => {
            return (<td key={`table-header-${id}`} ><div onClick={() => this.orderBy(header, (this.state.isAscending) ? false : true)}>{ header }</div></td>);
        });

        const data = _.map(this.state.data, (item, id) => {
            let actionText;

            switch (this.props.type) {
            case 'orders':
                actionText = 'approve';
                break;

            case 'users':
                actionText = <img src={assets('./images/icons-check-small.png')} alt="checkmark" />;
                break;

            case 'products':
                actionText = 'Edit';
                break;

            default:
                console.log('no action for:', this.props.type);
            }

            const col = _.map(item, (col, id) => {
                if (id === 'orderStatus' || id === 'status') {
                    const action = (col === 'Pending') ? <div onClick={() => this.handleAction(item)}>{ actionText }</div> : null;

                    return (<td key={`table-item-${id}`} ><div>{ col }</div>{ action }</td>);
                } else {
                    return (<td key={`table-item-${id}`} >{ col }</td>);
                }
            });

            return (<tr key={`table-row-${id}`} onClick={() => this.handleItem(item)}>{ col }</tr>);
        });

        return (
            <div id="admin-table" >
                <table>
                    <thead>
                        <tr>
                            <td>{ title }</td>
                            <td><input type="text" onChange={(e) => this.update('searchTerm', e.target.value)} value={this.state.searchTerm} /></td>
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