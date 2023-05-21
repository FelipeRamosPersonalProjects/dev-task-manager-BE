const CollectionField = require('./CollectionField');
const Schema = require('@models/SchemaDB');

/**
 * Represents a collection on the database.
 * @module Collection
 */
class Collection {
    static Types = Schema.mongoSchema.Types;
    
    /**
     * Creates a new instance of the Collection class.
     * @param {Object} setup - The setup object.
     * @param {string} setup.name - The name of the collection.
     * @param {string} setup.symbol - The symbol of the collection.
     * @param {string} setup.displayName - The display name of the collection.
     * @param {string} setup.pluralLabel - The plural label of the collection.
     * @param {string} setup.singularLabel - The singular label of the collection.
     * @param {CollectionField[]} setup.fields - The fields of the collection.
     */
    constructor(setup) {
        try {
            const { name, symbol, displayName, pluralLabel, singularLabel, fields, lastSync } = Object(setup);

            /**
             * The symbol of the collection.
             * @type {string}
             */
            this.symbol = symbol;

            /**
             * The name of the collection.
             * @type {string}
             */
            this.name = name;

            /**
             * The display name of the collection.
             * @type {string}
             */
            this.displayName = displayName;

            /**
             * The plural label of the collection.
             * @type {string}
             */
            this.pluralLabel = pluralLabel;

            /**
             * The singular label of the collection.
             * @type {string}
             */
            this.singularLabel = singularLabel;

            /**
             * Last collection's config files sychronization.
             * @type {Date|null} - Timestamp of last sync, or null, if is a new collection.
             */
            this.lastSync = lastSync;

            /**
             * The fields of the collection.
             * @type {CollectionField[]}
             */
            this.fields = fields.map(field => new CollectionField(field));
        } catch (err) {
            throw new Error.Log(err);
        }
    }

    static Types = Schema.mongoSchema.Types;

    initSchema() {
        const result = {
            name: this.name,
            symbol: this.symbol,
            schema: {}
        };

        this.fields.map(field => {
            result.schema[field.fieldName] = field;
        });

        try {
            return new Schema(result);
        } catch (err) {
            throw new Error.Log(err);
        }
    }
    
    async syncCollection() {
        try {
            
        } catch (err) {
            throw new Error.Log(err);
        }
    }
}

module.exports = Collection;
