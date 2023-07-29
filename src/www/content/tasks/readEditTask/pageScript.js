import { editField } from '/src/www/client/js/helpers/docHelpers';

document.querySelectorAll('.readedit-form').forEach(form => {
    form.addEventListener('submit', (ev) => {
        ev.preventDefault();
        
        editField({ ev })
    });
});

document.querySelectorAll('[js="create-pr"]').forEach(button => {
    button.addEventListener('click', function () {
        const $this = $(this);
        const url = new URL(window.location.origin + '/pullrequests/create');

        url.searchParams.set('ticket', $this.data('ticketid'));
        url.searchParams.set('task', $this.data('taskid'));
        
        window.open(url.toString(), '_self');
    });
});
