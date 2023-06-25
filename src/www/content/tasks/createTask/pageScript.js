import { createDoc } from '/src/www/client/js/helpers/docHelpers';

document.querySelectorAll('.docform').forEach(form => {
    form.addEventListener('submit', (ev) => {
        ev.preventDefault();

        return createDoc({ ev, collection: 'tasks', redirect: '/dashboard', dataMiddleware: (data) => {
            data.assignedUsers = sessionStorage.getItem('currentUserUID');
            return data;
        } })
    });
});
