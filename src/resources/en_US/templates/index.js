const osf = require('./osf');
const DefaultCommitDescriptionTemplate = require('./default_commit_description');
const DefaultFileChangeTemplate = require('./default_file_change');

module.exports = {
    osf,
    
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
    }
}
