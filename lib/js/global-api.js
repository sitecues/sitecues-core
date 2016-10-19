import nativeGlobal from './native-global';
import pageView from './conf/page-view';
import session from './conf/session';
import site from './conf/site';
import user from './conf/user';

const init = () => {
    nativeGlobal.init();

    // Shared API surface exists for code re-use in downstream apps,
    // such as the desktop library.
    const sharedApi = sitecues._shared = sitecues._shared || {};
    sharedApi.nativeGlobal = nativeGlobal;
    sharedApi.pageView = pageView;
    sharedApi.session = session;
    sharedApi.site = site;
    sharedApi.user = user;
};

export default {
    init
};
