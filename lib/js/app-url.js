import url from './url';
import meta from './meta';
import site from './conf/site';

const siteId = site.getId();

const { config } = sitecues;

// TODO: Retire deprecated script_url field.
if (config.script_url) {
    config.scriptUrl = config.script_url;
    delete config.script_url;
    console.warn('Sitecues: deprecated script_url used. This will not work in the future. Please email support.');
}

const mainEntry = url.resolve(config.scriptUrl);

const appUrl = (filePath) => {
    return url.resolve(appUrl.root, filePath);
};
appUrl.root = url.resolve(
    mainEntry,
    `/${meta.name}/s;id=${siteId}/${meta.branch}/${meta.version}/`
);
appUrl.origin = url.parse(mainEntry).origin;

export default appUrl;
