import React            from 'react';
import PropTypes        from 'prop-types';

import HeaderBar        from '../header_bar';
import Overlay          from '../overlay';

export default class Index extends React.Component {

    static propTypes = {
        children: PropTypes.node,
    };

    static defaultProps = {
        children: '',
    }

    constructor() {
        super();
        this.state = {};
    }

    render() {
        return (
            <div>
                <HeaderBar />
                { this.props.children }
                <Overlay />
            </div>
        );
    }
}