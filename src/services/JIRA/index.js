const JIRAStatusTransition = require('@src/models/jira/StatusTransition');
const JIRAConnect = require('./JIRAConnect');
const JIRATicket = require('@models/jira/issues/TicketIssue')

class JIRA extends JIRAConnect {
    constructor (setup) {
        super(setup);

        try {
            const {  } = Object(setup);


        } catch (err) {
            throw new Error.Log(err);
        }
    }

    async mySelf() {
        try {
            const me = await this.request('/myself');
            if (!me || me instanceof Error.Log) {
                throw me;
            }

            const myProjects = await this.request('/project/search');
            if (!myProjects || myProjects instanceof Error.Log) {
                throw myProjects;
            }

            if (me.success && myProjects.success) {
                const user = me.data;

                user.projects = myProjects.data;
                return user.toSuccess();
            }
        } catch (err) {
            throw new Error.Log(err);
        }
    }

    async createIssue(data) {
        const { parentKey, priorityIndex, issueType, externalKey, externalURL, projectKey, title, description, infoDisplay } = Object(data);
        
        try {
            const created = await this.request(`/issue`, new JIRATicket({
                parentKey,
                priorityIndex,
                issueType,
                externalKey,
                externalURL,
                projectKey,
                title,
                description,
                infoDisplay
            }).toCreate(), { method: 'post' });

            return created;
        } catch (err) {
            throw new Error.Log(err);
        }
    }

    async updateIssue(issueKey, data) {
        try {
            const updated = await this.request(`/issue/${issueKey}`, new JIRATicket(data).toUpdate(), {
                method: 'put'
            });

            return updated;
        } catch (err) {
            throw new Error.Log(err);
        }
    }
    
    async transitionIssue(issueKey, event) {
        try {
            const updated = await this.request(`/issue/${issueKey}/transitions`, new JIRAStatusTransition(event), {
                method: 'post'
            });

            return updated;
        } catch (err) {
            throw new Error.Log(err);
        }
    }
}

module.exports = JIRA;
