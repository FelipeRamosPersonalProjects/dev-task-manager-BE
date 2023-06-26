export function toggleProgress() {
    const progress = document.querySelector('progress');
    progress.classList.toggle('active');
}

export function toggleEditInput(target) {
    if (target.getAttribute('view') === 'read') {
        target.setAttribute('view', 'edit');
    }

    else if (target.getAttribute('view') === 'edit') {
        target.setAttribute('view', 'read');
    }
}
