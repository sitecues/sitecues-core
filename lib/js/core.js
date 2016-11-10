// device.js will be needed in the future, when the mobile library is ready to release.
// import device from './device';
import nativeGlobal from './native-global';
import user from './conf/user';
import site from './conf/site';
import session from './conf/session';
import pageView from './conf/page-view';
import metric from './metric';
import globalApi from './global-api';
import appLoader from './app-loader';

const init = (config) => {
    // Respect the winner of a race condition. The runner-up doesn't get to initialize.
    if (sitecues.exists) {
        throw new Error('Sitecues already exists on this page.');
    }
    sitecues.exists = true;

    // Running in an iframe is opt-in so that the UI doesn't accidentally appear
    // multiple times on a page, both in the top window and the child frame.
    if (window !== top && !config.iframe) {
        throw new Error(
            `Skipping Sitecues within iframe ${location}. Please email support for details.`
        );
    }

    if (!config) {
        throw new Error('Sitecues configuration is required, but was not provided. Please email support.');
    }

    nativeGlobal.init();

    return Promise.all([
        user.create(),
        session.create(),
        pageView.create()
    ]).then(() => {
        metric.loaded();
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
