const ViewCLI = require('@CLI/ViewCLI');

async function UserView() {
    return new ViewCLI({
        name: 'user',
        navigator: { options: [
            {
                title: 'My Profile                     ',
                description: 'Open your profile.',
                targetView: 'user/profile'
            },
            {
                title: 'Edit Profile                   ',
                description: 'Edit your profile.',
                targetView: 'user/editProfile'
            },
            {
                title: 'Delete Profile                 ',
                description: 'Delete your profile.',
                targetView: 'user/deleteProfile'
            }
        ]}
    }, this);
}

module.exports = UserView;
