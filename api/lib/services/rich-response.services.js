import Schmervice from 'schmervice';
import Info from './rich-response/rich-response.info.service';

module.exports = class RichResponseService extends Schmervice.Service {

    async info() {

        return await Info.apply(this, arguments);
    }

};


