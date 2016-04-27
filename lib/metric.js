import * as config from './config';
import * as service from './web-service';

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
        if (this.constructor.name === Metric.name) {
            throw new Error(Metric.name + ' cannot be used directly.');
        }
        this.data = {
            // TODO: Maintain in tandem with sitecues-js, the desktop web app.
            metricVersion    : 9,
            name             : toMetricName(this.constructor.name),
            // TODO: Rename to "time"
            clientTimeMs     : Date.now(),
            // TODO: Rename to "url"
            pageUrl          : location.href,
            // TODO: Rename to "userAgent"
            browserUserAgent : navigator.userAgent,
            // TODO: Don't hard code this value. Compile it in from package.json
            scVersion        : '1.1.0-FALLBACK',
            detail           : detail,
            // TODO: Rename to "clientLocale"
            clientLanguage   : navigator.language,
            siteId           : config.siteId,
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

class AppStart extends Metric {
    constructor() {
        super(
            // { referrer : document.referrer }
        );
    }
}

export {
    AppStart
}
