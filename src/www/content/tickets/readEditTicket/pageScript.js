import { editField } from '/src/www/client/js/helpers/docHelpers';

window.addEventListener('load', () => {
    document.querySelectorAll('.readedit-form').forEach(form => {
        form.addEventListener('submit', (ev) => {
            ev.preventDefault();
            
            editField({ ev });
        });
    });
})
