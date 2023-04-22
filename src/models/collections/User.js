const _Global = require('../maps/_Global');
const Repo = require('./Repo');
const SpaceDesk = require('./SpaceDesk');
const Task = require('./Task');
const Ticket = require('./Ticket');
const PullRequest = require('./PullRequest');
const Comment = require('./Comment');

class User extends _Global {
    constructor(setup){
        super({...setup, validationRules: 'users'});
        if (!setup || isObjectID(setup)) return;

        const {
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
            comments,
        } = setup || {};

        try {
            // Database exported properties
            this.displayName = `${firstName} ${lastName} (${email})`;
            this.fullName = fullName;
            this.firstName = firstName;
            this.lastName = lastName;
            this.email = email;
            this.phone = phone;
            this.repos = !isObjectID(repos) && repos.map(item => new Repo(item));
            this.spaceDesks = !isObjectID(spaceDesks) && spaceDesks.map(item => new SpaceDesk(item));
            this.tickets = !isObjectID(tickets) && tickets.map(item => new Ticket(item));
            this.tasks = !isObjectID(tasks) && tasks.map(item => new Task(item));
            this.myPullRequests = !isObjectID(myPullRequests) && myPullRequests.map(item => new PullRequest(item));
            this.myReviews = !isObjectID(myReviews) && myReviews.map(item => new User(item));
            this.pullRequestsAssigned = isObjectID(pullRequestsAssigned) && pullRequestsAssigned.map(item => new PullRequest(item));
            this.comments = !isObjectID(comments) && comments.map(item => new Comment(item));

            this.placeDefault();
        } catch(err) {
            new Error.Log(err).append('common.model_construction', 'User');
        }
    }
}

module.exports = User;
