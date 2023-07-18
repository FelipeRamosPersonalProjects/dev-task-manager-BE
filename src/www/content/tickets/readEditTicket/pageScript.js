import { editField } from '/src/www/client/js/helpers/docHelpers';

window.addEventListener('load', () => {
    document.querySelectorAll('.readedit-form').forEach(form => {
        form.addEventListener('submit', (ev) => {
            ev.preventDefault();
            
            editField({ ev });
        });
    });


    window.socketClient.subscribeDOC({
        collectionName: 'tickets',
        filter: { index: 0 },
        onSuccess: () => {
            console.log('Subscribed!');
        },
        onError: (err) => {
            console.error(err);
        },
        onData: (data) => {
            console.log('Data received: ', data);
        }
    })
});
