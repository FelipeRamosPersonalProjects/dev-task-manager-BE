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

function handleToggleInputDblclick(ev) {
    const $this = $(this);
    
    if ($this.attr('view') !== 'edit') {
        $toggleEditInput($this);
    }
}

window.socketClient.subscribeComponent({
    wrapSelector: '.main-content',
    path: 'content/pullrequests/readEditPullRequest',
    listeners: ($el) => {
        $el.on('dblclick', '.readedit-form', handleToggleInputDblclick);
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

        $el.on('click', '[js="create-pr"]', async function (ev) {
            const $this = $(this);
            const modalID = $this.data('modal-id');
            const modal = await modalCtrl.subscribeModal({
                path: 'ProcessPR',
                data: {
                    promptContent: '<p>Starting job...</p>',
                    stepBegin: { isCurrentClass: true }
                },
                listeners: ($el) => {
                    $el.on('click', (ev) => {
                        if (ev.target.hasAttribute('modal')) {
                            modal.toggleMinimize();
                        }
                    });

                    $el.on('click', '[js="minimize-modal"]', () => modal.toggleMinimize());
                    $el.on('click', '[js="close-modal"]', () => modal.destroy());

                    $el.on('dblclick', '.readedit-form', handleToggleInputDblclick);
                    $el.on('click', '.edit-btn, .cancel-btn', handleToggleInput);
                    $el.on('submit', '.readedit-form', async (ev) => {
                        ev.preventDefault();
            
                        toggleProgress();
                        await editField({ ev, collectionName: 'pull_requests' });
                        toggleProgress();
                    });

                    $el.on('click', '[js="step-begin"], [js="step-begin:ignore"], [js="step-begin:switchbranch:base"]', async function() {
                        const $componentWrap = $(this).parents('[subscription-uid]');
                        const subscriptionUID = $componentWrap.attr('subscription-uid');
                        const socketConnectionID = sessionStorage.getItem('socket_id');
                        const ajaxBody = { prIndex: index, subscriptionUID, socketConnectionID };

                        if ($(this).attr('js') === 'step-begin:ignore') {
                            ajaxBody.ignoreBranchName = true;
                        }

                        if ($(this).attr('js') === 'step-begin:switchbranch:base') {
                            ajaxBody.switchToBase = true;
                        }

                        $.ajax({
                            url: '/pulls/begin',
                            type: 'POST',
                            contentType: 'application/json',
                            data: JSON.stringify(ajaxBody),
                            error: function(error) {
                                throw error.responseJSON || error;
                            }
                        });
                    });
                },
                dataDependencies: [
                    {
                        name: 'prDoc',
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
                            assignedUsers: { $in: [ userUID ] }
                        }
                    },
                    {
                        name: 'projects',
                        type: 'list',
                        collectionName: 'projects',
                        filter: {}
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
