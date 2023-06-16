const _Global = require('../maps/_Global');
const AuthBucket = require('./AuthBucket');
const Repo = require('./Repo');
const SpaceDesk = require('./SpaceDesk');
const Task = require('./Task');
const Ticket = require('./Ticket');
const PullRequest = require('./PullRequest');
const Comment = require('./Comment');
const CRUD = require('@CRUD');
const dbHelpers = require('@helpers/database/dbHelpers');
const FS = require('@services/FS');
const config = require('@config');
const sessionCLI = FS.isExist(config.sessionPath) && require('@SESSION_CLI') || {};
const GitHubConnection = require('@services/GitHubAPI/GitHubConnection');
const JIRA = require('@services/JIRA');

class User extends _Global {
    constructor(setup){
        super({...setup, validationRules: 'users'}, () => this);
        if (!setup || setup.oid()) return;
        
        const {
            auth,
            userName,
            slackName,
            firstName,
            lastName,
            email,
            phone,
            repos,
            spaceDesks,
            tickets,
            tasks,
            myPullRequests,
            myReviews,
            pullRequestsAssigned,
            myComments,
            gitHub,
            jira
        } = Object(setup);

        try {
            this.collectionName = 'users';
            this.userName = userName;
            this.slackName = slackName;
            this.displayName = `${firstName} ${lastName} (${email})`;
            this.firstName = firstName;
            this.lastName = lastName;
            this.email = email;
            this.phone = phone;
            this.repos = isCompleteDoc(repos) && repos.map(item => new Repo(item));
            this.spaceDesks = isCompleteDoc(spaceDesks) && spaceDesks.map(item => new SpaceDesk(item));
            this.tickets = isCompleteDoc(tickets) && tickets.map(item => new Ticket(item));
            this.tasks = isCompleteDoc(tasks) && tasks.map(item => new Task(item));
            this.myPullRequests = isCompleteDoc(myPullRequests) && myPullRequests.map(item => new PullRequest(item));
            this.myReviews = isCompleteDoc(myReviews) && myReviews.map(item => new User(item));
            this.pullRequestsAssigned = isCompleteDoc(pullRequestsAssigned) && pullRequestsAssigned.map(item => new PullRequest(item));
            this.myComments = isCompleteDoc(myComments) && myComments.map(item => new Comment(item));
            this.gitHub = gitHub;
            this.jira = jira;
            
            this._auth = () => new AuthBucket(Object(auth), this);
            this.placeDefault();

            this.gitHubConnection = new GitHubConnection({
                userName: this.getSafe('gitHub.login')
            });
            this.jiraConnect = new JIRA({
                userName: this.jiraUser,
                userUID: this._id,
                jiraToken: this.auth.jiraToken
            });
        } catch(err) {
            new Error.Log(err).append('common.model_construction', 'User');
        }
    }

    get fullName() {
        return (this.firstName || '') + (this.lastName ? ' ' : '') + (this.lastName || '');
    }

    get auth() {
        return this._auth();
    }

    get authService() {
        return this.auth && this.auth.service;
    }

    get token() {
        return this.authService.createUserToken();
    }

    get userSession() {
        return sessionCLI[this._id];
    }

    get currentUser() {
        return sessionCLI.currentUser;
    }

    get gitHubUser() {
        return Object(this.gitHub).getSafe('login');
    }

    get jiraUser() {
        return this.getSafe('jira.emailAddress')
    }

    static userSession() {
        return sessionCLI[this.currentUser()];
    }

    static currentUser() {
        return sessionCLI.currentUser;
    }

    async loadGitHubData() {
        try {
            this.gitHub = await this.gitHubConnection.getUser();
            return this.gitHub;
        } catch (err) {
            throw new Error.Log(err);
        }
    }

    async loadOpenedPRs() {
        try {
            const prs = await CRUD.query({collectionName: 'pull_requests', filter: {
                assignedUsers: { $in: [this._id]},
                $nor: [{ status: 'CLOSED' }]
            }}).defaultPopulate();

            if (prs instanceof Error.Log) {
                throw prs;
            }

            return prs.map(item => item.initialize());
        } catch (err) {
            throw new Error.Log(err);
        }
    }

    async signOut() {
        try {
            const signedOut = await this.authService.signOut(this.userSession.token);
            return signedOut;
        } catch (err) {
            throw new Error.Log(err);
        }
    }

    toPublic(append) {
        const dataOut = {...this, ...append};

        delete dataOut.auth;
        delete dataOut._schema;
        delete dataOut.gitHubConnection;
        return dataOut;
    }

    static async getMyUser(filter) {
        try {
            const currentUser = filter || sessionCLI.currentUser || '';
            const userDOC = await this.getUser(currentUser);

            if (userDOC instanceof Error.Log) {
                throw userDOC;
            }

            return userDOC;
        } catch (err) {
            throw new Error.Log(err);
        }
    }

    static async getUser(filter) {
        try {
            const userDOC = await CRUD.getDoc({collectionName: 'users', filter}).defaultPopulate();

            if (!userDOC instanceof Error.Log) {
                throw userDOC;
            }

            if (!userDOC) {
                return new Error.Log('user.not_found', filter);
            }

            const initialized = userDOC.initialize();
            if (!initialized.gitHub && initialized.auth.gitHubToken) {
                await initialized.updateDB({data: {
                    gitHub: await initialized.loadGitHubData()
                }});
            } 

            return initialized;
        } catch (err) {
            throw new Error.Log(err);
        }
    }

    static async isExist(userName, returnUID) {
        try {
            const result = await dbHelpers.isDocExist('users', { userName });
            if (result instanceof Error.Log) {
                throw result;
            }

            if (result && result._id.oid()) {
                if (returnUID) {
                    return result.toString();
                } else {
                    return true;
                }
            } else {
                return false;
            }
        } catch (err) {
            throw new Error.Log(err);
        }
    }

    static async create(setup, options) {
        try {
            const { userName, email, password } = Object(setup);
            const { preventSignIn } = Object(options);

            // Check if the userName or email (that can be an userName) is already in use
            const isExist = await this.isExist(userName || email);
            // If the user is already in use throw an error
            if (isExist) {
                return new Error.Log('auth.user_in_use');
            }

            const newUser = await CRUD.create('users', setup);
            if (newUser instanceof Error.Log) {
                throw newUser;
            }

            return Object().toSuccess();
        } catch (err) {
            throw new Error.Log(err);
        }
    }

    static async signIn(userName, password) {
        try {
            const userDOC = await CRUD.getDoc({ collectionName: 'users', filter: { userName }}).defaultPopulate();

            if (!userDOC) {
                return new Error.Log('auth.user_not_found', userName);
            }

            const user = userDOC.initialize();
            const signedIn = await user.authService.signIn(password);

            if (signedIn.success) {
                return user;
            } else {
                return signedIn;
            }
        } catch (err) {
            throw new Error.Log(err);
        }
    }
}

module.exports = User;
