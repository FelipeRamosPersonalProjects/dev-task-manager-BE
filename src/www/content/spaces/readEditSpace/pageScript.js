import { editField } from '/src/www/client/js/helpers/docHelpers';

document.querySelectorAll('.readedit-form').forEach(form => {
    form.addEventListener('submit', (ev) => {
        ev.preventDefault();
        
        editField({ ev })
    });
});
