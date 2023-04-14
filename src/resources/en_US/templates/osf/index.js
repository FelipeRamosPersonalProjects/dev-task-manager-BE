const Component = require('@interface/Component');
const StringTemplateBuilder = require('@interface/StringTemplateBuilder');
const DefaultPRDescription = require('./default_pr_description');

module.exports = {
    default_branch_name: () => {
        return new Component({
            componentName: 'OSF default branch name',
            description: 'The main template used by OSF for branch names.',
            outputModel: new StringTemplateBuilder().var('taskBranch', 'string').end()
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

    default_pr_description: () => {
        return new DefaultPRDescription({
            componentName: 'OSF pull request description',
            description: 'The main template used by OSF for PR descriptions.'
        });
    }
};
