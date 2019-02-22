import Schmervice from 'schmervice';
import PerformanceWrapper from '../../util/service-performance-wrapper';
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

        return await PerformanceWrapper({ fn: SearchByField, name: 'GlobalService.searchByField' }).apply(this, arguments);
    }

    async findById() {

        return await PerformanceWrapper({ fn: FindById, name: 'GlobalService.findById' }).apply(this, arguments);
    }

    async findAll() {

        return await PerformanceWrapper({ fn: FindAll, name: 'GlobalService.findAll' }).apply(this, arguments);
    }

    async findInModelPath() {

        return await PerformanceWrapper({ fn: FindInModelPath, name: 'GlobalService.findInModelPath' }).apply(this, arguments);
    }

    async loadAllByIds() {

        return await PerformanceWrapper({ fn: LoadAllByIds, name: 'GlobalService.loadAllByIds' }).apply(this, arguments);
    }

    async getAllModelsInPath() {

        return await PerformanceWrapper({ fn: GetAllModelsInPath, name: 'GlobalService.getAllModelsInPath' }).apply(this, arguments);
    }

    async loadAllLinked() {

        return await PerformanceWrapper({ fn: LoadAllLinked, name: 'GlobalService.loadAllLinked' }).apply(this, arguments);
    }

    async loadFirstLinked() {

        return await PerformanceWrapper({ fn: LoadFirstLinked, name: 'GlobalService.loadFirstLinked' }).apply(this, arguments);
    }

    async cartesianProduct() {

        return await PerformanceWrapper({ fn: CartesianProduct, name: 'GlobalService.cartesianProduct' }).apply(this, arguments);
    }

    async loadWithIncludes() {

        return await PerformanceWrapper({ fn: LoadWithIncludes, name: 'GlobalService.loadWithIncludes' }).apply(this, arguments);
    }
};


