import url from './url';

const appUrl = (filePath) => {
    return url.resolve(appUrl.root, filePath);
};
appUrl.mainEntry = url.resolve(sitecues.config.scriptUrl);
appUrl.root = url.resolve(appUrl.mainEntry, '../../');

export default appUrl;
