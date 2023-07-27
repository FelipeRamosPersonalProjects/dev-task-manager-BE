import { editField, statusTransition } from '/src/www/client/js/helpers/docHelpers';
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

window.socketClient.subscribeComponent({
    wrapSelector: '.main-content',
    path: 'content/pullrequests/readEditPullRequest',
    listeners: ($el) => {
        $el.on('click', '.edit-btn, .cancel-btn', handleToggleInput);

        $el.on('submit', '.readedit-form', async (ev) => {
            ev.preventDefault();

            toggleProgress();
            await editField({ ev });
            toggleProgress();
        });

        $el.on('click', '[js="status-button"]', async (ev) => {
            toggleProgress();
            $('[js="status-button"]').map((_, item) => (item.disabled = false));
            ev.target.disabled = true;

            await statusTransition({ ev });
            toggleProgress();
        });

        $el.on('click', '[js="create-pr"]', async function(ev) {
            const $this = $(this);
            const modalID = $this.data('modal-id');
            const modal = await modalCtrl.subscribeModal({
                path: 'ProcessPR',
                data: {
                    modalTitle: 'Pull Request',
                    promptContent: '<p>Starting job...</p>'
                },
                listeners: ($el) => {
                    $el.on('click', (ev) => {
                        if (ev.target.hasAttribute('modal')) {
                            modal.destroy();
                        }
                    });

                    $el.on('click', '[js="minimize-modal"]', () => modal.toggleMinimize());
                    $el.on('click', '[js="close-modal"]', () => modal.destroy());
                },
                dataDependencies: [
                    {
                        name: 'prDoc',
                        type: 'doc',
                        collectionName: 'pull_requests',
                        filter: { index }
                    }
                ]
            });

            $this.data('modal-id', modalID);
        });
    },
    dataDependencies: [
        {
            name: 'pullRequestDoc',
            type: 'doc',
            collectionName: 'pull_requests',
            filter: { index }
        },
        {
            name: 'tickets',
            type: 'list',
            collectionName: 'tickets',
            filter: {
                assignedUsers: { $in: [ userUID ]}
            }
        },
        {
            name: 'tasks',
            type: 'list',
            collectionName: 'tasks',
            filter: {
                assignedUsers: { $in: [ userUID ]}
            }
        },
        {
            name: 'users',
            type: 'list',
            collectionName: 'users',
            filter: {}
        },
        {
            name: 'labels',
            type: 'list',
            collectionName: 'labels',
            filter: {}
        },
        {
            name: 'reviewers',
            type: 'list',
            collectionName: 'users',
            filter: {}
        }
    ]
});
