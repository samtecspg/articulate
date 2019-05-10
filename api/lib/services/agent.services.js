import Schmervice from 'schmervice';
import ConverseFulfillEmptySlotsWithSavedValues from './agent/agent-converse-fulfill-empty-slots-with-saved-values.service';
import ConverseCallWebhook from './agent/agent.converse-call-webhook.service';
import ConverseCompileResponseTemplates from './agent/agent.converse-compile-response-templates.service';
import ConverseGenerateResponseFallback from './agent/agent.converse-generate-response-fallback.service';
import ConverseGenerateResponse from './agent/agent.converse-generate-response.service';
import ConverseUpdateContextFrames from './agent/agent.converse-update-context-frames.service';
import Converse from './agent/agent.converse.service';
import CreateAction from './agent/agent.create-action.service';
import CreateCategory from './agent/agent.create-category.service';
import ImportCategory from './agent/agent.import-category.service';
import CreateKeyword from './agent/agent.create-keyword.service';
import CreatePostFormat from './agent/agent.create-post-format.service';
import CreateWebhook from './agent/agent.create-webhook.service';
import Create from './agent/agent.create.service';
import Export from './agent/agent.export.service';
import FindAllDocuments from './agent/agent.find-all-documents.service';
import FindAllSayings from './agent/agent.find-all-sayings.service';
import FindAllSettings from './agent/agent.find-all-settings.service';
import FindSettingByName from './agent/agent.find-setting-by-name.service';
import GetTrainedCategories from './agent/agent.get-trained-categories.service';
import Import from './agent/agent.import.service';
import IsModelUnique from './agent/agent.is-model-unique.service';
import ParseDucklingKeywords from './agent/agent.parse-duckling-keywords.service';
import ParseRasaKeywords from './agent/agent.parse-rasa-keywords.service';
import ParseRegexKeywords from './agent/agent.parse-regex-keywords.service';
import Parse from './agent/agent.parse.service';
import IdentifyKeywords from './agent/agent.identify-keywords.service';
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

        return await Create.apply(this, arguments);
    }

    async remove() {

        return await Remove.apply(this, arguments);
    }

    async createCategory() {

        return await CreateCategory.apply(this, arguments);
    }

    async importCategory() {

        return await ImportCategory.apply(this, arguments);
    }

    async createAction() {

        return await CreateAction.apply(this, arguments);
    }

    async updateAction() {

        return await UpdateAction.apply(this, arguments);
    }

    async createKeyword() {

        return await CreateKeyword.apply(this, arguments);
    }

    async createPostFormat() {

        return await CreatePostFormat.apply(this, arguments);
    }

    async upsertPostFormatInAction() {

        return await UpsertPostFormatInAction.apply(this, arguments);
    }

    async updateById() {

        return await UpdateById.apply(this, arguments);
    }

    async removePostFormat() {

        return await RemovePostFormat.apply(this, arguments);
    }

    async removeWebhook() {

        return await RemoveWebhook.apply(this, arguments);
    }

    async updatePostFormat() {

        return await UpdatePostFormat.apply(this, arguments);
    }

    async createWebhook() {

        return await CreateWebhook.apply(this, arguments);
    }

    async findAllSayings() {

        return await FindAllSayings.apply(this, arguments);
    }

    async findAllSettings() {

        return await FindAllSettings.apply(this, arguments);
    }

    async findSettingByName() {

        return await FindSettingByName.apply(this, arguments);
    }

    async updateAllSettings() {

        return await UpdateAllSettings.apply(this, arguments);
    }

    async upsertSayingInCategory() {

        return await UpsertSayingInCategory.apply(this, arguments);
    }

    async updateKeyword() {

        return await UpdateKeyword.apply(this, arguments);
    }

    async updateCategory() {

        return await UpdateCategory.apply(this, arguments);
    }

    async upsertWebhookInAction() {

        return await UpsertWebhookInAction.apply(this, arguments);
    }

    async removeWebhookInAction() {

        return await RemoveWebhookInAction.apply(this, arguments);
    }

    async removePostFormatInAction() {

        return await RemovePostFormatInAction.apply(this, arguments);
    }

    async removeAction() {

        return await RemoveAction.apply(this, arguments);
    }

    async removeSayingInCategory() {

        return await RemoveSayingInCategory.apply(this, arguments);
    }

    async removeCategory() {

        return await RemoveCategory.apply(this, arguments);
    }

    async removeKeyword() {

        return await RemoveKeyword.apply(this, arguments);
    }

    async export() {

        return await Export.apply(this, arguments);
    }

    async import() {

        return await Import.apply(this, arguments);
    }

    async trainCategory() {

        return await TrainCategory.apply(this, arguments);
    }

    async train() {

        return await Train.apply(this, arguments);
    }

    async parse() {

        return await Parse.apply(this, arguments);
    }

    async parseRegexKeywords() {

        return await ParseRegexKeywords.apply(this, arguments);
    }

    async parseDucklingKeywords() {

        return await ParseDucklingKeywords.apply(this, arguments);
    }

    async parseRasaKeywords() {

        return await ParseRasaKeywords.apply(this, arguments);
    }

    async identifyKeywords() {
        
        return await IdentifyKeywords.apply(this, arguments);
    }

    async getTrainedCategories() {

        return await GetTrainedCategories.apply(this, arguments);
    }

    async updateWebhook() {

        return await UpdateWebhook.apply(this, arguments);
    }

    async converse() {

        return await Converse.apply(this, arguments);
    }

    async converseGenerateResponseFallback() {

        return await ConverseGenerateResponseFallback.apply(this, arguments);
    }

    async converseGenerateResponse() {

        return await ConverseGenerateResponse.apply(this, arguments);
    }

    async converseUpdateContextFrames() {

        return await ConverseUpdateContextFrames.apply(this, arguments);
    }

    async converseCompileResponseTemplates() {

        return await ConverseCompileResponseTemplates.apply(this, arguments);
    }

    async converseCallWebhook() {

        return await ConverseCallWebhook.apply(this, arguments);
    }

    async converseFulfillEmptySlotsWithSavedValues() {

        return await ConverseFulfillEmptySlotsWithSavedValues.apply(this, arguments);
    }

    async isModelUnique() {

        return await IsModelUnique.apply(this, arguments);
    }

    async findAllDocuments() {

        return await FindAllDocuments.apply(this, arguments);
    }
};


