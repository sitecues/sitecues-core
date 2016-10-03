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
    newFrame.className = 'sitecues';
    newFrame.id = id;
    newFrame.src = url;
    // This may improve security. We should verify it doesn't break anything, then enable it.
    // newFrame.sandbox = 'allow-scripts';
    newFrame.style.display = 'none';

    document.body.appendChild(newFrame);

    return newFrame;
};

export default {
    create
};
