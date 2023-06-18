function addListeners() {
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
    
    document.querySelectorAll('.readedit-form').forEach(form => {
        form.addEventListener('submit', (ev) => {
            ev.preventDefault();
            toggleProgress();

            const url = new URL(window.location.href);
            const fields = ev.target.querySelectorAll('[name]');
            const pathname = url.pathname.split('/');
            const docIndex = Number(pathname[pathname.length - 1]);
            const data = {};
    
            fields.forEach(field => (data[field.name] = field.value));
    
            if (isNaN(docIndex)) {
                return alert('Index provided in NaN!');
            }
    
            fetch('/collection/update/document', {
                headers: { 'Content-Type': 'application/json' },
                method: 'put',
                body: JSON.stringify({
                    collectionName: 'tickets',
                    filter: { index: docIndex },
                    data
                })
            }).then(res => res.json()).then(data => {
                toggleProgress();

                if (data.error) {
                    return alert(data.message);
                }
    
                return window.location.reload();
            }).catch(err => {
                toggleProgress();
                return alert(err.message);
            });
        });
    });
}

function toggleProgress() {
    const progress = document.querySelector('progress');
    progress.classList.toggle('active');
}

addListeners();
