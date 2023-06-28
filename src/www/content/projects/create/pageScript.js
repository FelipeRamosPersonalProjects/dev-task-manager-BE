import { createDoc } from '/src/www/client/js/helpers/docHelpers';

document.querySelectorAll('.docform').forEach(form => {
    form.addEventListener('submit', (ev) => {
        ev.preventDefault();

        return createDoc({ ev, collection: 'projects', redirect: '/dashboard', dataMiddleware: (data) => {
            data.templates = data.templates ? JSON.parse(data.templates) : {};
            return data;
        } })
    });
});
