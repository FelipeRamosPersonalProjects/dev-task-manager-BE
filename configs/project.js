/**
 * Configuration class for the project.
 */
class ProjectConfig {
    /**
     * The name of the project.
     * @type {string}
     */
    static projectName = 'dev-desk';

    /**
     * The mode of the project (e.g., development, production).
     * @type {string}
     */
    static mode = 'development';

    /**
     * The default language of the project.
     * @type {string}
     */
    static defaultLanguage = 'en_US';

    /**
     * The local path of the project.
     * @type {string}
     */
    static projectLocalPath = __dirname;

    /**
     * The path to the session file for the project.
     * @type {string}
     */
    static sessionPath = this.projectLocalPath + '\\sessionCLI.json';

    /**
     * The backup folder path for the project.
     * @type {string}
     */
    static backupFolder = this.projectLocalPath + '\\temp';

    /**
     * The database configuration.
     * @type {Object}
     * @property {string} counterCollection - The name of the counter collection in the database.
     * @property {string} logCollection - The name of the log collection in the database.
     * @property {Object} maxDeepLevels - The maximum deep levels configuration for the database.
     * @property {Object} consoleLogs - The console logs configuration for the database.
     * @property {boolean} consoleLogs.collectionLoaded - Indicates if the collection is loaded in console logs.
     */
    static database = {
        counterCollection: 'counters',
        logCollection: 'logs',
        maxDeepLevels: {},
        consoleLogs: {
            collectionLoaded: false
        }
    };

    /**
     * The GitHub configuration.
     * @type {Object}
     * @property {string} apiHostURL - The API host URL for GitHub.
     */
    static github = {
        apiHostURL: 'https://api.github.com'
    };
}

module.exports = ProjectConfig;
