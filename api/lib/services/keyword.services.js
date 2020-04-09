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
        return await TimingWrapper({ cls: this, fn: Create, name: 'Create' }).apply(this, arguments);
    }

    async remove() {
        return await TimingWrapper({ cls: this, fn: Remove, name: 'Remove' }).apply(this, arguments);
    }

    splitAddedOldRemovedIds() {
        return TimingWrapper({ cls: this, fn: SplitAddedOldRemovedIds, name: 'SplitAddedOldRemovedIds' }).apply(this, arguments);
    }

    combinationsFromSayings() {
        return TimingWrapper({ cls: this, fn: CombinationsFromSayings, name: 'CombinationsFromSayings' }).apply(this, arguments);
    }

    parseSystemKeywords() {
        return TimingWrapper({ cls: this, fn: ParseSystemKeywords, name: 'ParseSystemKeywords' }).apply(this, arguments);
    }

    parseSystemKeywordsDuckling() {
        return TimingWrapper({ cls: this, fn: ParseSystemKeywordsDuckling, name: 'ParseSystemKeywordsDuckling' }).apply(this, arguments);
    }

    parseSystemKeywordsRegex() {
        return TimingWrapper({ cls: this, fn: ParseSystemKeywordsRegex, name: 'ParseSystemKeywordsRegex' }).apply(this, arguments);
    }

    parseSysValue() {
        return TimingWrapper({ cls: this, fn: ParseSysValue, name: 'ParseSysValue' }).apply(this, arguments);
    }

};


