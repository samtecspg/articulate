import { MODEL_DOCUMENT } from '../../../../util/constants';
import BaseModel from '../lib/base-model';

const mappings = {
    properties: {
        document: {
            type: 'text'
        },
        time_stamp: {
            type: 'date'
        },
        maximum_action_score: {
            type: 'float'
        },
        maximum_category_score: {
            type: 'float'
        },
        total_elapsed_time_ms: {
            type: 'integer'
        },
        rasa_results: {
            type: 'object'
        },
        recognized_action: {
            type: "keyword"
        },
        session: {
            type: 'keyword'
        },
        agent_id: {
            type: 'integer'
        },
        agent_model: {
            type: 'text'
        },
        converseResult: {
            type: 'nested',
            properties: {
                document: {
                    type: 'text'
                },
                docId: {
                    type: 'text'
                },
                textResponse: {
                    type: 'text'
                },
                actionWasFulfilled: {
                    type: 'boolean'
                },
                actions: {
                    type: 'text'
                },
                quickResponses: {
                    type: 'text'
                },
                richResponses: {
                    type: 'text'
                },
                disableTextResponse: {
                    type: 'boolean'
                },
                responses: {
                    type: 'nested',
                    properties: {
                        docId: {
                            type: 'text'
                        },
                        textResponse: {
                            type: 'text'
                        },
                        fulfilled: {
                            type: 'boolean'
                        },
                        actions: {
                            type: 'text'
                        },
                        quickResponses: {
                            type: 'text'
                        },
                        richResponses: {
                            type: 'text'
                        },
                        disableTextResponse: {
                            type: 'boolean'
                        },
                    }
                },
                CSO: {
                    type: 'nested',
                    properties: {
                        docId: {
                            type: 'text'
                        },
                        context: {
                            type: 'object'
                        },
                        currentAction: {
                            type: 'object'
                        },
                        parse: {
                            type: 'object'
                        },
                        webhooks: {
                            type: 'nested',
                            properties: {
                                response: {
                                    type: 'text'
                                },
                                elapsed_time_ms: {
                                    type: 'integer'
                                },
                                statusCode: {
                                    type: 'integer'
                                }
                            }
                        }
                    }
                }
            }
        }
    }
};

const settings = {
    'index.mapping.total_fields.limit': 5000
};

const getNameForCreate = (name) => {
    var date = new Date();
    var hour = ("0" + date.getHours()).slice(-2);
    var year = date.getFullYear();
    var month = ("0" + date.getMonth()).slice(-2);
    var day = ("0" + date.getDay()).slice(-2);

    return name + '_' + year + month + day + hour;
}

const getNameForSearch = (name) => {
    return '*' + name + '*';
}

module.exports = class DocumentEsModel extends BaseModel {
    constructor({ client }) {

        super({
            name: MODEL_DOCUMENT,
            mappings,
            settings,
            client,
            registerConfiguration: true,
            isMappingTemplate: true,
            getNameForCreate,
            getNameForSearch
        });
    }
};
