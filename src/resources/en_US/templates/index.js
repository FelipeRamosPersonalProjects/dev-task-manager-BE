const osf = require('./osf');
const code = require('./code');
const MyPrDescription = require('./my_pr_description');
const DefaultCommitDescriptionTemplate = require('./default_commit_description');
const DefaultFileChangeTemplate = require('./default_file_change');

module.exports = {
    osf,
    code,
    
    default_commit_description: () => {
        return new DefaultCommitDescriptionTemplate({
            componentName: 'Default commit description',
            description: 'This is my default commit description template.'
        });
    },

    default_file_change: () => {
        return new DefaultFileChangeTemplate({
            componentName: 'Default file change object',
            description: 'This is my default commit description template.'
        });
    },

    my_pr_description: (params) => {
        return new MyPrDescription({
            componentName: 'My PR description',
            description: 'This is my custom PR description template.',
            ...params
        });
    }
}
