const logPrefix = 'Sitecues:';

const info = (...args) => {
    return console.info(logPrefix, ...args);
};

export {
    info
};
