import { editField } from '/src/www/client/js/helpers/docHelpers';

document.querySelectorAll('.readedit-form').forEach(form => {
    form.addEventListener('submit', (ev) => {
        ev.preventDefault();
        
        editField({ ev, dataMiddleware: (data) => {
            if (data.templates) {
                data.templates = JSON.parse(data.templates);
            }

            return data;
        } })
    });
});
