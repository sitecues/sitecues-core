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
        has.pointerEvents &&
        has.touchEvents &&
        has.lightEvents &&
        has.proximityEvents &&
        has.motionEvents &&
        has.orientationEvents &&
        has.batteryApi &&
        has.vibrateApi &&
        has.speechSynthApi &&
        has.speechRecApi
    );

    appLoader.run({
        appName : 'sitecues-' + (isMobile ? 'mobile' : 'js'),
        siteId : site.getId()
    });
};

export default {
    init
};
