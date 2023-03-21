const { spawnSync, exec } = require('child_process');

class Prompt {
    constructor(setup = {
        rootPath: ''
    }) {
        const {rootPath} = setup || {};

        this.rootPath = rootPath;
        this.goTo(rootPath);
    }

    cmd(command) {
        try {
            if (command) {
                return spawnSync(`${command}`);
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
    
                    console.log('>> Executed: ', cmd);
                    console.log(`>>>> ${stdout}`);
                    console.error(`stderr: ${stderr}`);
    
                    return resolve(child);
                });
            } catch(err) {
                return reject(new Error.Log(err));
            }
        });
    }

    goTo(path) {
        try {
            return this.cmd(`cd ${path || this.rootPath}`);
        } catch(err) {
            throw new Error.Log(err);
        }
    }
}

module.exports = Prompt;
