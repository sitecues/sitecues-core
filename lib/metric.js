import { siteId } from './config';
import { getUserId } from './storage';
import { getSessionId } from './session';
import { post } from './web-service';
import getUuid from './uuid';
import meta from './meta';

const pageViewId = getUuid();

const toMetricName = (str) => {
    const decapitalized = str[0].toLowerCase() + str.slice(1);
    const capitals = /([A-Z])/g;
    const spacers = /[-_\s]+/g;
    const dashed = decapitalized.replace(capitals, '-$1').replace(spacers, '-');

    return dashed.toLowerCase();
};

class Metric {
    constructor(detail) {
        // This is an abstract class.
        if (this.constructor.displayName === Metric.displayName) {
            throw new Error(Metric.displayName + ' cannot be used directly.');
        }

        this.data = {
            metricVersion : 9,
            name          : toMetricName(this.constructor.displayName),
            time          : Date.now(),
            url           : location.href,
            userAgent     : navigator.userAgent,
            appName       : meta.name,
            appVersion    : meta.version,
            detail,
            clientLocale  : navigator.language,
            siteId,
            userId        : getUserId(),
            sessionId     : getSessionId(),
            pageViewId
        };
    }

    send() {
        return post(
            `metrics/site/${this.data.siteId}/notify.json?name=${this.data.name}`,
            this.data
        );
    }
}
// Hack needed because Babel cannot compile 'name' in automatically,
// on account of it being read only.
Metric.displayName = 'Metric';

class PageVisit extends Metric {
    // constructor() {
    //     super(
    //         // { referrer : document.referrer }
    //     );
    // }
}
// Hack needed because Babel cannot compile 'name' in automatically,
// on account of it being read only.
PageVisit.displayName = 'PageVisit';

export {
    PageVisit
};
