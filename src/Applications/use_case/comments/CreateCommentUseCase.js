const CreateComment = require('../../../Domains/comments/entities/CreateComment');

class CreateCommentUseCase {
    constructor({ threadRepository, commentRepository }) {
        this._threadRepository = threadRepository;
        this._commentRepository = commentRepository;
    }

    async execute(payload, threadId, userId) {
        await this._threadRepository.verifyThreadExist(threadId)
        const createComment = new CreateComment(payload);
        
        return await this._commentRepository.createComment(createComment, threadId, userId);
    }
}

module.exports = CreateCommentUseCase