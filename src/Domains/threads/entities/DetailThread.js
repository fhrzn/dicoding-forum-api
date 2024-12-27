class DetailThread {
    constructor(payload) {
        this._validatePayload(payload);

        this.id = payload.id;
        this.title = payload.title;
        this.body = payload.body;
        this.date = payload.created_at
        this.username = payload.ownerName;
        this.comments = payload.comments;
    }

    _validatePayload({ id, title, body, created_at, ownerName, comments }) {
        if (!id || !title || !body || !created_at || !ownerName || !comments) {
            throw new Error('DETAIL_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
        }

        if (typeof id !== 'string' || typeof title !== 'string' || typeof body !== 'string' ||
            typeof created_at !== 'string' || typeof ownerName !== 'string' || !Array.isArray(comments)
        ) {
            throw new Error('DETAIL_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
        }
    }
}

module.exports = DetailThread