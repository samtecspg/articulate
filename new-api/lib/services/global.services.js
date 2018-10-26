import Schmervice from 'schmervice';
import FindAll from './global/global.find-all.service';
import FindById from './global/global.find-by-id.service';
import FindInModelPath from './global/global.find-in-model-path.service';
import GetAllModelsInPath from './global/global.get-all-model-in-path.service';
import LoadAllByIds from './global/global.load-all-by-ids.service';
import LoadAllLinked from './global/global.load-all-linked.service';
import LoadFirstLinked from './global/global.load-first-linked.service';
import SearchByField from './global/global.search-by-field.service';
import CartesianProduct from './global/global.tool-cartesian-product.service';

module.exports = class GlobalService extends Schmervice.Service {

    async searchByField() {

        return await SearchByField.apply(this, arguments);
    }

    async findById() {

        return await FindById.apply(this, arguments);
    }

    async findAll() {

        return await FindAll.apply(this, arguments);
    }

    async findInModelPath() {

        return await FindInModelPath.apply(this, arguments);
    }

    async loadAllByIds() {

        return await LoadAllByIds.apply(this, arguments);
    }

    async getAllModelsInPath() {

        return await GetAllModelsInPath.apply(this, arguments);
    }

    async loadAllLinked() {

        return await LoadAllLinked.apply(this, arguments);
    }

    async loadFirstLinked() {

        return await LoadFirstLinked.apply(this, arguments);
    }

    async cartesianProduct() {

        return await CartesianProduct.apply(this, arguments);
    }
};


