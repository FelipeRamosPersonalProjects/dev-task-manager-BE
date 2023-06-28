import { statusTransition } from '/src/www/client/js/helpers/docHelpers';
import { toggleEditInput } from '/src/www/client/js/helpers/tools';

function readEditFormListeners() {
    const readEditForms = document.querySelectorAll('.readedit-form');
    
    readEditForms.forEach(item => {
        const editBtn = item.querySelector('.edit-btn');
        const cancelBtn = item.querySelector('.cancel-btn');
    
        editBtn && editBtn.addEventListener('click', () => toggleEditInput(item));
        cancelBtn && cancelBtn.addEventListener('click', () => toggleEditInput(item));
    });
}

function statusButtonsListeners() {
    document.querySelectorAll('.readedit-form').forEach(form => {
        const statusButtons = form.querySelectorAll('[js=status-button]');

        statusButtons && statusButtons.forEach(button => {
            button.addEventListener('click', async (ev) => {
                toggleProgress();
                statusButtons.forEach(item => (item.disabled = false));
                ev.target.disabled = true;
    
                await statusTransition({ ev });
                toggleProgress();
            });
        });
    });
}

function deleteButtonListeners() {
    const deleteDocBtns = document.querySelectorAll('[js=delete-doc]');

    deleteDocBtns.forEach(button => {
        button.addEventListener('click', async (ev) => {
            const confirm = window.confirm('Do you confirm to delete this document? It will be permanent!');
            if (!confirm) return;

            try {
                const collection = ev.target.dataset.collection;
                const docuid = ev.target.dataset.docuid;

                const response = await fetch('/collection/delete', {
                    headers: { 'Content-Type': 'application/json' },
                    method: 'delete',
                    body: JSON.stringify({
                        collectionName: collection,
                        filter: {_id: docuid}
                    })
                });

                const data = await response.json();

                if (data.deleted) {
                    window.open('/dashboard', '_self');
                } else {
                    alert('Something went wrong when deleting the document from database!');
                }
            } catch (err) {
                throw alert(err.message);
            }
        })
    });
}

window.addEventListener('load', () => {
    readEditFormListeners();
    deleteButtonListeners();
    statusButtonsListeners();
});
