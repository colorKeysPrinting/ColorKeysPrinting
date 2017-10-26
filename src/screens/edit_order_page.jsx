import React                                from 'react';
import Iframe                               from 'react-iframe';
import { withRouter }                       from 'react-router';
import _                                    from 'lodash';

export default withRouter((props) => {
    const { id } = props.match.params;
    const height = (window.innerHeight - 69);
    const width = window.innerWidth;

    return (
        <div style={{ position: 'absolute', top: '69px', height, width }}>
            <Iframe
                url={`${process.env.ORDER_URL}/edit/${id}`}
                width={`${width}`}
                height={`${height}`}
                position="relative"
            />
        </div>
    )
});