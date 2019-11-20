import Schmervice from 'schmervice';
import Search from './log/log.search.service';
import FindAllLogs from './log/log.find-all.service';

module.exports = class LogService extends Schmervice.Service {

    async search() {
        return await Search.apply(this, arguments);
    }

    async findAllLogs() {

        return await FindAllLogs.apply(this, arguments);
    }
};


