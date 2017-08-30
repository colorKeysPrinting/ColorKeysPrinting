import React                    from 'react';
import _                        from 'lodash';

import assets                   from 'libs/assets';

export default class MyTable extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            handleAction: (this.props.handleAction) ? this.props.handleAction : () => {},
            handleItem: (this.props.handleItem) ? this.props.handleItem : () => {}
        };
    }

    render() {
        let headers = [], tableClass;

        if (this.props.headers) {
            headers = _.map(this.props.headers, (header, id) => {
                if (id !== 'id') {
                    if (id !== 'action') {
                        if (id === 'createdAt') {
                            return (<td className="table-header" key={`table-header-${id}`} >{ header }<img className="sort-arrow" src={assets('./images/icon-sort-down.svg')} alt="sortArrow" /></td>);
                        } else {
                            return (<td className="table-header" key={`table-header-${id}`} >{ header }</td>);
                        }
                    } else if (id !== 'id') {
                        return (<td key={`table-header-${id}`} ></td>);
                    }
                }
            });
            headers = <tr>{ headers }</tr>
        }

        const data = _.map(this.props.data, (product, id) => {
            const col = _.map(product, (col, id) => {
                if (id !== 'id') {
                    if (id === 'action') {
                        return (col === 'approve' || this.props.type === 'products') ? <td key={`table-item-${id}`} className="table-cell approve" ><div onClick={() => this.state.handleAction({ item })}>{ col }</div></td> : <td key={`table-item-${id}`} className="table-cell"></td>;

                    } else {
                        return <td key={`table-item-${id}`} ><div onClick={() => this.state.handleItem({ product })}>{ col }</div></td>;
                    }
                }
            });

            return (<tr key={`table-row-${id}`} className={(this.props.dataClassName) ? this.props.dataClassName : 'table-row' } >{ col }</tr>);
        });


        return (
            <div className={ (this.props.className) ? this.props.className : 'admin-table' }>
                <table className="table">
                    <thead className="head">
                        { headers }
                    </thead>
                    <tbody>
                        { data }
                    </tbody>
                </table>
            </div>
        );
    }
}
