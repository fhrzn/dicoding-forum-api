const CreateThreadUseCase = require('../../../../Applications/use_case/threads/CreateThreadUseCase');
const GetThreadUseCase = require('../../../../Applications/use_case/threads/GetThreadUseCase');

class ThreadsHandler {
    constructor(container) {
        this._container = container;

        this.postThreadHandler = this.postThreadHandler.bind(this);
        this.getThreadByIdHandler = this.getThreadByIdHandler.bind(this);
    }

    async postThreadHandler(request, h) {
        const { id: userId } = request.auth.credentials;
        
        const createThreadUseCase = this._container.getInstance(CreateThreadUseCase.name);
        const addedThread = await createThreadUseCase.execute(request.payload, userId);
        const response = h.response({
            status: 'success',
            data: {
                addedThread,
            },
        });
        response.code(201);
        return response;
    }

    async getThreadByIdHandler(request, h) {
        const { threadId } = request.params;
        
        const getThreadUseCase = this._container.getInstance(GetThreadUseCase.name);
        const thread = await getThreadUseCase.execute(threadId);
        
        const response = h.response({
            status: 'success',
            data: { thread },
        });


        return response;
    }
}

module.exports = ThreadsHandler;