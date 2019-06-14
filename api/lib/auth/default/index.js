'use strict';
import { AUTH_ENABLED } from '../../../util/env';

module.exports = () => {
    return AUTH_ENABLED ? 'session' : undefined;
};
