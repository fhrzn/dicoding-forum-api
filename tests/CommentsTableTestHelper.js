/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const CommentsTableTestHelper = {
    async createComment({
        id = 'comment-123',
        content = 'A comment',
        owner = 'user-123',
        createdAt = new Date(),
        thread_id = 'thread-123',
        soft_delete = false
    }) {
        const query = {
            text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5, $6)',
            values: [id, content, owner, createdAt, thread_id, soft_delete],
        };

        await pool.query(query);
    },

    async getCommentById(id) {
        const query = {
            text: 'SELECT * FROM comments WHERE id = $1',
            values: [id],
        };

        const result = await pool.query(query);
        return result.rows;
    },

    async cleanTable() {
        await pool.query('DELETE FROM comments WHERE 1=1');
    }
}

module.exports = CommentsTableTestHelper;