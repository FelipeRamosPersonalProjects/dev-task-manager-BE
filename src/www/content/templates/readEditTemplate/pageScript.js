import { editField } from '/src/www/client/js/helpers/docHelpers';
import { $toggleEditInput } from '/src/www/client/js/helpers/tools';

const urlParsed = window.location.pathname.split('/');
const index = Number(urlParsed[urlParsed.length - 1]);
const userUID = sessionStorage.getItem('currentUserUID');

if (!userUID) {
    throw (location.href = '/user/signin');
}

function handleToggleInput() {
    const $wrap = $(this).parents('.readedit-form');
    $toggleEditInput($wrap);
}

function handleToggleInputDblclick(ev) {
    const $this = $(this);
    
    if ($this.attr('view') !== 'edit') {
        $toggleEditInput($this);
    }
}

window.socketClient.subscribeComponent({
    wrapSelector: '.main-content',
    path: 'content/templates/readEditTemplate',
    listeners: ($el) => {
        $el.on('dblclick', '.readedit-form', handleToggleInputDblclick);
        $el.on('click', '.edit-btn, .cancel-btn', handleToggleInput);

        $el.on('submit', '.readedit-form', async (ev) => {
            ev.preventDefault();

            toggleProgress();
            await editField({ ev });
            toggleProgress();
        });
    },
    dataDependencies: [
        {
            name: 'templateDoc',
            type: 'doc',
            collectionName: 'templates',
            filter: { index }
        },
        {
            name: 'projects',
            type: 'list',
            collectionName: 'projects',
            filter: {}
        },
        {
            name: 'spaces',
            type: 'list',
            collectionName: 'space_desks',
            filter: {}
        },
        {
            name: 'typeComponents',
            type: 'list',
            collectionName: 'templates',
            filter: {}
        }
    ]
});
