import appUrl from '../app-url';
import domEvent from '../dom-event';
import hiddenIframe from '../hidden-iframe';

const iframeUrl = appUrl('html/global-storage.html');
const iframeOrigin = appUrl.origin;

// Create the storage iframe or return it if it already exists.
const createIframe = () => {
    return hiddenIframe.create({
        id  : 'sitecues-global-storage',
        url : iframeUrl
    });
};

// Get the storage iframe, ensuring that it is fully loaded.
const readyIframe = () => {
    const iframe = createIframe();

    if (iframe.isDead) {
        // Reload the iframe to give it another try.
        iframe.src = iframeUrl;
    }
    else if (iframe.isComplete) {
        return Promise.resolve(iframe);
    }

    return new Promise((resolve, reject) => {
        const onComplete = (evt) => {
            iframe.isComplete = true;
            domEvent.off(evt.currentTarget, 'load', onComplete, { once : true });
            domEvent.off(evt.currentTarget, 'error', onComplete, { once : true });
            // eslint-disable-next-line no-use-before-define
            clearTimeout(timeout);
            if (evt.error) {
                iframe.isDead = true;
                reject(evt.error);
                return;
            }
            resolve(iframe);
        };

        const onTimeout = () => {
            domEvent.off(iframe, 'load', onComplete, { once : true });
            domEvent.off(iframe, 'error', onComplete, { once : true });
            iframe.isDead = true;
            reject(new Error('Sitecues Global Storage load timeout.'));
        };

        const timeout = setTimeout(onTimeout, 4000);

        domEvent.once(iframe, 'load', onComplete);
        domEvent.once(iframe, 'error', onComplete);
    });
};

const incrementMessageCounter = () => {
    if (incrementMessageCounter.counter) {
        return ++ incrementMessageCounter.counter;
    }
    incrementMessageCounter.counter = 1;
    return 1;
};

// Send an iframe some data and promisify the iframe's response. We take care of edge cases
// like the iframe not being able to respond and attackers trying to intercept the data.
const messageIframe = (iframe, data) => {
    return new Promise((resolve, reject) => {
        const id = incrementMessageCounter();

        const message = Object.assign({}, data, {
            isSitecues : true,
            id
        });

        const iframeWin = iframe.contentWindow;

        const onMessage = (evt) => {
            // Make sure we only communicate with ourselves. If it is not us,
            // something fishy is happening. Fail silently.
            if (evt.source !== iframeWin || evt.origin !== iframeOrigin || !evt.data.isSitecues) {
                return;
            }

            if (evt.data.id !== id) {
                return;  // Wrong event, don't resolve or reject -- another listener is out there waiting for this one
            }

            domEvent.off(evt.currentTarget, evt.type, onMessage);

            // eslint-disable-next-line no-use-before-define
            clearTimeout(timeout);

            if (evt.data.error) {
                reject(evt.data.error);
                return;
            }
            resolve(evt.data.payload);
        };

        const onTimeout = () => {
            domEvent.off(window, 'message', onMessage);
            reject(new Error('Unable to get a response from global storage.'));
        };
        const timeout = setTimeout(onTimeout, 4000);

        domEvent.on(window, 'message', onMessage);

        iframeWin.postMessage(message, iframeOrigin);
    });
};

// Prepare the storage iframe for use and send it some data.
const readyAndMessage = (data) => {
    return readyIframe().then((iframe) => {
        return messageIframe(iframe, data);
    });
};

// Overwrite all data we have put into storage.
const setAll = (payload) => {
    return readyAndMessage({
        action : 'setAll',
        payload
    });
};

// Return all data we have put into storage, as an object.
const getAll = () => {
    return readyAndMessage({
        action : 'getAll'
    });
};

// Merge some new data into the existing store, with the
// new data taking precedence.
const set = (payload) => {
    return readyAndMessage({
        action : 'set',
        payload
    });
};

export default {
    getAll,
    setAll,
    set
};
