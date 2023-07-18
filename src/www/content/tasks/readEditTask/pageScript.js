import { editField } from '/src/www/client/js/helpers/docHelpers';

document.querySelectorAll('.readedit-form').forEach(form => {
    form.addEventListener('submit', (ev) => {
        ev.preventDefault();
        
        editField({ ev })
    });
});

document.querySelectorAll('[js="create-pr"]').forEach(button => {
    button.addEventListener('click', ev => {
        const currentTask = JSON.parse(ev.target.dataset.task);
        const url = new URL(window.location.origin + '/pullrequests/create');

        url.searchParams.set('ticket', currentTask.ticket._id);
        url.searchParams.set('task', currentTask._id);
        url.searchParams.set('base', 'develop');
        url.searchParams.set('head', 'feature/TASKHRE');
        
        window.open(url.toString(), '_self');
    });
});
