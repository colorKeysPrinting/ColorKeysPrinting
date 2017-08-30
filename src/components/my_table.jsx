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

        //USE TABLECLASS TO GIVE TABLE A SPECIFIC CLASSNAME FOR STYLING PURPOSES
        if (this.props.tableClass) {
            tableClass = this.props.tableClass;
        } else {
            tableClass = 'admin-table';
        }

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
        }

        const data = _.map(this.props.data, (item, id) => {

            // build extra column here 👇🏼 "name it product Description"
            const col = _.map(item, (col, id) => {
                if (id !== 'id') {
                    if (id === 'action') {
                        return (col === 'approve' || this.props.type === 'products') ? <td key={`table-item-${id}`} className="table-cell approve" ><div onClick={() => this.state.handleAction({ item })}>{ col }</div></td> : <td key={`table-item-${id}`} className="table-cell"></td>;

                    } else {
                        return <td key={`table-item-${id}`} ><div onClick={() => this.state.handleItem({ item })}>{ col }</div></td>;
                    }
                }
            });

            return (<tr key={`table-row-${id}`} className={(this.props.dataClassName) ? this.props.dataClassName : 'table-row' } >{ col }</tr>);
        });


        return (
            <div className={ (this.props.className) ? this.props.className : 'admin-table' }>
                <table className="table">
                    <thead className="head">
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
