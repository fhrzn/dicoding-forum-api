const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const ThreadRepository = require('../../Domains/threads/ThreadRepository');
const AddedThread = require('../../Domains/threads/entities/AddedThread');

class ThreadRepositoryPostgres extends ThreadRepository {
    constructor(pool, idGenerator) {
        super();
        this._pool = pool;
        this._idGenerator = idGenerator;
    }

    async createThread(thread, owner) {
        const { title, body } = thread;
        const id = `thread-${this._idGenerator()}`;
        const createdAt = new Date();

        const query = {
            text: 'INSERT INTO threads VALUES($1, $2, $3, $4, $5) Returning id, title, owner',
            values: [id, title, body, createdAt, owner],
        };

        const result = await this._pool.query(query);

        return new AddedThread(result.rows[0]);
    }

    async getThreadById(threadId) {
        const query = {
            text: 'SELECT * FROM threads WHERE id = $1',
            values: [threadId],
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new NotFoundError('thread tidak ditemukan');
        }
        
        return result.rows[0]
    }

    async verifyThreadExist(threadId) {
        const query = {
            text: 'SELECT id FROM threads WHERE id = $1',
            values: [threadId],
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new NotFoundError('thread tidak ditemukan');
        }
    }
}

module.exports = ThreadRepositoryPostgres;