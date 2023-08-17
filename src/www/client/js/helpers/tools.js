export function toggleProgress() {
    // const progress = document.querySelector('progress');
    // progress.classList.toggle('active');
}

export function toggleEditInput(target) {
    if (target.getAttribute('view') === 'read') {
        target.setAttribute('view', 'edit');
    }

    else if (target.getAttribute('view') === 'edit') {
        target.setAttribute('view', 'read');
    }
}

export function $toggleEditInput($target) {
    if ($target.attr('view') === 'read') {
        $target.attr('view', 'edit');
    }

    else if ($target.attr('view') === 'edit') {
        $target.attr('view', 'read');
    }
}

export function handleToggleInputDblclick() {
    const $this = $(this);
    
    if ($this.attr('view') !== 'edit') {
        $toggleEditInput($this);
    }
}
