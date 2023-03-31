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

    printTable(data, options) {
        const {headers} = options || {};
        let tableData = {...data};
        
        if (typeof tableData === 'object') {
            console.table(tableData, headers);
        }
    }
}

module.exports = ToolsCLI;
