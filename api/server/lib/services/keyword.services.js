import Schmervice from 'schmervice';
import TimingWrapper from '../../util/service-timing-wrapper';
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

        return await TimingWrapper({ fn: Create, name: 'KeywordService.create' }).apply(this, arguments);
    }

    async remove() {

        return await TimingWrapper({ fn: Remove, name: 'KeywordService.remove' }).apply(this, arguments);
    }

    splitAddedOldRemovedIds() {

        return TimingWrapper({ fn: SplitAddedOldRemovedIds, name: 'KeywordService.splitAddedOldRemovedIds' }).apply(this, arguments);
    }

    combinationsFromSayings() {

        return TimingWrapper({ fn: CombinationsFromSayings, name: 'KeywordService.combinationsFromSayings' }).apply(this, arguments);
    }

    parseSystemKeywords() {

        return TimingWrapper({ fn: ParseSystemKeywords, name: 'KeywordService.parseSystemKeywords' }).apply(this, arguments);
    }

    parseSystemKeywordsDuckling() {

        return TimingWrapper({ fn: ParseSystemKeywordsDuckling, name: 'KeywordService.parseSystemKeywordsDuckling' }).apply(this, arguments);
    }

    parseSystemKeywordsRegex() {

        return TimingWrapper({ fn: ParseSystemKeywordsRegex, name: 'KeywordService.parseSystemKeywordsRegex' }).apply(this, arguments);
    }

    parseSysValue() {

        return TimingWrapper({ fn: ParseSysValue, name: 'KeywordService.parseSysValue' }).apply(this, arguments);
    }

};


