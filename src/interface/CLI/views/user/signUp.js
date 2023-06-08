const ViewCLI = require('@CLI/ViewCLI');
const PoolForm = require('@CLI/PoolForm');
const User = require('@models/collections/User');

async function SignUpView() {
    return new ViewCLI({
        name: 'signUp',
        poolForm: new PoolForm({
            autoSaveAnswers: true,
            startQuestion: 'email',
            questions: [
                {
                    id: 'email',
                    next: 'firstName',
                    text: `Enter your "e-mail", which will be your user name: `,
                    events: {
                        onAnswer: async (ev, {print}, answer) => {
                            try {
                                const isExist = await User.isExist(answer);
                                if (isExist instanceof Error.Log) {
                                    throw isExist;
                                }

                                if (isExist) {
                                    print(`The user name "${answer}" is already in use by another user! Please, try again...`, 'USER-ALREADY-USED')
                                    return await ev.trigger();
                                }
                            } catch (err) {
                                throw new Error.Log(err);
                            }
                        }
                    }
                },
                {
                    id: 'firstName',
                    next: 'lastName',
                    text: `Enter your "first name": `
                },
                {
                    id: 'lastName',
                    next: 'phone',
                    text: `Enter your "last name": `
                },
                {
                    id: 'phone',
                    next: 'gitHubToken',
                    text: `Enter your "phone number": `
                },
                {
                    id: 'gitHubToken',
                    next: 'password',
                    text: `Provide your GitHub token: `
                },
                {
                    id: 'password',
                    next: 'confirmPassword',
                    text: `Enter your "password": `
                },
                {
                    id: 'confirmPassword',
                    text: `Confirm your password: `,
                    events: {
                        onAnswer: async (ev, {printError}, answer) => {
                            try {
                                const password = ev.getValue('password');

                                if (password !== answer) {
                                    printError(new Error.Log('auth.password_not_match'));
                                    return await ev.trigger();
                                }
                                
                                const newUser = await User.create(ev.parentPool.values);
                                
                                if (!newUser.success) {
                                    throw newUser
                                }

                                return await ev.redirectTo('home');
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

module.exports = SignUpView;
