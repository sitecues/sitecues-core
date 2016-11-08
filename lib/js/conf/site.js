const config = sitecues.config;

// Support deprecated site_id field name
if (config.site_id) {
    config.siteId = config.site_id;
    delete config.site_id;
    console.warn('Sitecues: deprecated site_id used. This will not work on the future. Please email support.');
}

const siteId = config.siteId;

if (!siteId) {
    throw new Error('Sitecues: siteId is required to run. Please email support.');
}

const getId = () => {
    return siteId;
};

export default {
    getId
};
