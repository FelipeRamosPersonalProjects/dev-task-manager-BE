import { createDoc } from '/src/www/client/js/helpers/docHelpers';

document.querySelectorAll('.docform').forEach(form => {
    form.addEventListener('submit', (ev) => {
        ev.preventDefault();

        return createDoc({ ev, collection: 'pull_requests', redirect: '/pullrequests/read-edit/', dataMiddleware: (data) => {

            if (data.assignedUsers) {
                data.assignedUsers = sessionStorage.getItem('currentUserUID');
            }

            return data;
        } })
    });
});
