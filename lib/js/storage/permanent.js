import globalStore from './global';
import localStore from './local';

// Overwrite all data currently in storage.
const setAll = (input) => {
    const data = Object.assign({}, input, {
        saveTime : Date.now()
    });
    return Promise.all([
        globalStore.setAll(data),
        localStore.setAll(data)
    ]);
};

// Retrieve all data currently in storage.
const getAll = () => {
    return globalStore.getAll().then((globalData) => {
        const localData = localStore.getAll();

        return (globalData.saveTime > localData.saveTime) ?
            globalData :
            localData;
    });
};

// Merge some new data into the existing store, with the
// new data taking precedence.
const set = (input) => {
    return getAll().then((appData) => {
        return setAll(Object.assign({}, appData, input));
    });
};

export default {
    setAll,
    getAll,
    set
};
