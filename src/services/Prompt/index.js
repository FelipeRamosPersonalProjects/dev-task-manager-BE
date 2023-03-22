const { spawnSync, exec } = require('child_process');

class Prompt {
    constructor(setup = {
        rootPath: ''
    }) {
        const {rootPath} = setup || {};

        this.rootPath = rootPath;
        this.goTo(rootPath);
    }

    cmd(command, arg, options) {
        try {
            if (command) {
                const cmd = spawnSync(command, arg, options);
                return {
                    success: true,
                    out: cmd.stdout.toString()
                };
            } else {
                return '>> No command provided!'
            }
        } catch(err) {
            throw new Error.Log(err);
        }
    }

    async exec(cmd) {
        console.log('>> Starting prompt...');

        return new Promise((resolve, reject) => {
            try {
                const child = exec(cmd, (err, stdout, stderr) => {
                    if (err) {
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

    goTo(path) {
        try {
            const options = { cwd: this.repoPath, env: process.env };
            return this.cmd('cmd', ['/c', `cd ${path}`], options);
        } catch(err) {
            throw new Error.Log(err);
        }
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
