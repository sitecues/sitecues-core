const logPrefix = 'Sitecues:';

function info() {
    return console.info(logPrefix, ...arguments);
}

function warn() {
    return console.warn(logPrefix, ...arguments);
}

function error() {
    return console.error(logPrefix, ...arguments);
}

export {
    info,
    warn,
    error
}
