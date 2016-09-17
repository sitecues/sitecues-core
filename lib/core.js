import user from './user';
import session from './session';
import pageView from './page-view';
import metric from './metric';
import appLoader from './app-loader';

const init = (config) => {
    if (!config) {
        throw new Error('Configuration is required, but was not provided.');
    }
    if (!config.siteId) {
        throw new Error('A Site ID is required, but was not provided.');
    }

    user.create();
    session.create();
    pageView.create();

    metric.pageVisit();

    appLoader.run();
};

export default {
    init
};
