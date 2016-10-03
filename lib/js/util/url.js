const resolve = (from, to) => {
    const baseUrl = new URL(document.baseURI, location.href);

    const resolvedFrom = new URL(from, baseUrl).href;

    if (from && !to) {
        return resolvedFrom;
    }

    return new URL(to, resolvedFrom).href;
};

const parse = (url) => {
    const baseUrl = resolve(location.href, document.baseURI);
    return new URL(url, baseUrl);
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
