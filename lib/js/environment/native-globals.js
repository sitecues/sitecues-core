import iframeFactory from './iframe-factory';

let isInitialized;
let cleanFrame;

// Interesting bug, can't name this 'exports' or babel gets confused
const moduleExports = {};

// In order to make a regex to lint for direct access to certain functions,
// we suffix certain functions with 'Fn' so that we can distinguish correct uses
// from potentially breaking direct references to fn.bind
const suffixedFields = {
    bind : 'bindFn'
};

// Recover potentially overridden window methods from a nested browsing context
const getCleanFrame = () => {
    if (!cleanFrame) {
        cleanFrame = iframeFactory('sitecues-clean-frame');
    }
    return cleanFrame;
};

const removeCleanFrame = () => {
    cleanFrame.parentElement.removeChild(cleanFrame);
};

const init = () => {
    if (isInitialized) {
        return;
    }
    isInitialized = true;

    let didRetrieveValue;

    const cleanWindow = getCleanFrame().contentWindow;
    const functionToString = cleanWindow.Function.prototype.toString;
    const objectToString = cleanWindow.Object.prototype.toString;

    /*
     * isVerified compares the toString value of two objects or functions,
     * and returns true if they are identical
     *
     * @param top : the value of a given field on a top level native object
     * @param verification : the value of the same field on the `clean` iframe's content window
     * */
    const isSignatureVerified = (top, clean) => {
        let toString;

        // toString isn't a generic method, so we need to pick the correct one
        switch (typeof top) {
            case 'object':
                toString = objectToString;
                break;

            case 'function':
                toString = functionToString;
                break;

            default:
                // If the top value isn't an object or function, we know that it's been overridden
                return false;
        }

        // compares the toString value of the top window function/object the value
        // of the same field on the verification window
        // If they're the same, we know that the top field hasn't been overridden by another script
        return toString.call(top) === toString.call(clean);
    };

    const getNativeValue = (top, clean) => {
        if (isSignatureVerified(top, clean)) {
            return top;
        }
        didRetrieveValue = true;
        return clean;
    };

    const addFunctionProperty = (name) => {
        const exportName = suffixedFields[name] || name;
        const topValue = window.Function.prototype[name];
        const cleanValue = cleanWindow.Function.prototype[name];

        moduleExports[exportName] = getNativeValue(topValue, cleanValue);
    };

    const addWindowProperty = (name) => {
        const topValue = window[name];
        const cleanValue = cleanWindow[name];
        const nativeValue = getNativeValue(topValue, cleanValue);

        // It's especially important to bind setTimeout to the top window
        moduleExports[name] = typeof nativeValue === 'function' ?
            nativeValue.bind(window) :
            nativeValue;
    };

    addFunctionProperty('bind');
    addWindowProperty('Map');
    addWindowProperty('setTimeout');
    // Necessary on http://www.mgmresorts.com/
    addWindowProperty('JSON');

    if (!didRetrieveValue) {
        removeCleanFrame();
    }
};

moduleExports.init = init;
export default moduleExports;
