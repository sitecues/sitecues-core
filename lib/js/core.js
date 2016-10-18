// device.js will be needed in the future, when the mobile library is ready to release.
// import device from './device';
import user from './conf/user';
import site from './conf/site';
import session from './conf/session';
import pageView from './conf/page-view';
import metric from './metric';
import globalApi from './global-api';
import appLoader from './app-loader';

const init = (config) => {
    if (!config) {
        throw new Error('Configuration is required, but was not provided.');
    }
    if (!config.siteId) {
        throw new Error('A Site ID is required, but was not provided.');
    }

    return Promise.all([
        user.create(),
        session.create(),
        pageView.create()
    ]).then(() => {
        metric.pageVisit();
        globalApi.init();

        appLoader.run(
            Object.assign(
                {},
                {
                    // This will be needed in the future, when the mobile library is released.
                    // appName : 'sitecues-' + (device.isMobile() ? 'mobile' : 'js'),
                    appName : 'sitecues-js',
                    siteId  : site.getId()
                },
                sitecues.config.appUrl
            )
        );
    });
};

export default {
    init
};
