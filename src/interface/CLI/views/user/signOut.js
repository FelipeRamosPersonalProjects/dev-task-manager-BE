const ViewCLI = require('@CLI/ViewCLI');
const PoolForm = require('@CLI/PoolForm');
const User = require('@models/collections/User');

async function SignOutView() {
    return new ViewCLI({
        name: 'signOut',
        poolForm: new PoolForm({
            questions: [
                {
                    id: 'confirmation',
                    text: `Do you confirm to logout your account (Y/N)? `,
                    events: {
                        onAnswer: async (ev, {boolAnswer}, answer) => {
                            try {
                                const userDOC = await User.getMyUser();
                                
                                if (userDOC instanceof Error.Log) {
                                    throw userDOC;
                                }
                                
                                if (boolAnswer(answer)) {
                                    const signedOut = await userDOC.signOut();

                                    if (signedOut.success) {
                                        return await ev.redirectTo('user/authView');
                                    } else {
                                        throw await ev.redirectTo('menu/user');
                                    }
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

module.exports = SignOutView;
