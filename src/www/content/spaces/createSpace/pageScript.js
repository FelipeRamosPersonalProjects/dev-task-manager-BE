import { createDoc } from '/src/www/client/js/helpers/docHelpers';

document.querySelector('.docform').addEventListener('submit', (ev) => {
    ev.preventDefault();
    
    createDoc({ ev, collection: 'space_desks', dataMiddleware: (data) => {
        data.owner = sessionStorage.getItem('currentUserUID');
        return data;
    } });
});
