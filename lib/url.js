function parse(url) {
    return new URL(url, location.href);
}

export {
    parse
};
