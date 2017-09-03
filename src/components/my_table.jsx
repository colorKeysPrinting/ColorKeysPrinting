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
                        if (this.props.sortby) {
                            const image = (this.props.sortby.isAsc !== 'asc') ? <img className="sort-arrow" src={assets('./images/icons-sort-up.png')} alt="sortArrow" /> : <img className="sort-arrow" src={assets('./images/icons-sort-down.png')} alt="sortArrow" />;
                            const arrow = (id === this.props.sortby.column) ? image : null;
                            return (<td className="table-header" key={`table-header-${id}`} ><span className="arrow-wrapper">{ header }{ arrow }</span></td>);

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

        const data = _.map(this.props.data, (item, id) => {
            const col = _.map(item, (col, id) => {
                if (id !== 'id') {
                    if (id === 'action') {
                        return (col === 'approve' || this.props.type === 'products') ? <td key={`table-item-${id}`} className="table-cell approve" onClick={() => this.state.handleAction({ item })}>{ col }</td> : <td key={`table-item-${id}`} className="table-cell"></td>;

                    } else {
                        if (id === 'totalCost') {
                            return <td key={`table-item-${id}`} onClick={() => this.state.handleItem({ item })}>$ { col }</td>;

                        } else if (col === 'Pending') {
                            return <td key={`table-item-${id}`} className="pending" onClick={() => this.state.handleItem({ item })}>{ col }</td>;

                        } else if (col === 'Approved') {
                            return <td key={`table-item-${id}`} className="approved" onClick={() => this.state.handleItem({ item })}>{ col }</td>;

                        } else {
                            return <td key={`table-item-${id}`} onClick={() => this.state.handleItem({ item })}>{ col }</td>;
                        }
                    }
                }
            });

            return (<tr key={`table-row-${id}`} className={(this.props.dataClassName) ? this.props.dataClassName : 'table-row' } >{ col }</tr>);
        });


        return (
            <div className={ (this.props.className) ? this.props.className : '' }>
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
