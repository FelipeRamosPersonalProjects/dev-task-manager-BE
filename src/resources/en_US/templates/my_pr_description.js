const Component = require('@interface/Component');
const FileChange = require('./default_file_change');

class MyPrDescription extends Component {
    constructor(settings) {
        super(settings, {
            ticketURL: {
                type: String,
                required: true
            },
            taskURL: {
                type: String,
                required: true
            },
            summary: {
                type: String,
                default: ''
            },
            fileChanges: {
                type: [],
                default: []
            },
            images: {
                type: [String],
                default: []
            },
            videos: {
                type: [String],
                default: []
            }
        });

        const { ticketURL, taskURL, summary, fileChanges, images, videos } = Object(settings || {});

        this.SOURCE_PATH = require.resolve('./source/my_pr_description.md');
        this.ticketURL = ticketURL;
        this.taskURL = taskURL;
        this.summary = summary;
        this.fileChanges = fileChanges;
        this.images = images;
        this.videos = videos;
        this.types = {
            FileChange
        };
    }
}

module.exports = MyPrDescription;
