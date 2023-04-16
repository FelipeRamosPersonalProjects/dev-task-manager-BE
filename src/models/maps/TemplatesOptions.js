class TemplateOptions {
    constructor(setup) {
        const {branchName, prTitle, prDescription, commitDescription} = setup || {};

        this.branchName = (typeof branchName === 'function') ? branchName : Resource.templates(branchName);
        this.prTitle = (typeof prTitle === 'function') ? prTitle : Resource.templates(prTitle);
        this.commitDescription = (typeof commitDescription === 'function') ? commitDescription : Resource.templates(commitDescription);
        this.prDescription = (typeof prDescription === 'function') ? prDescription : Resource.templates(prDescription);
    }
}

module.exports = TemplateOptions;
