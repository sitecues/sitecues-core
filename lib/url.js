const parse = (url) => {
    return new URL(url, document.baseURI);
};

export {
    parse
};
