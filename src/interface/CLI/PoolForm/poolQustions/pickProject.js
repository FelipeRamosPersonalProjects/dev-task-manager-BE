const ListTileTemplate = require('@CLI/templates/ListTiles');
const CRUD = require('@CRUD');

module.exports = {
    id: 'pickProject',
    next: 'chooseRepo',
    text: `Which project do you like to save the stash? Enter the index number on the list above: `,
    events: {
        onTrigger: async (ev) => {
            try {
                const projects = await CRUD.query({ collectionName: 'projects', filter: {}}).initialize(true);
                if (projects instanceof Error.Log) {
                    return ev.trigger();
                }

                projects.map((item, index) => {
                    item.index = String(item.index);
                    projects[index] = item;
                });
                const template = new ListTileTemplate({
                    items: projects
                });

                ev.setValue('projects', projects);
                return template.printOnScreen();
            } catch (err) {
                throw new Error.Log('database.querying_collection', data);
            }
        },
        onAnswer: async (ev, {}, answer) => {
            try {
                const projects = ev.getValue('projects');
                if (isNaN(answer)) {
                    return ev.trigger();
                }

                const project = projects.find(proj => proj.index === answer);
                if (!project) {
                    return ev.trigger();
                }

                project.repos.map((item, index) => {
                    item.index = String(item.index);
                    project.repos[index] = item;
                });
                const template = new ListTileTemplate({
                    items: project.repos
                });

                ev.setValue('choosedProject', project);
                return template.printOnScreen();
            } catch (err) {
                throw new Error.Log(err);
            }
        }
    }
};
