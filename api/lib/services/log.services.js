import Schmervice from 'schmervice';
import TimingWrapper from '../../util/service-timing-wrapper';
import FindAllLogs from './log/log.find-all.service';
import Search from './log/log.search.service';

module.exports = class LogService extends Schmervice.Service {

    async search() {
        return await TimingWrapper({ cls: this, fn: Search, name: 'Search' }).apply(this, arguments);
    }

    async findAllLogs() {
        return await TimingWrapper({ cls: this, fn: FindAllLogs, name: 'FindAllLogs' }).apply(this, arguments);
    }
};


