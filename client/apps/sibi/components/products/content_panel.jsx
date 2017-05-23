import React                    from 'react';
import _                        from 'lodash';


export default class ContentPanel extends React.Component {

    constructor(props) {
        super(props);

        this.state = {activeSection: ''};

    }

    componentWillReceiveProps(nextProps) {

    }

    render() {
        let styles = {
            container: {
                backgroundColor: '#FFF',
                width: '100%'
            },
            element: {
                width: '25%',
                padding: '2%',
                borderBottom: '1px solid rgba(50, 50, 50, 0.1)',
            }
        };



        return (
            <div style={styles.container}>

            </div>
        );
    }
}



