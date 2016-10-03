import storage  from './storage/permanent';
import nativeGlobals from './environment/native-globals';

const exportModules = () => {
    const sharedModules = window.sitecues._shared = {};
    sharedModules.nativeGlobals = nativeGlobals;
    sharedModules.storage = storage;
};

export default exportModules;