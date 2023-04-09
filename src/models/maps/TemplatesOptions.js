class TemplateOptions {
    constructor(setup = {
        branchName: '',
        prTitle: '',
        prDescription: ''
    }) {
        const {branchName, prTitle, prDescription} = setup || {};

        this.branchName = (typeof branchName === 'function') ? branchName : Resource.templates(branchName);
        this.prTitle = (typeof prTitle === 'function') ? prTitle : Resource.templates(prTitle);
        this.prDescription = (typeof prDescription === 'function') ? prDescription : Resource.templates(prDescription);
    }
}

module.exports = TemplateOptions;
