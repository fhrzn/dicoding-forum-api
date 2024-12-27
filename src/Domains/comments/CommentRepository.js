class CommentRepository {
    async createComment(comment, threadId, userId) {
        throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    }

    async getCommentsByThreadId(threadId) {
        throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    }

    async getCommentById(commentId) {
        throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    }

    async deleteComment(threadId, commentId) {
        throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    }

    async verifyCommentExist(commentId) {
        throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    }

    async verifyCommentOwner(commentId, userId) {
        throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    }
    
}

module.exports = CommentRepository;