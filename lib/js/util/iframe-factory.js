const getHelperIframe = (id, optionalSrc) => {
    let frame = document.getElementById(id);

    if (frame) {
        return frame;
    }

    frame = document.createElement('iframe');
    frame.id = id;
    frame.setAttribute('aria-hidden', true);
    frame.setAttribute('role', 'presentation');
    frame.style.cssText = 'position:absolute;width:1px;height:1px;left:-9999px;visibility:hidden;';
    // Set title and text description for iframe. Without this, accessibility tools fail,
    // even though they shouldn't given that it has aria-hidden="true" and says role="presentation".
    // But, customers rightly insist that we pass their tools.
    // The real point is that screen reader users either won't see the iframe, or if they do, it won't be a complete mystery.
    // We used a text phrase that does not need to be localized, just to save effort ... the word 'data' is pretty international.
    const iframeText = 'Sitecues data';
    frame.setAttribute('title', iframeText);
    if (optionalSrc) {
        frame.src = optionalSrc;
    }
    document.documentElement.appendChild(frame);

    return frame;
};

export default getHelperIframe;
