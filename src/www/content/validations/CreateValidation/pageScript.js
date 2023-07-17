import { createDoc } from '/src/www/client/js/helpers/docHelpers';

document.querySelectorAll('.docform').forEach(form => {
    form.addEventListener('submit', (ev) => {
        ev.preventDefault();

        return createDoc({ ev, collection: 'validations', redirect: '/dashboard', dataMiddleware: (data) => {
            data.assignedUsers = sessionStorage.getItem('currentUserUID');

            if (!data.pullRequest) {
                delete data.pullRequest;
            }

            return data;
        } })
    });
});
