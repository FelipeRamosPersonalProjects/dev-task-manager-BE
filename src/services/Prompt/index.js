const { execSync, exec, spawn } = require('child_process');
const readline = require('readline');
const ToolsCLI = require('../../interface/CLI/ToolsCLI');
const toolsCLI = new ToolsCLI();

class Prompt {
    constructor(setup = {
        rootPath: ''
    }) {
        const {rootPath} = setup || {};

        this.rootPath = rootPath;
    }

    cmd(command, options) {
        try {
            if (command) {
                const cmd = execSync(command, {cwd: this.rootPath, ...options});

                if (cmd) {
                    const output = cmd.toString();
                    
                    output && toolsCLI.print(output);
                    return {
                        success: true,
                        out: output
                    };
                }

                return new Error.Log(cmd);
            } else {
                return '>> No command provided!'
            }
        } catch(err) {
            return new Error.Log(err);
        }
    }

    async exec(cmd) {
        console.log('>> Starting prompt...');

        return new Promise((resolve, reject) => {
            try {
                const child = exec(cmd, {cwd: this.rootPath}, (err, stdout, stderr) => {
                    if (err) {
                        console.error(stderr);
                        return reject(new Error.Log(err));
                    }
    
                    return resolve({
                        success: true,
                        out: stdout,
                        prompt: child
                    });
                });
            } catch(err) {
                return reject(new Error.Log(err));
            }
        });
    }

    async question(questionText) {
        return new Promise((resolve, reject) => {
            try {
                const rl = readline.createInterface({
                    input: process.stdin,
                    output: process.stdout
                });
    
                rl.question(questionText, (answer) => {
                    rl.close();
                    resolve(answer);
                });
            } catch(err) {
                reject(err);
            }
        });
    }

    strigifyParams(params) {
        let stringParams = '';

        if (!params) {
            return '';
        }

        try {
            if (Array.isArray(params)) {
                for (let i = 0; params.length; i = i + 2) {
                    const [key, value] = params;
                    stringParams += ' --' + key + '=' + value;
                }
            } else if (typeof params === 'object') {
                Object.keys(params || {}).map(key => {
                    stringParams += ' --' + key + '=' + params[key];
                });
            } 
            
            if (typeof params === 'string') {
                stringParams = params;
            }
    
            return stringParams;
        } catch(err) {
            throw new Error.Log(err);
        }
    }
}

module.exports = Prompt;
