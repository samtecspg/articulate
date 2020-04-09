import Schmervice from 'schmervice';
import TimingWrapper from '../../util/service-timing-wrapper';
import ConverseCallWebhook from './agent/agent.converse-call-webhook.service';
import ConverseCompileResponseTemplates from './agent/agent.converse-compile-response-templates.service';
import ConverseCompileRichResponsesTemplates from './agent/agent.converse-compile-rich-responses-templates.service';
import ConverseFillActionSlots from './agent/agent.converse-fill-action-slots.service';
import ConverseFulfillEmptySlotsWithSavedValues from './agent/agent.converse-fulfill-empty-slots-with-saved-values.service';
import ConverseGenerateResponseFallback from './agent/agent.converse-generate-response-fallback.service';
import ConverseGenerateResponseWelcome from './agent/agent.converse-generate-response-welcome.service';
import ConverseGenerateResponse from './agent/agent.converse-generate-response.service';
import ConverseGetBestRasaResult from './agent/agent.converse-get-best-rasa-result.service';
import ConverseGetKeywordsFromRasaResults from './agent/agent.converse-get-keywords-from-rasa-results';
import ConverseMostRecentActionShoulBeIgnored from './agent/agent.converse-most-recent-action-should-be-ignored.service';
import ConverseProcessPostFormat from './agent/agent.converse-process-post-format';
import ConverseSendResponseToUbiquity from './agent/agent.converse-send-response-to-ubiquity';
import Converse from './agent/agent.converse.service';
import CreateAction from './agent/agent.create-action.service';
import CreateCategory from './agent/agent.create-category.service';
import CreateKeyword from './agent/agent.create-keyword.service';
import CreatePostFormat from './agent/agent.create-post-format.service';
import CreateWebhook from './agent/agent.create-webhook.service';
import Create from './agent/agent.create.service';
import Export from './agent/agent.export.service';
import FindAllDocuments from './agent/agent.find-all-documents.service';
import FindAllSayings from './agent/agent.find-all-sayings.service';
import FindAllSessions from './agent/agent.find-all-sessions.service';
import FindAllSettings from './agent/agent.find-all-settings.service';
import FindSettingByName from './agent/agent.find-setting-by-name.service';
import GetTrainedCategories from './agent/agent.get-trained-categories.service';
import IdentifyKeywords from './agent/agent.identify-keywords.service';
import ImportCategory from './agent/agent.import-category.service';
import Import from './agent/agent.import.service';
import IsModelUnique from './agent/agent.is-model-unique.service';
import ParseDucklingKeywords from './agent/agent.parse-duckling-keywords.service';
import ParseRasaKeywords from './agent/agent.parse-rasa-keywords.service';
import ParseRegexKeywords from './agent/agent.parse-regex-keywords.service';
import Parse from './agent/agent.parse.service';
import RecognizeUpdatedKeywords from './agent/agent.recognize-updated-keywords.service';
import RemoveAction from './agent/agent.remove-action.service';
import RemoveCategory from './agent/agent.remove-category.service';
import RemoveKeyword from './agent/agent.remove-keyword.service';
import RemovePostFormatInAction from './agent/agent.remove-post-format-in-action.service';
import RemovePostFormat from './agent/agent.remove-post-format.service';
import RemoveSayingInCategory from './agent/agent.remove-saying-in-category.service';
import RemoveWebhookInAction from './agent/agent.remove-webhook-in-action.service';
import RemoveWebhook from './agent/agent.remove-webhook.service';
import Remove from './agent/agent.remove.service';
import TrainCategory from './agent/agent.train-category.service';
import Train from './agent/agent.train.service';
import UpdateAction from './agent/agent.update-action.service';
import UpdateAllSettings from './agent/agent.update-all-settings.service';
import UpdateById from './agent/agent.update-by-id.service';
import UpdateCategory from './agent/agent.update-category.service';
import UpdateKeyword from './agent/agent.update-keyword.service';
import UpdatePostFormat from './agent/agent.update-post-format.service';
import UpdateWebhook from './agent/agent.update-webhook.service';
import UpsertPostFormatInAction from './agent/agent.upsert-post-format-in-action.service';
import UpsertSayingInCategory from './agent/agent.upsert-saying-in-category.service';
import UpsertWebhookInAction from './agent/agent.upsert-webhook-in-action.service';

