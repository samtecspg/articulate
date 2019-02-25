import Schmervice from 'schmervice';
import TimingWrapper from '../../util/service-timing-wrapper';
import FindAll from './global/global.find-all.service';
import FindById from './global/global.find-by-id.service';
import FindInModelPath from './global/global.find-in-model-path.service';
import GetAllModelsInPath from './global/global.get-all-model-in-path.service';
import LoadAllByIds from './global/global.load-all-by-ids.service';
import LoadAllLinked from './global/global.load-all-linked.service';
import LoadFirstLinked from './global/global.load-first-linked.service';
import LoadWithIncludes from './global/global.load-with-includes.service';
import SearchByField from './global/global.search-by-field.service';
import CartesianProduct from './global/global.tool-cartesian-product.service';

module.exports = class GlobalService extends Schmervice.Service {

    async searchByField() {

        return await TimingWrapper({ fn: SearchByField, name: 'GlobalService.searchByField' }).apply(this, arguments);
    }

    async findById() {

        return await TimingWrapper({ fn: FindById, name: 'GlobalService.findById' }).apply(this, arguments);
    }

    async findAll() {

        return await TimingWrapper({ fn: FindAll, name: 'GlobalService.findAll' }).apply(this, arguments);
    }

    async findInModelPath() {

        return await TimingWrapper({ fn: FindInModelPath, name: 'GlobalService.findInModelPath' }).apply(this, arguments);
    }

    async loadAllByIds() {

        return await TimingWrapper({ fn: LoadAllByIds, name: 'GlobalService.loadAllByIds' }).apply(this, arguments);
    }

    async getAllModelsInPath() {

        return await TimingWrapper({ fn: GetAllModelsInPath, name: 'GlobalService.getAllModelsInPath' }).apply(this, arguments);
    }

    async loadAllLinked() {

        return await TimingWrapper({ fn: LoadAllLinked, name: 'GlobalService.loadAllLinked' }).apply(this, arguments);
    }

    async loadFirstLinked() {

        return await TimingWrapper({ fn: LoadFirstLinked, name: 'GlobalService.loadFirstLinked' }).apply(this, arguments);
    }

    async cartesianProduct() {

        return await TimingWrapper({ fn: CartesianProduct, name: 'GlobalService.cartesianProduct' }).apply(this, arguments);
    }

    async loadWithIncludes() {

        return await TimingWrapper({ fn: LoadWithIncludes, name: 'GlobalService.loadWithIncludes' }).apply(this, arguments);
    }
};


