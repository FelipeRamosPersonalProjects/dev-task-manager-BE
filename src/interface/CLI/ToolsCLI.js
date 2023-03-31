class ToolsCLI {
    print(txt) {
        console.log('[dev-task]: ' + txt);
    }

    printError(err) {
        console.error('[ERROR][dev-task]: ' + err.message + '\n');
    }

    printTemplate(stringContent) {
        if (typeof stringContent === 'string') {
            console.log(stringContent || '');
        }
    }

    printTable(data, headers) {
        if (typeof data === 'object') {
            console.table(data, headers);
        }
    }
}

module.exports = ToolsCLI;
