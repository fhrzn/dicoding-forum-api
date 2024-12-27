const CreateCommentUseCase = require('../../../../Applications/use_case/comments/CreateCommentUseCase');
const DeleteCommentUseCase = require('../../../../Applications/use_case/comments/DeleteCommentUseCase');

class CommentHandler {
    constructor(container) {
        this._container = container;
        this.postCommentHandler = this.postCommentHandler.bind(this);
        this.deleteCommentHandler = this.deleteCommentHandler.bind(this);
    }

    async postCommentHandler(request, h) {
        const { id: userId } = request.auth.credentials;
        const { threadId } = request.params;

        const createCommentUseCase = this._container.getInstance(CreateCommentUseCase.name);
        const addedComment = await createCommentUseCase.execute(request.payload, threadId, userId);
        
        const response = h.response({
            status: 'success',
            data: {
                addedComment,
            },
        });
        
        response.code(201);
        return response;
    }

    async deleteCommentHandler(request, h) {
        const { id: userId } = request.auth.credentials;
        const { threadId, commentId } = request.params;

        const deleteCommentUseCase = this._container.getInstance(DeleteCommentUseCase.name);
        await deleteCommentUseCase.execute(userId, threadId, commentId);

        return {
            status: 'success'
        }
    }
}

module.exports = CommentHandler;