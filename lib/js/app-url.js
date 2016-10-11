import url from './url';
import meta from './meta';

const mainEntry = url.resolve(sitecues.config.scriptUrl);

const appUrl = (filePath) => {
    return url.resolve(appUrl.root, filePath);
};
appUrl.root = url.resolve(mainEntry, '../../' + meta.version + '/');
appUrl.origin = url.parse(mainEntry).origin;

export default appUrl;
