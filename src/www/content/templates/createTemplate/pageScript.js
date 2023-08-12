import { createDoc } from '/src/www/client/js/helpers/docHelpers';

document.querySelectorAll('.docform').forEach(form => {
    form.addEventListener('submit', (ev) => {
        ev.preventDefault();

        return createDoc({ ev, collection: 'templates', redirect: '/templates/read-edit/', dataMiddleware: (data) => {
            data.author = sessionStorage.getItem('currentUserUID');
            return data;
        } })
    });
});
