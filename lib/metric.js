import * as config from './config';
import * as storage from './storage';
import * as session from './session';
import * as service from './web-service';
import getUuid from './uuid';

const pageViewId = getUuid();

function toMetricName(str) {
    const
        decapitalized = str[0].toLowerCase() + str.slice(1),
        capitals = /([A-Z])/g,
        spacers = /[-_\s]+/g,
        dashed = decapitalized.replace(capitals, '-$1').replace(spacers, '-');

    return dashed.toLowerCase();
}

class Metric {
    constructor(detail) {
        // This is an abstract class.
        if (this.constructor.displayName === Metric.displayName) {
            throw new Error(Metric.displayName + ' cannot be used directly.');
        }

        this.data = {
            // TODO: Maintain in tandem with sitecues-js, the desktop web app.
            metricVersion    : 9,
            name             : toMetricName(this.constructor.displayName),
            // TODO: Rename to "time"
            clientTimeMs     : Date.now(),
            // TODO: Rename to "url"
            pageUrl          : location.href,
            // TODO: Rename to "userAgent"
            browserUserAgent : navigator.userAgent,
            // TODO: Don't hard code this value. Compile it in from package.json
            scVersion        : '2.0.0-FALLBACK',
            detail           : detail,
            // TODO: Rename to "clientLocale"
            clientLanguage   : navigator.language,
            siteId           : config.siteId,
            userId           : storage.getUserId(),
            sessionId        : session.getSessionId(),
            pageViewId,
            // TODO: Remove this for release.
            isTester         : true
        };
    }

    send() {
        return service.post(
                `metrics/site/${this.data.siteId}/notify.json?name=${this.data.name}`,
                this.data
            );
    }
}
// Hack needed because Babel cannot compile 'name' in automatically,
// on account of it being read only.
Metric.displayName = 'Metric';

// TODO: Rename to "AppStart"
class PageLoad extends Metric {
    constructor() {
        super(
            // { referrer : document.referrer }
        );
    }
}
// Hack needed because Babel cannot compile 'name' in automatically,
// on account of it being read only.
PageLoad.displayName = 'PageLoad';

export {
    PageLoad
}
