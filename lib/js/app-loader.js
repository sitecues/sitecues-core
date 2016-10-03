import url from './util/url';

const getAppUrl = (input) => {
    if (typeof input === 'string') {
        return input;
    }
    if (input && input.href) {
        return input.href;
    }

    const config = Object.assign(
        {
            protocol : 'https',
            hostname : 'js.sitecues.com',
            branch   : 'master',
            version  : 'latest'
        },
        input
    );
    if (!config.path) {
        if (!config.appName) {
            throw new Error('An appName is required to run.');
        }
        if (!config.siteId) {
            throw new Error('A siteId is required to run.');
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
    const script = document.createElement('script');
    script.type = 'application/javascript';
    script.async = true;
    script.src = getAppUrl(option);
    document.head.appendChild(script);
};

export default {
    run
};
