const StringTemplateBuilder = require('@interface/StringTemplateBuilder');

module.exports = {
    id: 'commitDescription',
    next: 'commitChanges',
    text: `Do you want to add description to the commit files (Y/N)?`,
    events: {
        onAnswer: async (event, {boolAnswer}, answer) => {
            if (boolAnswer(answer)) {
                const PoolForm = require('@CLI/PoolForm');
                const task = event.getValue('task');

                const currentChanges = event.getValue('currentChanges') || await task.repoManager.currentChanges();
                if (currentChanges instanceof Error.Log) {
                    throw currentChanges;
                }

                return new Promise(async (resolve, reject) => {
                    const poolForm = new PoolForm({
                        events: {
                            onEnd: async (ev) => {
                                event.setValue('commitFileChanges', currentChanges.changes);
                                return resolve(ev);
                            }
                        }
                    });

                    if (currentChanges && Array.isArray(currentChanges.changes)) {
                        const changes = currentChanges.changes;

                        for (let i = 0; i < changes.length; i++) {
                            const next = ((i + 1) < changes.length) ? String(i + 1) : '';
                            const id = String(i);
                            const change = changes[i];

                            poolForm.setQuestion({
                                id,
                                next,
                                text: new StringTemplateBuilder().newLine()
                                    .text(change.patch).newLine().newLine()
                                    .text(`Filepath: ${change.filename}`).newLine().newLine()
                                    .text('Description: ')
                                .end(),
                                events: {
                                    onAnswer: async (_, __, answer) => {
                                        change.description = answer;
                                        return _;
                                    }
                                }
                            });
                        };
                    }

                    await poolForm.start();
                });
            }
        }
    }
};
