import React                    from 'react';
import _                        from 'lodash';
import assets                   from '../../libs/assets';
import './table.scss';

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
                        return (<td className="table-header" key={`table-header-${id}`} ><div onClick={() => this.orderBy(header, (this.state.isAscending) ? false : true)}>{ header }</div></td>);
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

            // build extra column here 👇🏼 "name it product Description"
            const col = _.map(item, (col, id) => {
                if (id !== 'id') {
                    if (id === 'action') {
                        return (col === 'approve' || this.props.type === 'products') ? <td className="table-cell" key={`table-item-${id}`} ><div onClick={() => this.state.handleAction({ item })}>{ col }</div></td> : <td></td>;
                    } else if (id === 'productImage') {
                      return (<td key={`table-item-${id}`} ><img src={col}></img></td>)
                    }
                    else if (typeof col === "object") {
                      console.log('youre here', typeof col, col);
                      let productTitle = '';
                      let productDescription = [];
                      if (id === 'productDescription'){
                        for(var i in col){
                          i == 0 ? productTitle = <div className="table-cell-title">{col[i]}</div> : productDescription.push(<div className="table-cell-details">{col[i]}</div>)
                        }
                      } else {
                        for(var i in col){
                          productDescription.push(<div>{col[i]}</div>)
                        }
                      }
                      return (<td key={`table-item-${id}`} >{productTitle}{productDescription}</td>)
                    }
                    else {
                        return (<td key={`table-item-${id}`} ><div onClick={() => this.state.handleItem({ item })}>{ col }</div></td>);
                    }
                }
            });

            return (<tr key={`table-row-${id}`}>{ col }</tr>);
        });

        return (
            <div id="admin-table" >
                <table>
                    <thead>
                        <tr>
                            {/* <td>{ title }</td> */}
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
