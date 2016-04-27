import './polyfill';
import * as metric from './metric';
import getUuid from './uuid';
import * as storage from './storage';
import {info} from './log';

export default function start(config) {

    if (!config) {
        throw new Error('Configuration is required, but was not provided.');
    }
    if (!config.siteId) {
        throw new Error('A Site ID is required, but was not provided.');
    }

    if (!storage.getUserId()) {
        storage.setUserId(getUuid());
    }

    new metric.AppStart().send();

    info('fallback in use, because your platform is unsupported');
};
