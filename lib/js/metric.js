import meta from './meta';
import has from './has';
import device from './device';
import ws from './web-service';
import site from './conf/site';
import user from './conf/user';
import session from './conf/session';
import pageView from './conf/page-view';

const toMetricName = (str) => {
    const decapitalized = str[0].toLowerCase() + str.slice(1);
    const capitals = /([A-Z])/g;
    const spacers = /[-_\s]+/g;
    const dashed = decapitalized.replace(capitals, '-$1').replace(spacers, '-');

    return dashed.toLowerCase();
};

const send = (input) => {
    if (!input.name || typeof input.name !== 'string') {
        throw new Error('A metric name is required.');
    }

    const known = {
        name             : toMetricName(input.name),
        clientTimeMs     : Date.now(),
        pageUrl          : location.href,
        browserUserAgent : navigator.userAgent,
        appName          : meta.name,
        appVersion       : meta.version,
        clientLocale     : navigator.language,
        siteId           : site.getId(),
        sessionId        : session.getId(),
        pageViewId       : pageView.getId(),
        device           : {
            isMobile : device.isMobile()
        },
        has : (() => {
            const bool = {};
            Object.keys(has).forEach((key) => {
                // In the future, some has tests might be functions (may have side effects),
                // here we are careful to not copy those, ensuring no downstream code can
                // accidentally stringify them and send source code with the metric.
                if (typeof has[key] === 'boolean') {
                    bool[key] = has[key];
                }
            });
            return bool;
        })()
    };

    const data = Object.assign({}, input, known);

    if (document.referrer) {
        data.referrer = document.referrer;
    }

    return user.getId().then((userId) => {
        data.userId = userId;
        return ws.post(
            `metrics/site/${data.siteId}/notify.json?name=${data.name}`,
            data
        );
    });
};

const metric = {};

[
    'coreLoaded'
].forEach((api) => {
    metric[api] = (input) => {
        return send(Object.assign({}, input, { name : api }));
    };
});

export default metric;
