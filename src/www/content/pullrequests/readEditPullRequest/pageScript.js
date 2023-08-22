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

function scrollLogs() {
    const scrollableDiv = $('[modal-id="progress-pr"] .prompt');
    const scrollHeight = scrollableDiv.prop('scrollHeight');
    scrollableDiv.scrollTop(scrollHeight);
}

function scrollSteps() {
    const scrollableDiv = $('[modal-id="progress-pr"] .main-display .steps-display');
    const scrollHeight = scrollableDiv.prop('scrollHeight');
    scrollableDiv.scrollTop(scrollHeight);
}

function handlingScrolls() {
    scrollLogs();
    scrollSteps();
}

window.socketClient.subscribeComponent({
    wrapSelector: '.main-content',
    path: 'layouts/MenuContentSidebar',
    listeners: ($el, res) => {
        $el.on('dblclick', '.readedit-form', handleToggleInputDblclick);
        $el.on('click', '.edit-btn, .cancel-btn', handleToggleInput);

        $el.on('submit', '.readedit-form:not(.comment-input)', async (ev) => {
            ev.preventDefault();

            toggleProgress();
            await editField({ ev, collectionName: 'pull_requests' });
            toggleProgress();
        });

        $el.on('click', '[js="status-button"]', async function (ev) {
            if ($(this).hasClass('current-status')) {
                return;
            }
    
            toggleProgress();
            const $this = $(this);
    
            $this.parents('.options-wrap').find('[js=status-button]').removeClass('current-status');
            $this.addClass('current-status');
    
            await statusTransition({ ev });
            $this.parents('.status-input').attr('view', 'read');
            toggleProgress();
        });

        $el.on('change', '[js="branch-switcher"]', function () {
            const $this = $(this);
            const $select = $this.find('select');
            const switchTo = $select.val() || '';
            const repoUID = $this.data('repouid') || '';
            const subscriptionUID = $el.find('[layout]').data('subscription-uid') || '';
            const socketConnectionID = sessionStorage.getItem('socket_id') || '';

            const ajaxBody = {
                repoUID,
                switchTo,
                subscriptionUID,
                socketConnectionID
            };

            $.ajax({
                url: '/repositories/switch-branch',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(ajaxBody),
                error: function(error) {
                    throw error.responseJSON || error;
                }
            });
        });

        $el.on('submit', '[js="add-comment"]', function (ev) {
            ev.preventDefault();
            const $form = $(this);
            const $input = $form.find('[field]');
            const prUID = $form.data('pruid');
            const value = $input.html();

            const ajaxBody = {
                collectionName: 'comments',
                data: {
                    commentType: 'PR',
                    author: userUID,
                    body: value,
                    pullRequest: prUID
                }
            };

            $.ajax({
                url: '/collection/create',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(ajaxBody),
                error: function(error) {
                    throw error.responseJSON || error;
                }
            });
        });

        $el.on('submit', '[js="edit-comment"]', function (ev) {
            ev.preventDefault();
            const $form = $(this);
            const $bodyField = $form.find('[field]');
            const bodyContent = $bodyField.html();
            
            let commentIndex = $form.data('commentindex');
            if (!isNaN(commentIndex)) {
                commentIndex = Number(commentIndex);
            } else {
                throw 'The comment index should be a valid number, but received NaN!';
            }

            if (!bodyContent) {
                throw 'Body field is "undefined"!'
            }

            const ajaxBody = {
                collectionName: 'comments',
                filter: { index: commentIndex },
                data: {
                    body: bodyContent
                }
            };

            $.ajax({
                url: '/collection/update/document',
                type: 'PUT',
                contentType: 'application/json',
                data: JSON.stringify(ajaxBody),
                error: function(error) {
                    throw error.responseJSON || error;
                }
            });
        });

        $el.on('click', '[js="create-pr"]', async function (ev) {
            const $this = $(this);
            const modalID = $this.data('modal-id');
            const modal = await modalCtrl.subscribeModal({
                path: 'ProcessPR',
                data: {
                    stepBegin: { isCurrentClass: true }
                },
                onSuccess: () => handlingScrolls(),
                onData: () => handlingScrolls(),
                dataDependencies: [
                    {
                        name: 'prDoc',
                        type: 'doc',
                        collectionName: 'pull_requests',
                        filter: { index }
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
                ],
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

                    $el.on(
                        'click',
                        '[js="step-prepare:create-recommended"], [js="step-prepare:create-branch"], [js="step-prepare:switch-branch"], [js="step-prepare:staycurrent"], [js="step-prepare:skip"]',
                        async function () {
                            const $input = $el.find('.question-wrap.custom-name [name="branch-name"]');
                            const ajaxBody = {};

                            if ($(this).attr('js') === 'step-prepare:create-branch') {
                                ajaxBody.customBranchName = $input.val().trim();
                            }

                            if ($(this).attr('js') === 'step-prepare:skip') {
                                ajaxBody.skip = true;
                            }

                            if ($(this).attr('js') === 'step-prepare:staycurrent') {
                                ajaxBody.stayCurrent = true;
                            }
                            
                            if ($(this).attr('js') === 'step-prepare:switch-branch') {
                                ajaxBody.switchBranch = true;
                            }

                            $.ajax({
                                url: '/pulls/prepare',
                                type: 'POST',
                                contentType: 'application/json',
                                data: JSON.stringify(ajaxBody),
                                error: function(error) {
                                    throw error.responseJSON || error;
                                }
                            });
                        }
                    );

                    $el.on('click', '[js="step-commit:skip"], [js="step-commit:load-changes"], [js="step-commit:create"]', async function () {
                        const $this = $(this);
                        const ajaxBody = {};

                        if ($this.attr('js') === 'step-commit:skip') {
                            ajaxBody.skip = true;
                        }

                        if ($this.attr('js') === 'step-commit:load-changes') {
                            ajaxBody.loadChanges = true;
                        }

                        if ($this.attr('js') === 'step-commit:create') {
                            const $form = $el.find('form[js="commit-form"]');
                            const $title = $form.find('[field][name=commitTitle]');
                            const $description = $form.find('[field][name=commitDescription]');

                            ajaxBody.commitData = {
                                title: $title.length ? $title.val() : '',
                                description: $title.length ? $description.text() : ''
                            };
                        }

                        $.ajax({
                            url: '/pulls/commit',
                            type: 'POST',
                            contentType: 'application/json',
                            data: JSON.stringify(ajaxBody),
                            error: function(error) {
                                throw error.responseJSON || error;
                            }
                        });
                    });

                    $el.on('click', '[js="step-push"], [js="step-push:skip"]', async function () {
                        const $this = $(this);
                        const ajaxBody = {};

                        if ($this.attr('js') === 'step-push:skip') {
                            ajaxBody.skip = true;
                        } else {
                            ajaxBody.push = true;
                        }

                        $.ajax({
                            url: '/pulls/publish',
                            type: 'POST',
                            contentType: 'application/json',
                            data: JSON.stringify(ajaxBody),
                            error: function(error) {
                                throw error.responseJSON || error;
                            }
                        });
                    });

                    $el.on('click', '[js="step-changesdescription"]', async function () {
                        const $form = $el.find('form[js="changes-form"]');
                        const $fileChanges = $form.find('[js="file-change"]');
                        const ajaxBody = { fileChanges: [] };

                        $fileChanges.map(function () {
                            const $file = $(this);
                            const filename = $file.attr('filename');
                            const fileDesc = $file.find('[name="description"]').text();

                            if (filename && fileDesc) {
                                ajaxBody.fileChanges.push({ filename, description: fileDesc });
                            }
                        });

                        $.ajax({
                            url: '/pulls/changes-description',
                            type: 'POST',
                            contentType: 'application/json',
                            data: JSON.stringify(ajaxBody),
                            error: function(error) {
                                throw error.responseJSON || error;
                            }
                        });
                    });

                    $el.on('click', '[js="step-createpr"]', async function () {
                        $.ajax({
                            url: '/pulls/create',
                            type: 'POST',
                            contentType: 'application/json',
                            data: JSON.stringify({}),
                            error: function(error) {
                                throw error.responseJSON || error;
                            }
                        });
                    });
                }
            });
        });
    },
    dataDependencies: [
        {
            name: 'pullRequest',
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
