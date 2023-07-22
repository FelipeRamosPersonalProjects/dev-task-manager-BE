import { editField, statusTransition } from '/src/www/client/js/helpers/docHelpers';
import ClientComponent from '/src/www/client/js/services/ClientComponent';
import { $toggleEditInput } from '/src/www/client/js/helpers/tools';

const urlParsed = window.location.pathname.split('/');
const index = urlParsed[urlParsed.length - 1];

function handleToggleInput() {
    const $wrap = $(this).parents('.readedit-form');
    $toggleEditInput($wrap);
}

window.socketClient.subscribeDOC({
    collectionName: 'pull_requests',
    filter: { index: Number(index) },
    onSuccess: () => {
        console.log('Subscribed!');
    },
    onError: (err) => {
        console.error(err);
    },
    onData: async (data) => {
        const pageData = $('body').data('body');
        const component = new ClientComponent({
            path: 'content/pullrequests/readEditPullRequest',
            data: {
                ...pageData.settings,
                pullRequestDoc: data
            },
            listeners: [
                {
                    eventName: 'click',
                    selector: '.edit-btn',
                    handler: handleToggleInput
                },
                {
                    eventName: 'click',
                    selector: '.cancel-btn',
                    handler: handleToggleInput
                },
                {
                    eventName: 'submit',
                    selector: '.readedit-form',
                    handler: (ev) => {
                        ev.preventDefault();
                        editField({ ev });
                    }
                },
                {
                    eventName: 'click',
                    selector: '[js="status-button"]',
                    handler: async function (ev) {
                        toggleProgress();
                        $('[js="status-button"]').map((_, item) => (item.disabled = false));
                        ev.target.disabled = true;
            
                        await statusTransition({ ev });
                        toggleProgress();
                    }
                }
            ]
        });
        
        const $component = await component.load();
        $('.document-wrap').html($component);
    }
});
