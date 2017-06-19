import React                    from 'react';

import KeyIndicatorsBar         from './key_indicators_bar';
import FilterPanel              from './filter_panel';
import ContentPanel             from './content_panel';

export default function OrderHistoryPage(props) {

    let styles = {
    };

    return (
        <div>
            <KeyIndicatorsBar />
            <div style={{display: 'inline-flex', width: '97%'}}>
                <ContentPanel />
            </div>
        </div>
    );
}



