module.exports = async function ({ CSO }) {

    const { agentService } = await this.server.services();

    //we are going to store the best rasa result here
    let rasaResult = {};

    //This is the highest ranked result (If it is multicategory the is the highest ranked category)
    const recognizedCategory = CSO.parse[0];

    //In case the agent is a multi category
    if (CSO.agent.multiCategory) {
        //MARK: if there is more than one category and the highest ranked category exceeds the agent.categoryClassifierThreshold then return it
        if (CSO.parse.length > 0 && recognizedCategory.categoryScore > CSO.agent.categoryClassifierThreshold) {
            rasaResult = recognizedCategory;
        }
        else {
            //MARK: if there is only one then return it
            if (CSO.parse.length === 1) {
                rasaResult = recognizedCategory;
            }
            //MARK: If none category was ranked over the threshold, then collect all keywords from all results
            //MARK: but this will have a different structure?
            else {
                rasaResult.keywords = await agentService.converseGetKeywordsFromRasaResults({ rasaResults: CSO.parse });
            }
        }
    }
    else {
        //If the agent is not multicategory, then just simply return the highest ranked result in rasa
        rasaResult = recognizedCategory;
    }

    return rasaResult;
};