import React                    from 'react';
import _                        from 'lodash';

export default class MyTable extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            handleAction: (this.props.handleAction) ? this.props.handleAction : () => {},
            handleItem: (this.props.handleItem) ? this.props.handleItem : () => {}
        };
    }

    render() {
        let headers = [];

        if (this.props.headers) {
            headers = _.map(this.props.headers, (header, id) => {
                if (id !== 'id') {
                    if (id !== 'action') {
                        return (<td className="table-header" key={`table-header-${id}`} >{ header }</td>);
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
                        return (col === 'approve' || this.props.type === 'products') ? <td className="table-cell" key={`table-item-${id}`} ><div onClick={() => this.state.handleAction({ item })}>{ col }</div></td> : <td className="table-cell"></td>;

                    } else {
                        return <td key={`table-item-${id}`} ><div onClick={() => this.state.handleItem({ item })}>{ col }</div></td>;
                    }
                }
            });

            return (<tr key={`table-row-${id}`}>{ col }</tr>);
        });


        return (
            <div id="admin-table">
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
