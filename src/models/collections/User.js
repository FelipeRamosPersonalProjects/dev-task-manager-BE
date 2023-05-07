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
const Success = require('@SUCCESS');

class User extends _Global {
    constructor(setup){
        super({...setup, validationRules: 'users'}, () => this);
        if (!setup || setup.oid()) return;
        
        const {
            auth,
            userName,
            firstName,
            lastName,
            fullName,
            email,
            phone,
            repos,
            spaceDesks,
            tickets,
            tasks,
            myPullRequests,
            myReviews,
            pullRequestsAssigned,
            comments
        } = Object(setup);

        try {
            this.collectionName = 'users';
            this.userName = userName;
            this.displayName = `${firstName} ${lastName} (${email})`;
            this.fullName = fullName;
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
            this.comments = isCompleteDoc(comments) && comments.map(item => new Comment(item));

            this._auth = () => new AuthBucket(Object(auth), this);
            this.placeDefault();
        } catch(err) {
            new Error.Log(err).append('common.model_construction', 'User');
        }
    }

    get auth() {
        return this._auth();
    }

    get authService() {
        return this.auth && this.auth.service;
    }

    async userSignIn() {
        return this.authService && this.authService.signIn(this.userName, password);
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

    static async create(setup) {
        try {
            const { userName, email, password } = Object(setup);

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

            const signedIn = await this.signIn(newUser.userName, password);
            return new Success(signedIn);
        } catch (err) {
            throw new Error.Log(err);
        }
    }

    static async signIn(userName, password) {
        try {
            const userDOC = await CRUD.getDoc({ collectionName: 'users', filter: { userName }}).defaultPopulate();
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
