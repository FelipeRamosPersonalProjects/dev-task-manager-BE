import { createDoc } from '/src/www/client/js/helpers/docHelpers';

document.querySelectorAll('.docform').forEach(form => {
    form.addEventListener('submit', (ev) => {
        ev.preventDefault();

        return createDoc({ ev, collection: 'repos', redirect: '/dashboard', dataMiddleware: (data) => {
            data.collaborators = [sessionStorage.getItem('currentUserUID')];
            return data;
        } });
    });
});
