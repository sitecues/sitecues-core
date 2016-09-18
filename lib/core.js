import has from './has';
import user from './user';
import site from './site';
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

    const isMobile = Boolean(
        matchMedia('only screen and (max-device-width: 1024px)').matches &&
        has.speechSynthApi &&
        has.touchEvents
    );

    appLoader.run({
        appName : 'sitecues-' + (isMobile ? 'mobile' : 'js'),
        siteId  : site.getId()
    });
};

export default {
    init
};
