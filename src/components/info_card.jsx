import React                    from 'react';
import _                        from 'lodash';
import assets                   from 'libs/assets';

export default class InfoCard extends React.Component {

    constructor(props) {
        super(props);
    }


    render() {
        let title, number, type;
        return (
            <div className="info-card">
                <div className="info-card-header">
                    <h4>Goodman Spend</h4>
                </div>
                <div className="info-card-body">
                    <p>$7,203,117</p>
                    <p className="percent-change">+12%</p>
                </div>
            </div>
        );
    }
}
