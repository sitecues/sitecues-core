// eslint-disable-next-line import/extensions
import { name as appName } from '../../package.json';

export default {
    name    : appName,
    branch  : '<@BUILD_BRANCH@>',
    version : '<@BUILD_VERSION@>'
};
