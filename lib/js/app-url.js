import url from './url';
import meta from './meta';
import site from './conf/site';

const siteId = site.getId();

// NOTE: script_url is deprecated.
const mainEntry = url.resolve(sitecues.config.scriptUrl || sitecues.config.script_url);

const appUrl = (filePath) => {
    return url.resolve(appUrl.root, filePath);
};
appUrl.root = url.resolve(
    mainEntry,
    `/${meta.name}/s;id=${siteId}/${meta.branch}/${meta.version}/`
);
appUrl.origin = url.parse(mainEntry).origin;

export default appUrl;
