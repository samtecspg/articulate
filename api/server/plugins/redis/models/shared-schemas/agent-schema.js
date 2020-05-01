export const agentSchema = {
    gravatar: {
        type: 'number'
    },
    uiColor: {
        type: 'string',
    },
    agentName: {
        type: 'string',
        unique: true,
        index: true,
        defaultSort: true
    },
    description: {
        type: 'string',
        index: true
    },
    language: {
        type: 'string'
    },
    timezone: {
        type: 'string'
    },
    useWebhook: {
        type: 'boolean'
    },
    usePostFormat: {
        type: 'boolean'
    },
    multiCategory: {
        type: 'boolean'
    },
    categoryClassifierThreshold: {
        type: 'float'
    },
    fallbackAction: {
        type: 'string'
    },
    welcomeAction: {
        type: 'string'
    },
    status: {
        type: 'string'
    },
    lastTraining: {
        type: 'string'
    },
    extraTrainingData: {
        type: 'boolean'
    },
    enableModelsPerCategory: {
        type: 'boolean'
    },
    model: {
        type: 'string'
    },
    parameters: {
        type: 'json'
    },
    settings: {
        type: 'json'
    },
    categoryRecognizer: {
        type: 'boolean',
        defaultValue: false
    },
    modifiersRecognizer: {
        type: 'boolean',
        defaultValue: false
    },
    modifiersRecognizerJustER: {
        type: 'string',
        defaultValue: ''
    },
    creationDate: {
        type: 'timestamp'
    },
    modificationDate: {
        type: 'timestamp'
    },
    enableDiscoverySheet: {
        type: 'boolean',
        defaultValue: false
    },
    enableAgentVersions: {
        type: 'boolean',
        defaultValue: false
    },
    accessPolicies: {
        type: 'json',
        defaultValue: {}
    },
    isOriginalAgentVersion: {
        type: 'boolean',
        defaultValue: true
    },
    originalAgentVersionId: {
        type: 'number',
        defaultValue: -1
    },
    originalAgentVersionName: {
        type: 'string',
        defaultValue: ''
    },
    agentVersionNotes: {
        type: 'string',
        defaultValue: ''
    },
    loadedAgentVersionName: {
        type: 'string',
        defaultValue: ''
    },
    currentAgentVersionCounter: {
        type: 'number',
        defaultValue: 0
    }
};