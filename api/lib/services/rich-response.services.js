import Schmervice from 'schmervice';
import TimingWrapper from '../../util/service-timing-wrapper';
import Info from './rich-response/rich-response.info.service';

module.exports = class RichResponseService extends Schmervice.Service {

    async info() {
        return await TimingWrapper({ cls: this, fn: Info, name: 'Info' }).apply(this, arguments);
    }

};


