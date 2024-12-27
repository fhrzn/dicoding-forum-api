const AuthorizationError = require("../../Commons/exceptions/AuthorizationError");
const NotFoundError = require("../../Commons/exceptions/NotFoundError");
const CommentRepository = require("../../Domains/comments/CommentRepository");
const AddedComment = require("../../Domains/comments/entities/AddedComment");

class CommentRepositoryPostgres extends CommentRepository {
    constructor(pool, idGenerator) {
        super();
        this._pool = pool;
        this._idGenerator = idGenerator;
    }

    async createComment(comment, threadId, userId) {
        const { content } = comment;
        const id = `comment-${this._idGenerator()}`;
        const createdAt = new Date();

        const query = {
            text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5) Returning id, content, owner',
            values: [id, content, userId, createdAt, threadId]
        }
        const result = await this._pool.query(query);
        
        return new AddedComment({ ...result.rows[0] });
    }

    async getCommentsByThreadId(threadId) {
        const query = {
            text: 'SELECT * FROM comments WHERE thread_id = $1',
            values: [threadId],
        };
        const result = await this._pool.query(query);

        if (!result.rowCount) {
            return [];
        }

        return result.rows;
    }

    async getCommentById(commentId) {
        const query = {
            text: 'SELECT * FROM comments WHERE id = $1',
            values: [commentId],
        };
        const result = await this._pool.query(query);

        if (!result.rowCount) {
            return null;
        }

        return new AddedComment({ ...result.rows[0] });
    }

    async deleteComment(threadId, commentId) {
        const query = {
            text: 'UPDATE comments SET soft_delete = true WHERE id = $1 AND thread_id = $2 RETURNING id',
            values: [commentId, threadId],
        };
        return await this._pool.query(query);
    }

    async verifyCommentExist(commentId) {
        const query = {
            text: 'SELECT id FROM comments WHERE id = $1',
            values: [commentId],
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new NotFoundError('komentar tidak ditemukan');
        }
    }

    async verifyCommentOwner(commentId, userId) {
        const query = {
            text: 'SELECT owner FROM comments WHERE id = $1',
            values: [commentId],
        };

        const result = await this._pool.query(query);
        const comment = result.rows[0];

        if (comment.owner !== userId) {
            throw new AuthorizationError('akses invalid');
        }
    }
}

module.exports = CommentRepositoryPostgres;