const CreateThread = require("../../../Domains/threads/entities/CreateThread");

class CreateThreadUseCase {
    constructor({ threadRepository }) {
        this._repository = threadRepository;
    }

    async execute(payload, userId) {
        const createThread = new CreateThread(payload);
        
        return await this._repository.createThread(createThread, userId);
    }
}

module.exports = CreateThreadUseCase;