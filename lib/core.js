import * as metric from './metric';
import uuid from './uuid';
import * as storage from './storage';
import * as session from './session';
import { info } from './log';

const start = (config) => {
    if (!config) {
        throw new Error('Configuration is required, but was not provided.');
    }
    if (!config.siteId) {
        throw new Error('A Site ID is required, but was not provided.');
    }

    if (!storage.getUserId()) {
        storage.setUserId(uuid());
    }
    if (!session.getSessionId()) {
        session.setSessionId(uuid());
    }

    new metric.PageVisit().send();

    info('fallback in use, because your platform is unsupported');
};

export default start;
