import * as metric from './metric';
import getUuid from './uuid';
import * as storage from './storage';
import {info} from './log';
import polyfillFetch from './fetch';

export default function start(config) {

    if (!config) {
        throw new Error('Configuration is required, but was not provided.');
    }
    if (!config.siteId) {
        throw new Error('A Site ID is required, but was not provided.');
    }

    storage.setUserId(getUuid());

    polyfillFetch();

    new metric.AppStart().send();

    info('fallback in use, because your platform is unsupported');
};
