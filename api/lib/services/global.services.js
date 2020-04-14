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
        return await TimingWrapper({ cls: this, fn: SearchByField, name: 'SearchByField' }).apply(this, arguments);
    }

    async findById() {
        return await TimingWrapper({ cls: this, fn: FindById, name: 'FindById' }).apply(this, arguments);
    }

    async findAll() {
        return await TimingWrapper({ cls: this, fn: FindAll, name: 'FindAll' }).apply(this, arguments);
    }

    async findInModelPath() {
        return await TimingWrapper({ cls: this, fn: FindInModelPath, name: 'FindInModelPath' }).apply(this, arguments);
    }

    async loadAllByIds() {
        return await TimingWrapper({ cls: this, fn: LoadAllByIds, name: 'LoadAllByIds' }).apply(this, arguments);
    }

    async getAllModelsInPath() {
        return await TimingWrapper({ cls: this, fn: GetAllModelsInPath, name: 'GetAllModelsInPath' }).apply(this, arguments);
    }

    async loadAllLinked() {
        return await TimingWrapper({ cls: this, fn: LoadAllLinked, name: 'LoadAllLinked' }).apply(this, arguments);
    }

    async loadFirstLinked() {
        return await TimingWrapper({ cls: this, fn: LoadFirstLinked, name: 'LoadFirstLinked' }).apply(this, arguments);
    }

    async cartesianProduct() {
        return await TimingWrapper({ cls: this, fn: CartesianProduct, name: 'CartesianProduct' }).apply(this, arguments);
    }

    async loadWithIncludes() {
        return await TimingWrapper({ cls: this, fn: LoadWithIncludes, name: 'LoadWithIncludes' }).apply(this, arguments);
    }
};


