function getFormFields(form) {

}

async function createDoc({ev, collection, dataMiddleware, redirect}) {
    const fields = ev.target.querySelectorAll('[field]');
    let dataDoc = {};

    if (!collection) {
        return alert(`Collection name wasn't provided`);
    }

    toggleProgress();
    fields.forEach(field => {
        if (field.getAttribute('field-type') === 'single-relation') {
            const input = field.querySelector('[relation-input]');
            const fieldName = field.getAttribute('name');

            return (dataDoc[fieldName] = input.value);
        }

        if (field.getAttribute('field-type') === 'multi-relation') {
            const inputs = field.querySelectorAll('[relation-input] [relation-option]');
            const fieldName = field.getAttribute('name');
            const value = [];

            inputs.forEach(option => {
                if (option.checked) {
                    value.push(option.value);
                }
            });

            return (dataDoc[fieldName] = value);
        }

        return (dataDoc[field.name] = field.value);
    });
    
    if (typeof dataMiddleware === 'function') {
        dataDoc = dataMiddleware(dataDoc) || dataDoc;
    }

    dataDoc.author = sessionStorage.getItem('currentUserUID');

    try {
        const response = await fetch('/collection/create', {
            headers: { 'Content-Type': 'application/json' },
            method: 'post',
            body: JSON.stringify({
                collectionName: collection,
                data: dataDoc
            })
        });
        
        const data = await response.json();

        if (data.error) {
            return alert(data.message);
        }

        if (!redirect) {
            redirect = '/dashboard';
        }

        return window.open(redirect, '_self');
    } catch (err) {
        toggleProgress();
        throw alert(err.message)
    }
}

async function editField({ ev, redirect, dataMiddleware }) {
    let dataDoc = {};

    try {
        toggleProgress();

        const url = new URL(window.location.href);
        const fields = ev.target.querySelectorAll('[field]');
        const pathname = url.pathname.split('/');
        const docIndex = Number(pathname[pathname.length - 1]);
        const collection = ev.target.getAttribute('collection-name');
    
        fields.forEach(field => (dataDoc[field.name] = field.value));

        if (ev.target.getAttribute('field-type') === 'multi-relation') {
            const fieldName = ev.target.getAttribute('name');
            const options = ev.target.querySelectorAll('[relation-input] [relation-option]');

            dataDoc[fieldName] = [];
            options.forEach(opt => {
                if (opt.checked) {
                    dataDoc[fieldName].push(opt.value);
                }
            })
        }

        if (ev.target.getAttribute('field-type') === 'single-relation') {
            const input = ev.target.querySelector('[relation-input]');
            const fieldName = ev.target.getAttribute('name');

            dataDoc[fieldName] = input.value;
        }
    
        if (isNaN(docIndex)) {
            return alert('Index provided in NaN!');
        }
    
        if (!collection) {
            return alert(`Collection name wasn't provided`);
        }

        if (dataMiddleware) {
            dataDoc = dataMiddleware(dataDoc) || dataDoc;
        }

        const response = await fetch('/collection/update/document', {
            headers: { 'Content-Type': 'application/json' },
            method: 'put',
            body: JSON.stringify({
                collectionName: collection,
                filter: { index: docIndex },
                data: dataDoc
            })
        });

        const data = await response.json();
        if (data.error) {
            return alert(data.message);
        }
    

        if (redirect) {
            return window.open(redirect, '_self');
        }

        return window.location.reload();
    } catch (err) {
        toggleProgress();
        throw alert(err.message);
    }
}

function addListeners() {
    const readEditForms = document.querySelectorAll('.readedit-form');
    const deleteDocBtns = document.querySelectorAll('[js=delete-doc]');
    
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
    })
}

function toggleProgress() {
    const progress = document.querySelector('progress');
    progress.classList.toggle('active');
}

addListeners();
