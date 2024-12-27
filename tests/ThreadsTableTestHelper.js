/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const ThreadsTableTestHelper = {
    async createThread({
        id = "thread-123",
        title = "A thread",
        body = "thread body",
        createdAt = new Date(),
        owner = "user-123",
    }) {
        const query = {
            text: 'INSERT INTO threads VALUES($1, $2, $3, $4, $5)',
            values: [id, title, body, createdAt, owner],
        };

        await pool.query(query);
    },

    async getThreadId(id) {
        const query = {
            text: 'SELECT * FROM threads WHERE id = $1',
            values: [id],
        };

        const result = await pool.query(query);
        return result.rows[0];
    },

    async cleanTable() {
        await pool.query('DELETE FROM threads WHERE 1=1');
    }
};

module.exports = ThreadsTableTestHelper;
