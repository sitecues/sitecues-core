import has from './has';

const isMobile = () => {
    return Boolean(
        has.touchEvents &&
        has.speechSynthApi &&
        matchMedia('only screen and (max-device-width: 1024px)').matches
    );
};

export default {
    isMobile
};
