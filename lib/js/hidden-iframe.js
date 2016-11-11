// Create and insert an invisible iframe, or return it if it already exists.
// These iframes are designed to keep us out of trouble with accessibility
// and compliance checkers.
const create = (option) => {
    const { id, url } = option;
    const existingFrame = document.getElementById(id);

    if (existingFrame) {
        return existingFrame;
    }

    const newFrame = document.createElement('iframe');
    newFrame.id = id;
    newFrame.className = 'sitecues';
    // The following CSS and ARIA attributes are here to ensure we pass automated
    // accessibility tests. We also try to avoid being read by screen readers,
    // while providing a title just in case.
    newFrame.style.cssText = 'position:absolute;width:1px;height:1px;left:-9999px;visibility:hidden;';
    newFrame.setAttribute('aria-hidden', true);
    newFrame.setAttribute('role', 'presentation');
    newFrame.setAttribute('title', 'Sitecues data');
    // This may improve security. We should verify it doesn't break anything, then enable it.
    // newFrame.sandbox = 'allow-scripts';
    if (url) {
        newFrame.src = url;
    }

    document.documentElement.appendChild(newFrame);

    return newFrame;
};

export default {
    create
};
