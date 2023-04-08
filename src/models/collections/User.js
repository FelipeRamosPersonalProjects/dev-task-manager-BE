const _Global = require('../maps/_Global');
const Repo = require('./Repo');
const SpaceDesk = require('./SpaceDesk');
const Task = require('./Task');
const Ticket = require('./Ticket');
const PullRequest = require('./PullRequest');
const Comment = require('./Comment');

class User extends _Global {
    constructor(setup = {
        ...this,
        firstName: '',
        lastName: '',
        fullName: '',
        email: '',
        phone: '',
        repos: [Repo.prototype],
        spaceDesks: [SpaceDesk.prototype],
        tickets: [Ticket.prototype],
        tasks: [Task.prototype],
        myPullRequests: [PullRequest.prototype],
        myReviews: [User.prototype],
        pullRequestsAssigned: [PullRequest.prototype],
        comments: [Repo.prototype]
    }){
        super({...setup, validationRules: 'users'});
        if (!setup.isComplete && !setup.isNew) return;

        try {
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
    
            // Database exported properties
            this.displayName = `${firstName} ${lastName} (${email})`;
            this.fullName = fullName;
            this.firstName = firstName;
            this.lastName = lastName;
            this.email = email;
            this.phone = phone;
            this.repos = Array.isArray(repos) && repos.map(item => new Repo(item));
            this.spaceDesks = Array.isArray(spaceDesks) && spaceDesks.map(item => new SpaceDesk(item));
            this.tickets = Array.isArray(tickets) && tickets.map(item => new Ticket(item));
            this.tasks = Array.isArray(tasks) && tasks.map(item => new Task(item));
            this.myPullRequests = Array.isArray(myPullRequests) && myPullRequests.map(item => new PullRequest(item));
            this.myReviews = Array.isArray(myReviews) && myReviews.map(item => new User(item));
            this.pullRequestsAssigned = Array.isArray(pullRequestsAssigned) && pullRequestsAssigned.map(item => new PullRequest(item));
            this.comments = Array.isArray(comments) && comments.map(item => new Comment(item));

            this.placeDefault();
        } catch(err) {
            new Error.Log(err).append('common.model_construction', 'User');
        }
    }
}

module.exports = User;
