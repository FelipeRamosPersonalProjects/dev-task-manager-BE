import { toggleProgress } from '/src/www/client/js/helpers/tools.js';

export async function createDoc({ev, collection, dataMiddleware, redirect}) {
    const fields = ev.target.querySelectorAll('[field]');
    let dataDoc = {};

    if (!collection) {
        return alert(`Collection name wasn't provided`);
    }

    toggleProgress();
    fields.forEach(field => {
        if (field.getAttribute('field-type') === 'html-editor') {
            dataDoc[field.getAttribute('name')] = field.innerHTML;
        }
        
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

        if (field.getAttribute('field-type') === 'input-number') {
            return !isNaN(input.value) ? Number(input.value) : 0;
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

export async function editField({ ev, redirect, dataMiddleware }) {
    let dataDoc = {};

    try {
        const url = new URL(window.location.href);
        const fields = ev.target.querySelectorAll('[field]');
        const pathname = url.pathname.split('/');
        const docIndex = Number(pathname[pathname.length - 1]);
        const collection = ev.target.getAttribute('collection-name');
    
        fields.forEach(field => {
            if (field.getAttribute('field-type') === 'input-number') {
                dataDoc[field.name] = !isNaN(field.value) ? Number(field.value) : 0;
            }
            
            else if (field.getAttribute('field-type') === 'html-editor') {
                dataDoc[field.getAttribute('name')] = field.innerHTML;
            }
            
            else {
                dataDoc[field.name] = field.value;
            }
        });

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
            toggleProgress();
            return alert('Index provided in NaN!');
        }
    
        if (!collection) {
            toggleProgress();
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
            toggleProgress();
            return alert(data.message);
        }
    

        if (redirect) {
            toggleProgress();
            return window.open(redirect, '_self');
        }
    } catch (err) {
        toggleProgress();
        throw alert(err.message);
    }
}

export async function statusTransition({ ev }) {
    const { target } = Object(ev);
    const collection = target.dataset.collection;
    const docUID = target.dataset.docuid;
    const statusID = target.dataset.statusid;

    try {
        const response = await fetch('/collection/update/document', {
            headers: { 'Content-Type': 'application/json' },
            method: 'put',
            body: JSON.stringify({
                collectionName: collection,
                filter: { _id: docUID },
                data: { status: statusID }
            })
        });

        const data = await response.json();
        if (data.error) {
            return alert(data.message);
        }
    } catch (err) {
        throw err;
    }
}
