const fs = require('fs');
const Component = require('../../../../interface/Component');
const StringTemplateBuilder = require('../../../../interface/StringTemplateBuilder');

module.exports = {
    default_title: () => {
        return new Component({
            componentName: 'OSF pull request title',
            description: 'The main template used by OSF for PR titles',
            outputModel: new StringTemplateBuilder()
                .text('[').var('taskID', 'string').text('] : [').var('ticketID', 'string').text('] ').var('prName', 'string')
            .end()
        });
    },

    default_description: async () => {
        return new Promise((resolve, reject) => {
            fs.readFile('src/resources/en_US/templates/pullRequests/assets/default.md', (err, data) => {
                if (err) {
                    reject(err);
                }

                const template = data.toString();
                const component = new Component({
                    componentName: 'OSF pull request description',
                    description: 'The main template used by OSF for PR descriptions.',
                    outputModel: template,
                    types: {
                        FileChange: this.default_filechange_item()
                    }
                });

                resolve(component);
            });
        });
    },

    default_filechange_item: () => {
        return new Component({
            outputModel: new StringTemplateBuilder()
                .text('- **').var('filePath', 'string').text(`**:`).newLine()
                .text('_').var('changeDescription', 'string').text('_').newLine()
            .end()
        });
    }
};
