const Project = require('../../models/collections/Project');

class ProjectsClass {
    static Model = Project;

    get displayName() {
        return `[${this.projectKey}] ${this.projectName}`;
    }
    
    get frontURL() {
        return `/projects/read-edit/${this.index}`;
    }
}

module.exports = ProjectsClass;
