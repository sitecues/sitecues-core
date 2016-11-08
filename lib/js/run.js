import core from './core';

// Convert deprecated field names script_url and site_id
const config = sitecues.config;
if (config.site_id) {
    console.log('Using deprecated site_id field. Please email support@sitecues.com.');
    config.siteId = config.site_id;
    delete config.site_id;
}

if (config.script_url) {
    console.log('Using deprecated script_url field. Please email support@sitecues.com.');
    config.scriptUrl = config.script_url;
    delete config.script_url;
}

core.init(config);
