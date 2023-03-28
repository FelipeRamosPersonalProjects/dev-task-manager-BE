class ToolsCLI {
    print(txt) {
        console.log('[dev-task]: ' + txt);
    }

    printTemplate(stringContent) {
        if (typeof stringContent === 'string') {
            console.log(stringContent || '');
        }
    }

    printTable(data, headers) {
        if (Array.isArray(data)) {
            console.table(data, headers);
        }
    }
}

module.exports = ToolsCLI;
