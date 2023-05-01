const ViewCLI = require('@CLI/ViewCLI');
const PoolForm = require('@CLI/PoolForm');

async function PushView() {
    const view = new ViewCLI({
        name: 'push',
        poolForm: new PoolForm({
            questions: [
                PoolForm.getQuestion('chooseRepoFromUser', { next: 'pushCommit' }),
                PoolForm.getQuestion('pushCommit')
            ]
        }, this)
    }, this);

    return view;
}

module.exports = PushView;
