class ToolsCLI {
    print(txt) {
        console.log('[dev-desk]: ' + txt);
    }

    printError(err) {
        console.error(`[ERROR][dev-desk][${err.name}]:\n${err.message}\n\n${err.stack}`);
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

    boolAnswer(a, strict) {
        if (a.toLowerCase() === 'y') return true;
        if (a.toLowerCase() === 'n') return false;

        if (strict) throw new Error.Log({
            name: 'BoolAnswerError',
            message: `When the tool boolAnswer is configured to strict mode, it requires a strict answer, "y" or "n"! But received "${a}".`
        });

        return;
    }
}

module.exports = ToolsCLI;
