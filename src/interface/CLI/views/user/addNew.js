const ViewCLI = require('@CLI/ViewCLI');
const PoolForm = require('@CLI/PoolForm');
const User = require('@models/collections/User');
const crypto = require('crypto');

async function AddNewUserView() {
    return new ViewCLI({
        name: 'addNew',
        poolForm: new PoolForm({
            autoSaveAnswers: true,
            questions: [
                {
                    id: 'firstName',
                    text: `Enter the first name: `,
                    next: 'lastName'
                },
                {
                    id: 'lastName',
                    text: `Enter the last name: `,
                    next: 'email'
                },
                {
                    id: 'email',
                    text: `Enter the e-mail (This will be the user name as welll): `,
                    next: 'phone'
                },
                {
                    id: 'phone',
                    text: `Enter the phone number: `,
                    next: 'gitHubUser'
                },
                {
                    id: 'gitHubUser',
                    text: `Enter the GitHub user name: `,
                    next: 'slackName'
                },
                {
                    id: 'slackName',
                    text: `Enter the slack name user: `,
                    events: {
                        onAnswer: async (ev, { print }) => {
                            try {
                                const tempPass = crypto.randomBytes(3);
                                const newUser = await User.create({
                                    ...Object(ev.poolData),
                                    password: tempPass
                                }, {preventSignIn: true});

                                return await ev.goNext();
                            } catch (err) {
                                throw new Error.Log(err);
                            }
                        }
                    }
                }
            ]
        }, this)
    }, this);
}

module.exports = AddNewUserView;
