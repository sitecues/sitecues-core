// has.js will be needed in the future, when the mobile library is ready to release.
// import has from './has';
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

        // This will be needed in the future, when the mobile library is ready to release.
        // const isMobile = Boolean(
        //     has.touchEvents &&
        //     has.speechSynthApi &&
        //     matchMedia('only screen and (max-device-width: 1024px)').matches
        // );

        appLoader.run({
            // This will be needed in the future, when the mobile library is released.
            // appName : 'sitecues-' + (isMobile ? 'mobile' : 'js'),
            appName : 'sitecues-js',
            siteId  : site.getId()
        });
    });
};

export default {
    init
};
