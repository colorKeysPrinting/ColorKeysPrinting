import React                    from 'react';

import Products                 from './content_sections/products';
import Matchups                 from './content_sections/matchups';
import MatchupsCustom           from './content_sections/matchups_custom';
import MyLists                  from './content_sections/my_lists';
import Equipment                from './content_sections/equipment';

export default function ContentPanel(props) {

    let activeSection;

    let styles = {
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

    const re = /(\w{1,})-([\w|\d]{1,})/;
    const type = re.exec(location.hash) || ['',''];

    switch(type[1]) {
        case 'matchup':
            activeSection = (type[2] === 'standard') ? <Matchups /> : <MatchupsCustom />;
            break;
        case 'myList':
            activeSection = <MyLists
                                list={type[2]} />;
            break;
        case 'equipment':
            activeSection = <Equipment
                                type={type[2]} />;
            break;
        // case 'partsSupplies':
        //     activeSection = <Products />;
        //     break;
        default:
            activeSection = <Products />;
    }

    return (
        <div style={styles.container}>
            {activeSection}
        </div>
    );
}



