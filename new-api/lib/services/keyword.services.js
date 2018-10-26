import Schmervice from 'schmervice';
import CombinationsFromSayings from './keyword/keyword.combinations-from-sayings.service';
import Create from './keyword/keyword.create.service';
import Remove from './keyword/keyword.remove.service';
import SplitAddedOldRemovedIds from './keyword/keyword.split-added-old-removed-ids.service';

module.exports = class KeywordService extends Schmervice.Service {

    async create() {

        return await Create.apply(this, arguments);
    }

    async remove() {

        return await Remove.apply(this, arguments);
    }

    splitAddedOldRemovedIds() {

        return SplitAddedOldRemovedIds.apply(this, arguments);
    }

    combinationsFromSayings() {

        return CombinationsFromSayings.apply(this, arguments);
    }

};


