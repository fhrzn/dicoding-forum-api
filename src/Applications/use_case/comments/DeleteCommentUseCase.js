class DeleteCommentUseCase {
    constructor({ threadRepository, commentRepository }) {
        this._threadRepository = threadRepository;
        this._commentRepository = commentRepository;
    }

    async execute(userId, threadId, commentId) {
        await this._threadRepository.verifyThreadExist(threadId);
        await this._commentRepository.verifyCommentExist(commentId);
        await this._commentRepository.verifyCommentOwner(commentId, userId);
        
        return await this._commentRepository.deleteComment(threadId, commentId);
    }
}

module.exports = DeleteCommentUseCase;