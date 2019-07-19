import {
  MODEL_AGENT,
  MODEL_ACTION,
  MODEL_POST_FORMAT
} from '../../../util/constants';

module.exports = async function ({ actionData, CSO }) {

  const { globalService } = await this.server.services();
  let postFormatPayloadToUse, usedPostFormatAction;

  if ((actionData && actionData.usePostFormat) || CSO.agent.usePostFormat) {
      let modelPath, postFormat;
      if (actionData && actionData.usePostFormat){
          modelPath = [
              {
                  model: MODEL_AGENT,
                  id: CSO.agent.id
              },
              {
                  model: MODEL_ACTION,
                  id: actionData.id
              },
              {
                  model: MODEL_POST_FORMAT
              }
          ];
          usedPostFormatAction = true;
          postFormat = await globalService.findInModelPath({ modelPath, isFindById: false, isSingleResult: true });
      }
      else {
          modelPath = [
              {
                  model: MODEL_AGENT,
                  id: CSO.agent.id
              },
              {
                  model: MODEL_POST_FORMAT
              }
          ];
          usedPostFormatAction = false;
          postFormat = await globalService.findInModelPath({ modelPath, isFindById, isSingleResult, skip, limit, direction, field });
      }
      postFormatPayloadToUse = postFormat.postFormatPayload;
  }
  if (postFormatPayloadToUse) {
      try {
          const compiledPostFormat = handlebars.compile(postFormatPayloadToUse);
          const processedPostFormat = compiledPostFormat({ ...CSO, ...{ textResponse: CSO.cleanResponse.textResponse } });
          const processedPostFormatJson = JSON.parse(processedPostFormat);

          allProcessedPostFormat = { ...allProcessedPostFormat, ...processedPostFormatJson };
          CSO.finalResponse = { ...CSO.cleanResponse, ...processedPostFormatJson };
      }
      catch (error) {
          const errorMessage = usedPostFormatAction ? 'Error formatting the post response using action POST format : ' : 'Error formatting the post response using agent POST format : ';
          console.error(errorMessage, error);
          const responseWithError = { ...{ postFormatting: errorMessage + error }, cleanResponse: CSO.cleanResponse };
          CSO.finalResponse = responseWithError;
      }
  }
  else {
    CSO.finalResponse = CSO.cleanResponse;
  }
};