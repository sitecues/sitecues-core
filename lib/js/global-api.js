import nativeGlobal from './native-global';
import storage from './storage/permanent';

const init = () => {
    // Shared API surface exists for code re-use in downstream apps,
    // such as the desktop library.
    const sharedApi = sitecues._shared = sitecues._shared || {};
    sharedApi.nativeGlobal = nativeGlobal;
    sharedApi.storage = storage;
};

export default {
    init
};
