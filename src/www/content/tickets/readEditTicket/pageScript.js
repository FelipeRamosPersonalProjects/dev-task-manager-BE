import { editField } from '/src/www/client/js/helpers/docHelpers';

window.addEventListener('load', () => {
    document.querySelectorAll('.readedit-form').forEach(form => {
        form.addEventListener('submit', (ev) => {
            ev.preventDefault();
            
            editField({ ev });
        });
    });

    const urlParsed = window.location.pathname.split('/');
    const index = urlParsed[urlParsed.length - 1];
   
    window.socketClient.subscribeDOC({
        collectionName: 'tickets',
        filter: { index: Number(index) },
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