module.exports = class AgentService extends Schmervice.Service {

    async create() {
        return await TimingWrapper({ cls: this, fn: Create, name: 'Create' }).apply(this, arguments);
    }

    async remove() {
        return await TimingWrapper({ cls: this, fn: Remove, name: 'Remove' }).apply(this, arguments);
    }

    async createCategory() {
        return await TimingWrapper({ cls: this, fn: CreateCategory, name: 'CreateCategory' }).apply(this, arguments);
    }

    async importCategory() {
        return await TimingWrapper({ cls: this, fn: ImportCategory, name: 'ImportCategory' }).apply(this, arguments);
    }

    async createAction() {
        return await TimingWrapper({ cls: this, fn: CreateAction, name: 'CreateAction' }).apply(this, arguments);
    }

    async updateAction() {
        return await TimingWrapper({ cls: this, fn: UpdateAction, name: 'UpdateAction' }).apply(this, arguments);
    }

    async createKeyword() {
        return await TimingWrapper({ cls: this, fn: CreateKeyword, name: 'CreateKeyword' }).apply(this, arguments);
    }

    async createPostFormat() {
        return await TimingWrapper({ cls: this, fn: CreatePostFormat, name: 'CreatePostFormat' }).apply(this, arguments);
    }

    async upsertPostFormatInAction() {
        return await TimingWrapper({ cls: this, fn: UpsertPostFormatInAction, name: 'UpsertPostFormatInAction' }).apply(this, arguments);
    }

    async updateById() {
        return await TimingWrapper({ cls: this, fn: UpdateById, name: 'UpdateById' }).apply(this, arguments);
    }

    async removePostFormat() {
        return await TimingWrapper({ cls: this, fn: RemovePostFormat, name: 'RemovePostFormat' }).apply(this, arguments);
    }

    async removeWebhook() {
        return await TimingWrapper({ cls: this, fn: RemoveWebhook, name: 'RemoveWebhook' }).apply(this, arguments);
    }

    async updatePostFormat() {
        return await TimingWrapper({ cls: this, fn: UpdatePostFormat, name: 'UpdatePostFormat' }).apply(this, arguments);
    }

    async createWebhook() {
        return await TimingWrapper({ cls: this, fn: CreateWebhook, name: 'CreateWebhook' }).apply(this, arguments);
    }

    async findAllSayings() {
        return await TimingWrapper({ cls: this, fn: FindAllSayings, name: 'FindAllSayings' }).apply(this, arguments);
    }

    async findAllSettings() {
        return await TimingWrapper({ cls: this, fn: FindAllSettings, name: 'FindAllSettings' }).apply(this, arguments);
    }

    async findSettingByName() {
        return await TimingWrapper({ cls: this, fn: FindSettingByName, name: 'FindSettingByName' }).apply(this, arguments);
    }

    async updateAllSettings() {
        return await TimingWrapper({ cls: this, fn: UpdateAllSettings, name: 'UpdateAllSettings' }).apply(this, arguments);
    }

    async upsertSayingInCategory() {
        return await TimingWrapper({ cls: this, fn: UpsertSayingInCategory, name: 'UpsertSayingInCategory' }).apply(this, arguments);
    }

    async updateKeyword() {
        return await TimingWrapper({ cls: this, fn: UpdateKeyword, name: 'UpdateKeyword' }).apply(this, arguments);
    }

    async updateCategory() {
        return await TimingWrapper({ cls: this, fn: UpdateCategory, name: 'UpdateCategory' }).apply(this, arguments);
    }

    async upsertWebhookInAction() {
        return await TimingWrapper({ cls: this, fn: UpsertWebhookInAction, name: 'UpsertWebhookInAction' }).apply(this, arguments);
    }

    async removeWebhookInAction() {
        return await TimingWrapper({ cls: this, fn: RemoveWebhookInAction, name: 'RemoveWebhookInAction' }).apply(this, arguments);
    }

    async removePostFormatInAction() {
        return await TimingWrapper({ cls: this, fn: RemovePostFormatInAction, name: 'RemovePostFormatInAction' }).apply(this, arguments);
    }

    async removeAction() {
        return await TimingWrapper({ cls: this, fn: RemoveAction, name: 'RemoveAction' }).apply(this, arguments);
    }

    async removeSayingInCategory() {
        return await TimingWrapper({ cls: this, fn: RemoveSayingInCategory, name: 'RemoveSayingInCategory' }).apply(this, arguments);
    }

    async removeCategory() {
        return await TimingWrapper({ cls: this, fn: RemoveCategory, name: 'RemoveCategory' }).apply(this, arguments);
    }

    async removeKeyword() {
        return await TimingWrapper({ cls: this, fn: RemoveKeyword, name: 'RemoveKeyword' }).apply(this, arguments);
    }

    async export() {
        return await TimingWrapper({ cls: this, fn: Export, name: 'Export' }).apply(this, arguments);
    }

    async import() {
        return await TimingWrapper({ cls: this, fn: Import, name: 'Import' }).apply(this, arguments);
    }

    async trainCategory() {
        return await TimingWrapper({ cls: this, fn: TrainCategory, name: 'TrainCategory' }).apply(this, arguments);
    }

    async train() {
        return await TimingWrapper({ cls: this, fn: Train, name: 'Train' }).apply(this, arguments);
    }

    async parse() {
        return await TimingWrapper({ cls: this, fn: Parse, name: 'Parse' }).apply(this, arguments);
    }

    async parseRegexKeywords() {
        return await TimingWrapper({ cls: this, fn: ParseRegexKeywords, name: 'ParseRegexKeywords' }).apply(this, arguments);
    }

    async parseDucklingKeywords() {
        return await TimingWrapper({ cls: this, fn: ParseDucklingKeywords, name: 'ParseDucklingKeywords' }).apply(this, arguments);
    }

    async parseRasaKeywords() {
        return await TimingWrapper({ cls: this, fn: ParseRasaKeywords, name: 'ParseRasaKeywords' }).apply(this, arguments);
    }

    async identifyKeywords() {
        return await TimingWrapper({ cls: this, fn: IdentifyKeywords, name: 'IdentifyKeywords' }).apply(this, arguments);
    }

    async recognizeUpdatedKeywords() {
        return await TimingWrapper({ cls: this, fn: RecognizeUpdatedKeywords, name: 'RecognizeUpdatedKeywords' }).apply(this, arguments);
    }

    async getTrainedCategories() {
        return await TimingWrapper({ cls: this, fn: GetTrainedCategories, name: 'GetTrainedCategories' }).apply(this, arguments);
    }

    async updateWebhook() {
        return await TimingWrapper({ cls: this, fn: UpdateWebhook, name: 'UpdateWebhook' }).apply(this, arguments);
    }

    async converse() {
        return await TimingWrapper({ cls: this, fn: Converse, name: 'Converse' }).apply(this, arguments);
    }

    async converseGenerateResponseFallback() {
        return await TimingWrapper({ cls: this, fn: ConverseGenerateResponseFallback, name: 'ConverseGenerateResponseFallback' }).apply(this, arguments);
    }

    async converseGenerateResponseWelcome() {
        return await TimingWrapper({ cls: this, fn: ConverseGenerateResponseWelcome, name: 'ConverseGenerateResponseWelcome' }).apply(this, arguments);
    }

    async converseGenerateResponse() {
        return await TimingWrapper({ cls: this, fn: ConverseGenerateResponse, name: 'ConverseGenerateResponse' }).apply(this, arguments);
    }

    async converseCompileResponseTemplates() {
        return await TimingWrapper({ cls: this, fn: ConverseCompileResponseTemplates, name: 'ConverseCompileResponseTemplates' }).apply(this, arguments);
    }

    async converseCompileRichResponsesTemplates() {
        return await TimingWrapper({ cls: this, fn: ConverseCompileRichResponsesTemplates, name: 'ConverseCompileRichResponsesTemplates' }).apply(this, arguments);
    }

    async converseCallWebhook() {
        return await TimingWrapper({ cls: this, fn: ConverseCallWebhook, name: 'ConverseCallWebhook' }).apply(this, arguments);
    }

    async converseFulfillEmptySlotsWithSavedValues() {
        return await TimingWrapper({ cls: this, fn: ConverseFulfillEmptySlotsWithSavedValues, name: 'ConverseFulfillEmptySlotsWithSavedValues' }).apply(this, arguments);
    }

    async converseGetKeywordsFromRasaResults() {
        return await TimingWrapper({ cls: this, fn: ConverseGetKeywordsFromRasaResults, name: 'ConverseGetKeywordsFromRasaResults' }).apply(this, arguments);
    }

    async converseGetBestRasaResult() {
        return await TimingWrapper({ cls: this, fn: ConverseGetBestRasaResult, name: 'ConverseGetBestRasaResult' }).apply(this, arguments);
    }

    async converseFillActionSlots() {
        return await TimingWrapper({ cls: this, fn: ConverseFillActionSlots, name: 'ConverseFillActionSlots' }).apply(this, arguments);
    }

    async converseSendResponseToUbiquity() {
        return await TimingWrapper({ cls: this, fn: ConverseSendResponseToUbiquity, name: 'ConverseSendResponseToUbiquity' }).apply(this, arguments);
    }

    async converseProcessPostFormat() {
        return await TimingWrapper({ cls: this, fn: ConverseProcessPostFormat, name: 'ConverseProcessPostFormat' }).apply(this, arguments);
    }

    async converseMostRecentActionShoulBeIgnored() {
        return await TimingWrapper({ cls: this, fn: ConverseMostRecentActionShoulBeIgnored, name: 'ConverseMostRecentActionShoulBeIgnored' }).apply(this, arguments);
    }

    async isModelUnique() {
        return await TimingWrapper({ cls: this, fn: IsModelUnique, name: 'IsModelUnique' }).apply(this, arguments);
    }

    async findAllDocuments() {
        return await TimingWrapper({ cls: this, fn: FindAllDocuments, name: 'FindAllDocuments' }).apply(this, arguments);
    }

    async findAllSessions() {
        return await TimingWrapper({ cls: this, fn: FindAllSessions, name: 'FindAllSessions' }).apply(this, arguments);
    }
};


