const fs = require('fs');
const Component = require('../../../../interface/Component');
const StringTemplateBuilder = require('../../../../interface/StringTemplateBuilder');

module.exports = {
    default_branch_name: () => {
        return new Component({
            componentName: 'OSF default branch name',
            description: 'The main template used by OSF for branch names.',
            outputModel: new StringTemplateBuilder().text('feature/').var('taskID', 'string').end()
        });
    },

    default_pr_title: () => {
        return new Component({
            componentName: 'OSF pull request title',
            description: 'The main template used by OSF for PR titles',
            outputModel: new StringTemplateBuilder()
                .text('[').var('taskID', 'string').text('] : ').var('taskTitle', 'string')
            .end()
        });
    },

    default_pr_description: async () => {
        return new Promise((resolve, reject) => {
            fs.readFile('src/resources/en_US/templates/osf/assets/default_pr.md', (err, data) => {
                if (err) {
                    reject(err);
                }

                const template = data.toString();
                const component = new Component({
                    componentName: 'OSF pull request description',
                    description: 'The main template used by OSF for PR descriptions.',
                    outputModel: template,
                    types: {
                        FileChange:  new Component({
                            outputModel: new StringTemplateBuilder()
                                .text(`#### `).var('filename', 'string').text(`:`).newLine()
                            .end()
                        })
                    }
                });

                resolve(component);
            });
        });
    },

    default_filechange_item: () => {
        return new Component({
            outputModel: new StringTemplateBuilder()
                .text('- **').var('filename', 'string').text(`**:`).newLine()
                .text('_').var('changeDescription', 'string').text('_').newLine()
            .end()
        });
    }
};
