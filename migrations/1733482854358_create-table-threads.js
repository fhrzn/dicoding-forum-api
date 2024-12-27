/* eslint-disable camelcase */

const { dropConstraint } = require("node-pg-migrate/dist/operations/tables");

exports.up = pgm => {
  pgm.createTable('threads', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    title: {
      type: 'VARCHAR(100)',
      notNull: true,
    },
    body: {
      type: 'TEXT',
      notNull: true,
    },
    created_at: {
      type: 'TIMESTAMP',
      notNull: true,
    },
    owner: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
  });
  pgm.addConstraint('threads', 'fk_threads.owner.users.id', {
    foreignKeys: {
      columns: 'owner',
      references: 'users(id)',
      onDelete: 'CASCADE',
    },
  });
    
};

exports.down = pgm => {
    pgm,dropConstraint('threads', 'fk_threads.owner.users.id');
    pgm.dropTable('threads');
};
