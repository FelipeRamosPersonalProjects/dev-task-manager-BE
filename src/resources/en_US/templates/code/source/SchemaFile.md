const Collection = require('@Collection');
const { ObjectId } = Collection.Types;

module.exports = new Collection({
    name: '##{{name:string}}##',
    symbol: '##{{symbol:string}}##',
    displayName: '##{{displayName:string}}##',
    pluralLabel: '##{{pluralLabel:string}}##',
    singularLabel: '##{{singularLabel:string}}##',
    fieldsSet: []
});
