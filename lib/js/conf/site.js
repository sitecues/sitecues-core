const { config } = sitecues;

// Support deprecated site_id field name
if (config.site_id) {
    config.siteId = config.site_id;
    delete config.site_id;
    console.warn('Sitecues: deprecated site_id used. This will not work in the future. Please email support.');
}

const { siteId } = config;

if (!siteId) {
    throw new Error('Sitecues: siteId is required to run. Please email support.');
}

const getId = () => {
    return siteId;
};

export default {
    getId
};
