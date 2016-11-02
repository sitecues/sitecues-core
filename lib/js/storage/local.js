const namespace = 'sitecues';

// Get the final representation that we will put into storage.
const serialize = (data) => {
    return JSON.stringify(data || {});
};

// Get the normalized representation of what was in storage.
const deserialize = (dataString) => {
    return dataString ? JSON.parse(dataString) : {};
};

// Overwrite the entire namespace that we use for storing data.
const setAll = (data) => {
    const dataString = serialize(data);

    try {
        localStorage.setItem(namespace, dataString);
    }
    catch (err) {
        // Safari throws an exception in Private Browsing mode.
        // There is no reasonable way to recover from this.
    }
};

// Get value of the entire namespace that we use for storing data.
// Returns an object.
const getAll = () => {
    return deserialize(localStorage.getItem(namespace));
};

// Merge some new data into the existing store, with the
// new data taking precedence.
const set = (input) => {
    const appData = getAll();
    setAll(Object.assign({}, appData, input));
};

export default {
    getAll,
    setAll,
    set
};
