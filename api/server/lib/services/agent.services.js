/* eslint-disable prefer-arrow-callback */
import Schmervice from 'schmervice';
import TimingWrapper from '../../util/service-timing-wrapper';
import ConverseFulfillEmptySlotsWithSavedValues from './agent/agent-converse-fulfill-empty-slots-with-saved-values.service';
import ConverseCallWebhook from './agent/agent.converse-call-webhook.service';
import ConverseCompileResponseTemplates from './agent/agent.converse-compile-response-templates.service';
import ConverseGenerateResponseFallback from './agent/agent.converse-generate-response-fallback.service';
import ConverseGenerateResponse from './agent/agent.converse-generate-response.service';
import ConverseUpdateContextFrames from './agent/agent.converse-update-context-frames.service';
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
import FindAllSettings from './agent/agent.find-all-settings.service';
import FindSettingByName from './agent/agent.find-setting-by-name.service';
import GetTrainedCategories from './agent/agent.get-trained-categories.service';
import Import from './agent/agent.import.service';
import IsModelUnique from './agent/agent.is-model-unique.service';
import ParseDucklingKeywords from './agent/agent.parse-duckling-keywords.service';
import ParseRasaKeywords from './agent/agent.parse-rasa-keywords.service';
import ParseRegexKeywords from './agent/agent.parse-regex-keywords.service';
import Parse from './agent/agent.parse.service';
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

        return await TimingWrapper({ fn: Create, name: 'AgentService.create' }).apply(this, arguments);
    }

    async remove() {

        return await TimingWrapper({ fn: Remove, name: 'AgentService.remove' }).apply(this, arguments);
    }

    async createCategory() {

        return await TimingWrapper({ fn: CreateCategory, name: 'AgentService.createCategory' }).apply(this, arguments);
    }

    async createAction() {

        return await TimingWrapper({ fn: CreateAction, name: 'AgentService.createAction' }).apply(this, arguments);
    }

    async updateAction() {

        return await TimingWrapper({ fn: UpdateAction, name: 'AgentService.updateAction' }).apply(this, arguments);
    }

    async createKeyword() {

        return await TimingWrapper({ fn: CreateKeyword, name: 'AgentService.createKeyword' }).apply(this, arguments);
    }

    async createPostFormat() {

        return await TimingWrapper({ fn: CreatePostFormat, name: 'AgentService.createPostFormat' }).apply(this, arguments);
    }

    async upsertPostFormatInAction() {

        return await TimingWrapper({ fn: UpsertPostFormatInAction, name: 'AgentService.upsertPostFormatInAction' }).apply(this, arguments);
    }

    async updateById() {

        return await TimingWrapper({ fn: UpdateById, name: 'AgentService.updateById' }).apply(this, arguments);
    }

    async removePostFormat() {

        return await TimingWrapper({ fn: RemovePostFormat, name: 'AgentService.removePostFormat' }).apply(this, arguments);
    }

    async removeWebhook() {

        return await TimingWrapper({ fn: RemoveWebhook, name: 'AgentService.removeWebhook' }).apply(this, arguments);
    }

    async updatePostFormat() {

        return await TimingWrapper({ fn: UpdatePostFormat, name: 'AgentService.updatePostFormat' }).apply(this, arguments);
    }

    async createWebhook() {

        return await TimingWrapper({ fn: CreateWebhook, name: 'AgentService.createWebhook' }).apply(this, arguments);
    }

    async findAllSayings() {

        return await TimingWrapper({ fn: FindAllSayings, name: 'AgentService.findAllSayings' }).apply(this, arguments);
    }

    async findAllSettings() {

        return await TimingWrapper({ fn: FindAllSettings, name: 'AgentService.findAllSettings' }).apply(this, arguments);
    }

    async findSettingByName() {

        return await TimingWrapper({ fn: FindSettingByName, name: 'AgentService.findSettingByName' }).apply(this, arguments);
    }

    async updateAllSettings() {

        return await TimingWrapper({ fn: UpdateAllSettings, name: 'AgentService.updateAllSettings' }).apply(this, arguments);
    }

    async upsertSayingInCategory() {

        return await TimingWrapper({ fn: UpsertSayingInCategory, name: 'AgentService.upsertSayingInCategory' }).apply(this, arguments);
    }

    async updateKeyword() {

        return await TimingWrapper({ fn: UpdateKeyword, name: 'AgentService.updateKeyword' }).apply(this, arguments);
    }

    async updateCategory() {

        return await TimingWrapper({ fn: UpdateCategory, name: 'AgentService.updateCategory' }).apply(this, arguments);
    }

    async upsertWebhookInAction() {

        return await TimingWrapper({ fn: UpsertWebhookInAction, name: 'AgentService.upsertWebhookInAction' }).apply(this, arguments);
    }

    async removeWebhookInAction() {

        return await TimingWrapper({ fn: RemoveWebhookInAction, name: 'AgentService.removeWebhookInAction' }).apply(this, arguments);
    }

    async removePostFormatInAction() {

        return await TimingWrapper({ fn: RemovePostFormatInAction, name: 'AgentService.removePostFormatInAction' }).apply(this, arguments);
    }

    async removeAction() {

        return await TimingWrapper({ fn: RemoveAction, name: 'AgentService.removeAction' }).apply(this, arguments);

    }

    async removeSayingInCategory() {

        return await TimingWrapper({ fn: RemoveSayingInCategory, name: 'AgentService.removeSayingInCategory' }).apply(this, arguments);

    }

    async removeCategory() {

        return await TimingWrapper({ fn: RemoveCategory, name: 'AgentService.removeCategory' }).apply(this, arguments);
    }

    async removeKeyword() {

        return await TimingWrapper({ fn: RemoveKeyword, name: 'AgentService.removeKeyword' }).apply(this, arguments);
    }

    async export() {

        return await TimingWrapper({ fn: Export, name: 'AgentService.export' }).apply(this, arguments);

    }

    async import() {

        return await TimingWrapper({ fn: Import, name: 'AgentService.import' }).apply(this, arguments);
    }

    async trainCategory() {

        return await TimingWrapper({ fn: TrainCategory, name: 'AgentService.trainCategory' }).apply(this, arguments);
    }

    async train() {

        return await TimingWrapper({ fn: Train, name: 'AgentService.train' }).apply(this, arguments);
    }

    async parse() {

        return await TimingWrapper({ fn: Parse, name: 'AgentService.parse' }).apply(this, arguments);
    }

    async parseRegexKeywords() {

        return await TimingWrapper({ fn: ParseRegexKeywords, name: 'AgentService.parseRegexKeywords' }).apply(this, arguments);
    }

    async parseDucklingKeywords() {

        return await TimingWrapper({ fn: ParseDucklingKeywords, name: 'AgentService.parseDucklingKeywords' }).apply(this, arguments);
    }

    async parseRasaKeywords() {

        return await TimingWrapper({ fn: ParseRasaKeywords, name: 'AgentService.parseRasaKeywords' }).apply(this, arguments);
    }

    async getTrainedCategories() {

        return await TimingWrapper({ fn: GetTrainedCategories, name: 'AgentService.getTrainedCategories' }).apply(this, arguments);
    }

    async updateWebhook() {

        return await TimingWrapper({ fn: UpdateWebhook, name: 'AgentService.updateWebhook' }).apply(this, arguments);
    }

    async converse() {

        return await TimingWrapper({ fn: Converse, name: 'AgentService.converse' }).apply(this, arguments);
    }

    async converseGenerateResponseFallback() {

        return await TimingWrapper({ fn: ConverseGenerateResponseFallback, name: 'AgentService.converseGenerateResponseFallback' }).apply(this, arguments);
    }

    async converseGenerateResponse() {

        return await TimingWrapper({ fn: ConverseGenerateResponse, name: 'AgentService.converseGenerateResponse' }).apply(this, arguments);
    }

    async converseUpdateContextFrames() {

        return await TimingWrapper({ fn: ConverseUpdateContextFrames, name: 'AgentService.converseUpdateContextFrames' }).apply(this, arguments);
    }

    async converseCompileResponseTemplates() {

        return await TimingWrapper({ fn: ConverseCompileResponseTemplates, name: 'AgentService.converseCompileResponseTemplates' }).apply(this, arguments);
    }

    async converseCallWebhook() {

        return await TimingWrapper({ fn: ConverseCallWebhook, name: 'AgentService.converseCallWebhook' }).apply(this, arguments);
    }

    async converseFulfillEmptySlotsWithSavedValues() {

        return await TimingWrapper({ fn: ConverseFulfillEmptySlotsWithSavedValues, name: 'AgentService.converseFulfillEmptySlotsWithSavedValues' }).apply(this, arguments);

    }

    async isModelUnique() {

        return await TimingWrapper({ fn: IsModelUnique, name: 'AgentService.isModelUnique' }).apply(this, arguments);
    }

    async findAllDocuments() {

        return await TimingWrapper({ fn: FindAllDocuments, name: 'AgentService.findAllDocuments' }).apply(this, arguments);
    }
};
