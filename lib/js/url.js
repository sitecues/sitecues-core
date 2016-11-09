const getBaseUrl = () => {
    if (document.baseURI) {
        return document.baseURI;
    }
    // Internet Explorer does not support document.baseURI.
    const baseTag = document.getElementsByTagName('base')[0];
    return new URL(baseTag ? baseTag.href : '', location.href).href;
};

const resolve = (from, to) => {
    const baseUrl = getBaseUrl();

    const resolvedFrom = new URL(from, baseUrl).href;

    if (from && !to) {
        return resolvedFrom;
    }

    return new URL(to, resolvedFrom).href;
};

const parse = (url) => {
    return new URL(url, getBaseUrl());
};

const format = (url) => {
    if (typeof url === 'string') {
        return url;
    }
    if (!url || typeof url !== 'object') {
        throw new Error('Expected an object to format.');
    }
    if (url.href) {
        return url.href;
    }

    const protocol = url.protocol || 'https:';
    const host = url.host || (url.hostname + (url.port ? (':' + url.port) : ''));
    const origin = url.origin || (
        (protocol.endsWith(':') ? protocol : (protocol + ':')) +
        '//' + host
    );

    return origin + '/' + (url.path || '');
};

const join = (...parts) => {
    return parts.join('/');
};

export default {
    resolve,
    parse,
    format,
    join
};
