const namespace = 'sitecues';

/*
 * Overwrite the entire namespace that we use for storing data.
 * You should probably NOT use this! Prefer setAll().
 */
const setAllRaw = (dataString) => {
    sessionStorage.setItem(namespace, dataString);
};

/*
 * Get value of the entire namespace that we use for storing data.
 * You should probably NOT use this! Prefer getAll().
 */
const getAllRaw = () => {
    return sessionStorage.getItem(namespace);
};

/*
 * Get the final representation that we will put into storage.
 */
const serialize = (data) => {
    return JSON.stringify(data || {});
};

/*
 * Get the normalized representation of what was in storage.
 */
const deserialize = (dataString) => {
    return dataString ? JSON.parse(dataString) : {};
};

/*
 * Friendly API for overwriting all data we have put into storage.
 * If you can, use clear() or setPref() instead.
 */
const setAll = (data) => {
    setAllRaw(serialize(data));
};

/*
 * Friendly API for retrieving all data we have put into storage.
 * If you can, use getPrefs(), instead.
 */
const getAll = () => {
    return deserialize(getAllRaw());
};

/*
 * Overwrite only the session ID portion of the data currently in storage.
 */
const setSessionId = (id) => {
    if (!id || typeof id !== 'string') {
        throw new Error('Refusing to set userId. The id is invalid.');
    }
    const appData = getAll();
    appData.sessionId = id;
    setAll(appData);
};

/*
 * Get current session ID from session storage.
 */
const getSessionId = () => {
    return getAll().sessionId;
};

export {
    setSessionId,
    getSessionId
};
