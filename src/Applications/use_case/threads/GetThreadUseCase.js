const DetailThread = require('../../../Domains/threads/entities/DetailThread');

class GetThreadUseCase {
    constructor({ userRepository, threadRepository, commentRepository }) {
        this._userRepository = userRepository;
        this._threadRepository = threadRepository;
        this._commentRepository = commentRepository;
    }

    async execute(threadId) {
        const thread = await this._threadRepository.getThreadById(threadId);
        const user = await this._userRepository.getUserById(thread.owner);

        const detailThread = new DetailThread({
            id: thread.id,
            title: thread.title,
            body: thread.body,
            created_at: thread.created_at.toString(),
            ownerName: user.username,
            comments: [],
        });

        const comments = await this._commentRepository.getCommentsByThreadId(threadId);
        for (const c of comments) {
            const { username } = await this._userRepository.getUserById(c.owner);

            // c.owner = username
            detailThread.comments.push({
                id: c.id,
                username: username,
                date: c.created_at,
                content: c.soft_delete ? "**komentar telah dihapus**" : c.content
            });
        }

        return detailThread;
    }
}

module.exports = GetThreadUseCase;