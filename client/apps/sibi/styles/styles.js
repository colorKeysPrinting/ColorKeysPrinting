// This file exists to compile all css - less and scss - into one file
require('./styles.less');
require('./styles.scss');

// HQ STYLES
require('./pure-min.scss');
require('./pure-responsive-min.scss');
require('./reset.scss');

// require('../../../node_modules/react-tabs/style/react-tabs.scss'); //TODO: figure out why this style sheat won't add

// APP STYLES (need to include each file one by one)
// require('./pages/*');
require('./partials/accordion.scss');
require('./partials/slider.scss');
// require('./responsive/*');
require('./theme/forms.scss');
require('./theme/main.scss');