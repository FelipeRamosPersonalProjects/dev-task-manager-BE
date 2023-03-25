module.exports = {
    apiResponse: {
        collection: {
            create: (collection) => { return {
                name: 'CollectionCreate',
                message: `Error caught at the document creation on collection "${collection}"!`
            }},

            create_doc_errors: (collection) => { return {
                name: 'CollectionCreateDocErrors',
                message: `There is an issue with the document creation at collection "${collection}"!`
            }},

            delete: () => { return {
                name: 'CollectionDelete',
                message: `Error caught deleting a document at endpoint "collection/delete"!`
            }},
            
            get: {
                doc: () => { return {
                    name: 'CollectionGetDoc',
                    message: `Error caught getting a document at endpoint "collection/get/doc"!`
                }},

                query_collection: () => { return {
                    name: 'CollectionGetQueryCollection',
                    message: `Error caught getting a query collection at endpoint "collection/get/queryCollection"!`
                }}
            }
        }
    },
    common: {
        required_params: (validationErrors, functionName) => {
            const validationMessages = validationErrors.map(item => '- ' + item.message).join('\n');

            return {
                name: 'RequiredParams',
                message: `at "${functionName || '--unknown-method--'}":\n${validationMessages}\n\n`
            }
        },

        missing_params: (paramName, at, file) => { return {
            name: 'CommonMissingParams',
            message: `The param(s) "${Array.isArray(paramName) ? paramName.join(', ') : paramName}" is required at ${at} file "${file}"!`
        }},

        bad_format_param: (paramName, at, expected, received, file) => { return {
            name: 'CommonBadFormatParam',
            message: `Param "${paramName}" at ${at}, file "${file}", expects a "${expected}", but received "${received}!`
        }},

        invalid_json_pattern: (received) => { return {
            name: 'CommonInvalidJsonPattern',
            message: `The JSON format provided is invalid!\nPovided: ${received}`
        }},

        request_creating_custom_schema: () => { return {
            name: 'CommonRequestCreatingCustomSchema',
            message: `An error was caught at custom schema creating on RequestBase model!`
        }},

        request_model_schema_not_found: (received) => { return {
            name: 'CommonRequestModelSchemaNotFound',
            message: `The collection name provided didn't match as any database schema! Provided -> ${received}`
        }},

        model_construction: (modelName) => { return {
            name: 'CommonModelSchemaValidation',
            message: `Error caught at the construction of "${modelName || 'Unknown Model'}" model!`
        }}
    },
    database: {
        collection_dont_exist: (collectionName) => { return {
            name: `DatabaseCollectionDoesntExist`,
            message: `The collection "${collectionName}" that you're trying to get doesn't exist!`
        }},

        getting_collection_model: (collectionName) => { return {
            name: 'DatabaseGettingCollectionModel',
            message: `An error occured it was trying to get the db collection model of "${collectionName}"!`
        }},

        schema_not_found: (collectionName) => { return {
            name: 'DatabaseSchemaNotFound',
            message: `Database schema not found for collection "${collectionName}"!`
        }},

        creating_document: (collectionName) => { return {
            name: 'DatabaseCreatingDocument',
            message: `An error occured while a document has being created at "${collectionName}" collection!`
        }},

        increasing_collection_counter: (collectionName) => { return {
            name: 'DatabaseIncreasingCollectionCounter',
            message: `An error occured while it was trying to increase the counter of collection "${collectionName}"!`
        }},

        writting_mofication_time: () => { return {
            name: 'DatabaseWrittingModificationTime',
            message: 'An error occured during the timestamp modification time was being placed!'
        }},

        updating_document: (filter) => { return {
            name: 'DatabaseUpdatingDocument',
            message: `An error occured when the document "${JSON.stringify(filter)}" was being updated!`
        }},

        deleting_document: (collectionName, docID) => { return {
            name: 'DatabaseDeletingDocument',
            message: `An error occured when deleting the document "${docID}" at collection "${collectionName}"!`
        }},

        querying_collection: (collectionName) => { return {
            name: 'DatabaseQueryingCollection',
            message: `An error occured when it was querying the collection "${collectionName}"!`
        }},

        getting_document: (collectionName, docID) => { return {
            name: 'DatabaseGettingDocument',
            message: `An error occured when it's trying to get the document using filter "${docID}" at collection "${collectionName}"!`
        }},

        document_dont_exist: () => { return {
            name: 'DatabaseDocumentDoesntExist',
            message: 'The document _id provided doesn\'t exist!'
        }},

        counter_verification: () => { return {
            name: 'DatabaseCounterVerification',
            message: 'An error occured on counter verification!'
        }},

        counter_creation: (collectionName) => { return {
            name: 'DatabaseCounterCreation',
            message: `An error occured on counter creation of collection ${collectionName}!`
        }},

        duplicated_counter: (collectionName) => { return {
            name: 'DatabaseDuplicatedCounter',
            message: `The counter for collection "${collectionName}" already exist!`
        }},

        counter_not_found: (collectionName) => { return {
            name: 'DatabaseCounterNotFound',
            message: `The counter for collection ${collectionName} wasn't found!`
        }},

        missing_schema: () => { return {
            name: 'DatabaseMissingSchema',
            message: `Schema wans't provided!`
        }},

        presaving_document_error: () => { return {
            name: 'DatabasePreSavingDocumentError',
            message: 'An error occured on pre event, before saving document!'
        }},

        making_docs_readable: () => { return {
            name: 'DatabaseMakingDocsReadable',
            message: 'An error occured when the readable(), query was executed!'
        }},

        populating_document: (collectionName) => { return {
            name: 'DatabasePupulatingDocument',
            message: `An error occured when a document at collection "${collectionName}" was being populated!`
        }},

        short_population: (filter) => { return {
            name: 'DatabaseShortPopulation',
            message: `Error caught during the slot query "shortPopulate" of slot "${JSON.stringify(filter)}"!`
        }},

        paginate_query: () => { return {
            name: 'DatabasePaginateQuery',
            message: `An error was caught during the pagination of the query ""`
        }},

        populating_slot: (slotID) => { return {
            name: 'DatabasePopulatingSlot',
            message: `An issue occured on the slot "${slotID}" population!`
        }},

        readable: () => { return {
            name: 'DatabaseReadable',
            message: `An issue occured when it was making doc readable by using the toObject()!`
        }},

        schema_init: () => { return {
            name: 'DatabaseSchemaInitialization',
            message: 'An error occured at schema initialization!'
        }},

        duplicated_schema: (name, symbol) => {return {
            name: 'DatabaseDuplicatedSchema',
            message: `The schema [${symbol}] - ${name} which is being initialized, already exists!`
        }},

        duplicated_schema_name: (name) => {return {
            name: 'DatabaseDuplicatedSchemaName',
            message: `he schema name "${name}" being initialized already exists!`
        }},

        duplicated_schema_symbol: (symbol) => {return {
            name: 'DatabaseDuplicatedSchemaSymbol',
            message: `he schema symbol [${symbol}] initialized already exists!`
        }},

        getting_schema: (schemaName) => { return {
            name: 'DatabaseGettingSchema',
            message: `It seems that the schema "${schemaName}" don't exist!`
        }},

        duplicated_collection_config: () => { return {
            name: 'DatabaseDuplicatedColletionConfig',
            message: 'The collection name and symbol should be UNIQUE!'
        }},

        saving_log: (logName, logMessage) => { return {
            name: 'DatabaseSavingLog',
            message: `An error occured when it was trying to create a new log!\nLog: "${logName}"\nMessage: "${logMessage}"`
        }},

        init_document: (collectionName, docID) => { return {
            name: 'DatabaseInitializingDocument',
            message: `An error occured on collection "${collectionName}" - "${docID}" at the document initialization!`
        }},

        init_queries: () => { return {
            name: 'DatabaseInitQueries',
            message: `Error caught at queries initialization of the database schema!`
        }},

        init_events: () => { return {
            name: 'DatabaseInitEvents',
            message: `Error caught at events initialization of the database schema!`
        }},

        init_classes: () => { return {
            name: 'DatabaseInitClasses',
            message: `Error caught at classes initialization of the database schema!`
        }},

        events: {
            pre_save: () => { return {
                name: 'DatabaseEventsPreSave',
                message: `Error caught on "preSave" event of database!`
            }},

            post_save: () => { return {
                name: 'DatabaseEventsPostSave',
                message: `Error caught on "postSave" event of database!`
            }},

            post_delete: () => { return {
                name: 'DatabaseEventsPostDelete',
                message: `Error caught during the postDelete event!`
            }},

            post_delete_not_acknowledged: () => { return {
                name: 'DatabaseEventsPostDeleteNotAcknowledged',
                message: `The update on postDelete event is not acknowledged when it was updating the related documents in linked collections!`
            }},

            slot_post_update: () => { return {
                name: 'DatabaseSlotPostUpdate',
                message: `Error caught during slot post update event execution!`
            }},

            slots_post_update_slot_not_found: (slotUID) => { return {
                name: 'DatabaseSlotPostUpdateSlotNotFound',
                message: `Slot "${slotUID}" wasn't found during slot post update event execution!`
            }},

            position_post_update: () => { return {
                name: 'DatabasePositionPostUpdate',
                message: `Error caught during position post update event execution!`
            }},

            transfer_post_save: () => { return {
                name: 'DatabaseTransferPostUpdate',
                message: `Error caught during transfer post save event execution!`
            }}
        }
    },
    helpers: {
        find_rel_fields: () => { return {
            name: 'HelpersFindRelFields',
            message: `Error caught at helper findRelFields!`
        }},

        treat_filter: () => { return {
            name: 'HelpersTreatFilter',
            message: `Error caught at helper treatFilter()!`
        }},

        is_collection_exist: (collectionName) => { return {
            name: 'HelpersIsCollectionExist',
            message: `Error checking collection existence of "${collectionName}"!`
        }},

        get_collection_model: () => { return {
            name: 'HelpersGetCollectionModel',
            message: `Error caught on the database helper getCollectionModel!`
        }},

        create_counter: () => { return {
            name: 'HelpersCreateCounter',
            message: `Error caught on the database helper createCounter!`
        }},

        increase_counter: (collectionName) => { return {
            name: 'HelpersIncreaseCounter',
            message: `Error caught during the counter increase of collection "${collectionName}"!`
        }}
    },
    resources: {
        path_string_not_found: (pathString) => { return {
            name: `ResourcePathNotFound`,
            message: `The resource path "${pathString}" wasn't found!`
        }},

        error_path_not_found: (pathString) => { return {
            name: 'ErrorPathNotFound',
            message: `The string path "${pathString}" provided at Error.Log don't exist!`
        }}
    },
    services: {
        XMLManager: {
            loading_file: (filePath, fileName) => { return {
                name: 'ServicesXMLManagerLoadingFile',
                message: `Error caught during xml file loading!\Path: ${filePath}\nFile:${fileName}.`
            }},

            parsing_xml: (filePath, fileName) => { return {
                name: 'ServicesXMLManagerParsingFile',
                message: `Error caught while the xml file was being parsed!\Path: ${filePath}\nFile:${fileName}.`
            }},

            saving_file: (filePath, fileName) => { return {
                name: 'ServicesXMLManagerSavingFile',
                message: `Error caught during xml file was being parsed!\Path: ${filePath}\nFile:${fileName}.`
            }}
        }
    },
    user: {
        get_master_account: (userUID, userName) => { return {
            name: 'UserGetMasterAccount',
            message: `Error caught getting user's master account of [${userUID}] - ${userName}!`
        }},

        get_open_trades: (userUID, userName) => { return {
            name: 'UserGetOpenTrades',
            message: `Error caught getting the user's open trades of [${userUID}] - ${userName}!`
        }}
    }
};
