import url from './url';
import appUrl from './app-url';

const getTargetUrl = (input) => {
    if (typeof input === 'string') {
        return input;
    }
    if (input && input.href) {
        return input.href;
    }

    const config = Object.assign(
        {
            origin   : appUrl.origin,
            branch   : 'master',
            version  : 'latest'
        },
        input
    );
    if (!config.path) {
        if (!config.appName) {
            throw new Error('An appName is required to run.');
        }
        config.path = url.join(
            config.appName,
            's;id=' + config.siteId,
            config.branch,
            config.version,
            'js',
            'run.js'
        );
    }

    return url.format(config);
};

const run = (option) => {
    const src = getTargetUrl(option);
    // THe target app relies upon this to load files relative to itself.
    sitecues.config.appUrl = src;
    const script = document.createElement('script');
    script.type = 'application/javascript';
    script.crossOrigin = 'anonymous';
    script.async = true;
    script.src = src;
    document.head.appendChild(script);

    // Do not allow the sitecues object to be overwritten. But do allow properties
    // to be added to it, e.g. sitecues.$ = jQuery
    Object.defineProperty(window, 'sitecues', { writable : false });
    Object.defineProperty(sitecues, 'config', { writable : false });
    Object.freeze(sitecues.config);
};

export default {
    run
};
