import React                    from 'react';
import _                        from 'lodash';
import { PropTypes }            from 'prop-types';

import assets                   from 'libs/assets';
import { formatPhoneNumbers }   from 'libs/reformat';

export default class MyTable extends React.Component {
    static propTypes = {
        type            : PropTypes.string.isRequired,
        className       : PropTypes.string,
        dataClassName   : PropTypes.string,
        title           : PropTypes.string,
        headers         : PropTypes.object,
        data            : PropTypes.array.isRequired,
        sortby          : PropTypes.object,
        handleAction    : PropTypes.func,
        handleItem      : PropTypes.func,
    };

    constructor(props) {
        super(props);
        const { handleAction, handleItem } = this.props;

        this.state = {
            handleAction: (handleAction) ? handleAction : () => {},
            handleItem: (handleItem) ? handleItem : () => {}
        };
    }

    render() {
        const { headers, sortby, data, type, className, dataClassName, title } = this.props;

        return (
            <div className={ (className) ? className : '' }>
                <table className="table">
                    <thead className="head">
                        { (title) ? <tr><td className="table-title" colSpan={_.size(headers)}><h4>{ title }</h4></td></tr> : null }
                        <tr>{ (headers) ? (
                            _.map(headers, (header, id) => {
                                if (id !== 'id') {
                                    if (id !== 'action') {
                                        if (sortby) {
                                            const image = (sortby.isAsc !== 'asc') ? <img className="sort-arrow" src={assets('./images/icons-sort-up.png')} alt="sortArrow" /> : <img className="sort-arrow" src={assets('./images/icons-sort-down.png')} alt="sortArrow" />;
                                            const arrow = (id === sortby.column) ? image : null;
                                            return (<td className="table-header" key={`table-header-${id}`} ><span className="arrow-wrapper">{ header }{ arrow }</span></td>);

                                        } else {
                                            return (<td className="table-header" key={`table-header-${id}`} >{ header }</td>);
                                        }
                                    } else if (id !== 'id') {
                                        return (<td key={`table-header-${id}`} ></td>);
                                    }
                                }
                            })
                        ) : [] }</tr>
                    </thead>
                    <tbody>
                        { _.map(data, (item, id) => {
                            const col = _.map(item, (col, id) => {
                                if (id !== 'id') {
                                    if (id === 'action') {
                                        return (col !== '') ? <td key={`table-item-${id}`} className="table-cell approve" onClick={() => this.state.handleAction(col, item)}>{ col }</td> : <td key={`table-item-${id}`} className="table-cell"></td>;

                                    } else {
                                        if (id === 'totalCost') {
                                            return <td title={`$${col}`} key={`table-item-${id}`} onClick={() => this.state.handleItem(item)}>${ col }</td>;

                                        } else if (col === 'Pending') {
                                            const lowercase = col.toLowerCase();
                                            return <td title={col} key={`table-item-${id}`} className="pending" onClick={() => this.state.handleItem(item)}>{ col }</td>;

                                        } else if (col === 'Approved') {
                                            const lowercase = col.toLowerCase();
                                            return <td title={col} key={`table-item-${id}`} className="approved" onClick={() => this.state.handleItem(item)}>{ col }</td>;

                                        } else if (col === 'Shipped') {
                                            const lowercase = col.toLowerCase();
                                            return <td title={col} key={`table-item-${id}`} onClick={() => this.state.handleItem(item)}>{ col }</td>;

                                        } else if (id === 'phoneNumber') {
                                            const phoneFormat = formatPhoneNumbers(col);
                                            return <td title={phoneFormat} key={`table-item-${id}`} onClick={() => this.state.handleItem(item)}>{ phoneFormat }</td>;

                                        } else if ((typeof col) !== 'string') {
                                            return <td key={`table-item-${id}`} onClick={() => this.state.handleItem(item)}>{ col }</td>;

                                        } else {
                                            return <td title={col} key={`table-item-${id}`} onClick={() => this.state.handleItem(item)}>{ col }</td>;
                                        }
                                    }
                                }
                            });

                            return <tr key={`table-row-${id}`} className={(dataClassName) ? dataClassName : 'table-row' } >{ col }</tr>;
                        }) }
                    </tbody>
                </table>
            </div>
        );
    }
}
