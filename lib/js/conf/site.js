const config = sitecues.config;

// Support deprecated site_id field name
if (config.site_id) {
    config.siteId = config.site_id;
    delete config.site_id;
    console.log('Sitecues warning: deprecated site_id used. This will not work on the future. Email support@sitecues.com.');
}

const siteId = config.siteId;

if (!siteId) {
    throw new Error('Sitecues error: siteId is required to run. Please email support@sitecues.com.');
}

const getId = () => {
    return siteId;
};

export default {
    getId
};
