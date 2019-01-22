import Schmervice from 'schmervice';
import CombinationsFromSayings from './keyword/keyword.combinations-from-sayings.service';
import Create from './keyword/keyword.create.service';
import ParseSysValue from './keyword/keyword.parse-sys-value.service';
import ParseSystemKeywordsDuckling from './keyword/keyword.parse-system-keywords-duckling.service';
import ParseSystemKeywordsRegex from './keyword/keyword.parse-system-keywords-regex.service';
import ParseSystemKeywords from './keyword/keyword.parse-system-keywords.service';
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

    parseSystemKeywords() {

        return ParseSystemKeywords.apply(this, arguments);
    }

    parseSystemKeywordsDuckling() {

        return ParseSystemKeywordsDuckling.apply(this, arguments);
    }

    parseSystemKeywordsRegex() {

        return ParseSystemKeywordsRegex.apply(this, arguments);
    }

    parseSysValue() {

        return ParseSysValue.apply(this, arguments);
    }

};


