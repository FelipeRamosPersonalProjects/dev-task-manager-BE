const schema = {
    additions: {
        type: Number
    },
    blob_url: {
        type: String,
        default: ''
    },
    changes: {
        type: Number
    },
    contents_url: {
        type: String,
        default: ''
    },
    deletions: {
        type: Number
    },
    filename: {
        type: String,
        default: '',
        required: true
    },
    patch: {
        type: String,
        default: ''
    },
    raw_url: {
        type: String,
        default: ''
    },
    sha: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        default: ''
    },
    description: {
        type: String,
        default: ''
    }
};

module.exports = schema;
