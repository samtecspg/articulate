'use strict';

const nluIndexexStructures = [
    {
        'name': 'agent',
        'mappings': {
            'default': {
                'properties': {
                    'agentName': {
                        'type': 'keyword'
                    },
                    'domainClassifierThreshold': {
                        'type': 'float'
                    },
                    'fallbackResponses': {
                        'type': 'text',
                        'fields': {
                            'keyword': {
                                'type': 'keyword',
                                'ignore_above': 256
                            }
                        }
                    },
                    'useWebhookFallback': {
                        'type': 'boolean'
                    },
                    'webhookFallbackUrl': {
                        'type': 'text',
                        'fields': {
                            'keyword': {
                                'type': 'keyword',
                                'ignore_above': 256
                            }
                        }
                    },
                    'webhookUrl': {
                        'type': 'text',
                        'fields': {
                            'keyword': {
                                'type': 'keyword',
                                'ignore_above': 256
                            }
                        }
                    }
                }
            }
        }
    },
    {
        'name': 'domain',
        'mappings': {
            'default': {
                'properties': {
                    'agent': {
                        'type': 'keyword'
                    },
                    'enabled': {
                        'type': 'boolean'
                    },
                    'intentThreshold': {
                        'type': 'float'
                    },
                    'domainName': {
                        'type': 'keyword'
                    },
                    'lastTraining': {
                        'type': 'date'
                    }
                }
            }
        }
    },
    {
        'name': 'entity',
        'mappings': {
            'default': {
                'properties': {
                    'agent': {
                        'type': 'keyword'
                    },
                    'entityName': {
                        'type': 'keyword'
                    },
                    'examples': {
                        'properties': {
                            'synonyms': {
                                'type': 'text',
                                'fields': {
                                    'keyword': {
                                        'type': 'keyword',
                                        'ignore_above': 256
                                    }
                                }
                            },
                            'value': {
                                'type': 'text',
                                'fields': {
                                    'keyword': {
                                        'type': 'keyword',
                                        'ignore_above': 256
                                    }
                                }
                            }
                        }
                    },
                    'usedBy': {
                        'type': 'keyword'
                    }
                }
            }
        }
    },
    {
        'name': 'intent',
        'mappings': {
            'default': {
                'properties': {
                    'agent': {
                        'type': 'keyword'
                    },
                    'domain': {
                        'type': 'keyword'
                    },
                    'examples': {
                        'properties': {
                            'entities': {
                                'properties': {
                                    'end': {
                                        'type': 'long'
                                    },
                                    'entity': {
                                        'type': 'keyword'
                                    },
                                    'start': {
                                        'type': 'long'
                                    },
                                    'value': {
                                        'type': 'text',
                                        'fields': {
                                            'keyword': {
                                                'type': 'keyword',
                                                'ignore_above': 256
                                            }
                                        }
                                    }
                                }
                            },
                            'userSays': {
                                'type': 'text',
                                'fields': {
                                    'keyword': {
                                        'type': 'keyword',
                                        'ignore_above': 256
                                    }
                                }
                            }
                        }
                    },
                    'intentName': {
                        'type': 'keyword'
                    }
                }
            }
        }
    },
    {
        'name': 'scenario',
        'mappings': {
            'default': {
                'properties': {
                    'agent': {
                        'type': 'keyword'
                    },
                    'domain': {
                        'type': 'keyword'
                    },
                    'fallback': {
                        'type': 'text',
                        'fields': {
                            'keyword': {
                                'type': 'keyword',
                                'ignore_above': 256
                            }
                        }
                    },
                    'intent': {
                        'type': 'keyword'
                    },
                    'intentResponses': {
                        'type': 'text',
                        'fields': {
                            'keyword': {
                                'type': 'keyword',
                                'ignore_above': 256
                            }
                        }
                    },
                    'scenarioName': {
                        'type': 'keyword'
                    },
                    'slots': {
                        'properties': {
                            'slotName': {
                                'type': 'keyword'
                            },
                            'entity': {
                                'type': 'keyword'
                            },
                            'isList': {
                                'type': 'boolean'
                            },
                            'isRequired': {
                                'type': 'boolean'
                            },
                            'textPrompts': {
                                'type': 'text',
                                'fields': {
                                    'keyword': {
                                        'type': 'keyword',
                                        'ignore_above': 256
                                    }
                                }
                            },
                            'useWebhook': {
                                'type': 'boolean'
                            }
                        }
                    },
                    'useWebhook': {
                        'type': 'boolean'
                    },
                    'webhookUrl': {
                        'type': 'text',
                        'fields': {
                            'keyword': {
                                'type': 'keyword',
                                'ignore_above': 256
                            }
                        }
                    }
                }
            }
        }
    }
];

module.exports = nluIndexexStructures;
