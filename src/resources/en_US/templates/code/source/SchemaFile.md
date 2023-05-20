const Collection = require('@Collection');
const { ObjectId } = Collection.Types;

module.exports = new Collection({
    name: '##{{name:string}}##',
    key: '##{{key:string}}##',
    displayName: '##{{displayName:string}}##',
    pluralLabel: '##{{pluralLabel:string}}##',
    singularLabel: '##{{singularLabel:string}}##',
    fields: []
}).initSchema();
