const ViewCLI = require('@CLI/ViewCLI');

async function UserView() {
    return new ViewCLI({
        name: 'user',
        navigator: { options: [
            {
                title: 'Add User                       ',
                description: 'Add a new user to use on collection relations',
                targetView: 'user/addNew'
            },
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
            },
            {
                title: 'SignOut                        ',
                description: 'SignOut from your account!',
                targetView: 'user/signOut'
            }
        ]}
    }, this);
}

module.exports = UserView;
