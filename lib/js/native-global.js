import hiddenIframe from './hidden-iframe';

// Interesting bug, can't name this 'exports' or babel gets confused
const moduleExports = {};

// Recover potentially overridden window methods from a fresh browsing context.
const init = () => {
    const iframe = hiddenIframe.create({
        id : 'sitecues-clean-frame'
    });
    const cleanWindow = iframe.contentWindow;
    const functionToString = cleanWindow.Function.prototype.toString;
    const objectToString = cleanWindow.Object.prototype.toString;

    /*
     * isVerified compares the toString value of two objects or functions,
     * and returns true if they are identical
     *
     * @param suspect : the value of a given field on a top level native object
     * @param clean : the value of the same field on the clean iframe's content window
     * */
    const isSignatureVerified = (suspect, clean) => {
        const stringifier = {
            object   : objectToString,
            function : functionToString
        }[typeof suspect];

        // Compare the toString value of the top window function/object and the value
        // of the same field on the verification window
        // If they're the same, we know that the top field hasn't been overridden by another script
        return Boolean(stringifier) && (stringifier.call(suspect) === stringifier.call(clean));
    };

    let didRetrieveValue;

    const getNativeValue = (suspect, clean) => {
        if (isSignatureVerified(suspect, clean)) {
            return suspect;
        }
        didRetrieveValue = true;
        return clean;
    };

    // In order to make a regex to lint for direct access to certain functions,
    // we suffix certain functions with 'Fn' so that we can distinguish correct uses
    // from potentially breaking direct references to fn.bind
    const suffixedFields = {
        bind : 'bindFn'
    };

    const addFunctionProperty = (propName) => {
        const exportName = suffixedFields[propName] || propName;
        const topValue = window.Function.prototype[propName];
        const cleanValue = cleanWindow.Function.prototype[propName];

        moduleExports[exportName] = getNativeValue(topValue, cleanValue);
    };

    const addWindowProperty = (propName) => {
        const topValue = window[propName];
        const cleanValue = cleanWindow[propName];
        const nativeValue = getNativeValue(topValue, cleanValue);

        // It's especially important to bind setTimeout to the top window
        moduleExports[propName] = typeof nativeValue === 'function' ?
            nativeValue.bind(window) :
            nativeValue;
    };

    addFunctionProperty('bind');
    addWindowProperty('Map');
    addWindowProperty('setTimeout');
    // Necessary on http://www.mgmresorts.com/
    addWindowProperty('JSON');

    if (!didRetrieveValue) {
        iframe.parentElement.removeChild(iframe);
    }
};

moduleExports.init = init;

export default moduleExports;
