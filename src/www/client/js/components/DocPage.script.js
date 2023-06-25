function readEditFormListeners() {
    const readEditForms = document.querySelectorAll('.readedit-form');
    
    readEditForms.forEach(item => {
        const editBtn = item.querySelector('.edit-btn');
        const cancelBtn = item.querySelector('.cancel-btn');
    
        editBtn && editBtn.addEventListener('click', (ev) => {
            item.setAttribute('view', 'edit');
        });
    
        cancelBtn && cancelBtn.addEventListener('click', (ev) => {
            item.setAttribute('view', 'read');
        });
    });
}

function deleteButtonListeners() {
    const deleteDocBtns = document.querySelectorAll('[js=delete-doc]');

    deleteDocBtns.forEach(button => {
        button.addEventListener('click', async (ev) => {
            try {
                const collection = ev.target.dataset.collection;
                const docuid = ev.target.dataset.docuid;
                
                const response = await fetch('/collection/delete', {
                    headers: { 'Content-Type': 'application/json' },
                    method: 'delete',
                    body: JSON.stringify({
                        collectionName: collection,
                        filter: docuid
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

(function () {
    readEditFormListeners();
    deleteButtonListeners();
})();
