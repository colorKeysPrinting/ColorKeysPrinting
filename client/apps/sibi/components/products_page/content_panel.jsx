import React                    from 'react';
import { withRouter }           from 'react-router';
import { connect }              from 'react-redux';

import { closeOverlay }         from '../../actions/application';
import { getProducts, getUserMatchups }          from '../../actions/products';

import Products                 from './content_sections/products';
import Matchups                 from './content_sections/matchups';
import Equipment                from './content_sections/equipment';

class ContentPanel extends React.Component {

    componentWillMount() {
        this.props.getProducts();
        this.props.getUserMatchups();
    }

    render() {
        let activeSection;

        const styles = {
            container: {
                backgroundColor: '#FFF',
                width: '83%'
            },
            element: {
                width: '25%',
                padding: '2%',
                borderBottom: '1px solid rgba(50, 50, 50, 0.1)',
            }
        };

        const re = /\w{1,}\/([\w|\d]{1,})\/([\w|\d|-]{1,})/;
        const type = re.exec(location.hash) || ['',''];

        switch (type[1]) {
        case 'matchup':
            activeSection = <Matchups />;
            break;
        case 'equipment':
            activeSection = (
                <Equipment
                    type={type[2]}
                />);
            break;
        default:
            activeSection = <Products />;
        }

        return (
            <div style={styles.container}>
                { activeSection }
            </div>
        );
    }
}

const select = (state) => ({
    currLang        : state.application.get('currLanguage'),
    activeOverlay   : state.application.get('activeOverlay')
});

export default connect(select, { closeOverlay, getProducts, getUserMatchups }, null, { withRef: true })(withRouter(ContentPanel));

