const SelectInputEdit = require('@www/components/DocForm/FormField/SelectInputEdit');

class TemplateTypeSelector extends SelectInputEdit {
    constructor(settings) {
        const templateCollection = require('@schemas/templates');
        const { currentValue } = Object(settings);

        const fieldSet = templateCollection.fieldsSet.find(item => item.fieldName === 'type');
        const options = fieldSet.enumLabels || [];
        const currentValueParsed = options.find(item => item.value === currentValue);
        
        super({ ...settings, options, currentValue: currentValueParsed ? currentValueParsed.label : null });
    }
}

module.exports = TemplateTypeSelector;
