# Storage

> Get and set data, permanently across page views or temporarily for the lifetime of a session.

 - `permanent.js` is a manager that coordinates local and global storage. It exists because neither local or global storage mechanisms can be relied upon in all cases, so it mediates between them.
 - `local.js` deals with data in [localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage), which is permanent across page views, but cannot communicate between cross-origin boundaries.
 - `global.js` deals with cross-origin persistence, but it is constrained by network reliability, security concerns, and - being asynchronous - is more prone to race conditions.
 - `session.js` deals with data in [sessionStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage), which never needs to cross between origins. This is because navigating to a new origin inherently starts a new session, by definition.
