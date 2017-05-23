import React                    from 'react';
import _                        from 'lodash';

// import Products                 from './content_sections/products';

export default function ContentPanel(props) {
    let activeSection;

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

    // activeSection: products, matchups, equipment, partsSupplies
    switch(props.activeSection) {
        case 'products':
            activeSection = <Products />;
            break;
        // case 'matchups':
        //     activeSection = <Products />;
        //     break;
        // case 'equipment':
        //     activeSection = <Products />;
        //     break;
        // case 'partsSupplies':
        //     activeSection = <Products />;
        //     break;
        default:
    }

    return (
        <div style={styles.container}>
            {activeSection}
        </div>
    );
}



