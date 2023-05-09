const ViewCLI = require('@CLI/ViewCLI');
const HomeViewCLI = require('@CLI/views/home');
const PoolForm = require('@CLI/PoolForm');
const User = require('@models/collections/User');
const FS = require('@services/FS');
const authHelpers = require('@CLI/helpers/auth');
const config = require('@config');

async function AuthView({viewParams}) {
    const { token } = Object(viewParams);
    const isAuthenticated = await authHelpers.isAuthenticated(token);

    if (isAuthenticated) {
        return HomeViewCLI.call(this);
    } else {
        return new ViewCLI({
            name: 'authView',
            poolForm: new PoolForm({
                autoSaveAnswers: true,
                questions: [
                    {
                        id: 'alreadyHaveAccount',
                        text: `Do you already have an account? (Y = SignIn / N = Create a new one): `,
                        events: {
                            onAnswer: async (ev, {boolAnswer}, answer) => {
                                try {
                                    if (boolAnswer(answer)) {
                                        return await ev.goNext('userName');
                                    } else {
                                        return await ev.redirectTo('user/signUp');
                                    }
                                } catch (err) {
                                    throw new Error.Log(err);
                                }
                            }
                        }
                    },
                    {
                        id: 'userName',
                        next: 'password',
                        text: `Enter your user name (e-mail): `
                    },
                    {
                        id: 'password',
                        text: `Enter your password: `,
                        next: 'redirect',
                        events: {
                            onAnswer: async (ev, {printError}, answer) => {
                                try {
                                    const userName = ev.getValue('userName');
                                    const user = await User.signIn(userName, answer);

                                    if (user instanceof Error.Log) {
                                        const isGoodError = [
                                            user.name === 'AUTH_INVALID_CREDENTIALS',
                                            user.name === 'AUTH_USERNAME_NOT_FOUND',
                                        ].some(item => item);

                                        if (isGoodError) {
                                            printError(user);
                                            return await ev.goNext('userName');
                                        } else {
                                            throw user;
                                        }
                                    }

                                    let session = {};
                                    const sessionPath = config.sessionPath;

                                    if (FS.isExist(sessionPath)) {
                                        session = require('@SESSION_CLI');
                                    }

                                    const token = user.token;
                                    session.currentUser = user._id;
                                    session[user._id] = {
                                        token,
                                        expiration: Date.now() + 86400000
                                    }

                                    const sessionCreated = await FS.writeFile(sessionPath, session);
                                    if (sessionCreated instanceof Error.Log) {
                                        throw sessionCreated;
                                    }

                                    if (sessionCreated.success) {
                                        return await ev.redirectTo('home');
                                    } else {
                                        printError(sessionCreated);
                                        return await ev.goNext('userName');
                                    }
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
}

module.exports = AuthView;
