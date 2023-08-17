$('body').on('click', '[js="open-vscode"]', function () {
    const $this = $(this);
    const repoUID = $this.data('repouid');

    if (repoUID) {
        const ajaxBody = {
            editorID: 'vscode',
            repoUID
        };

        $.ajax({
            url: '/repositories/open-editor',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(ajaxBody),
            error: function(error) {
                throw error.responseJSON || error;
            }
        });
    }
});
