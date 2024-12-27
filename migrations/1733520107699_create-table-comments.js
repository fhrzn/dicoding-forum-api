/* eslint-disable camelcase */

exports.up = pgm => {
  pgm.createTable('comments', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    content: {
      type: 'TEXT',
      notNull: true,
    },
    owner: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    created_at: {
      type: 'TIMESTAMP',
      default: pgm.func('current_timestamp'),
    },
    thread_id: {
        type: 'VARCHAR(50)',
        notNull: true,
    },
    soft_delete: {
      type: 'BOOLEAN',
      default: false,
    },
  });
  pgm.addConstraint('comments', 'fk_comments.owner.users.id', {
    foreignKeys: {
      columns: 'owner',
      references: 'users(id)',
      onDelete: 'CASCADE',
    },
  });
  pgm.addConstraint('comments', 'fk_comments.thread_id.threads.id', {
    foreignKeys: {
      columns: 'thread_id',
      references: 'threads(id)',
      onDelete: 'CASCADE',
    },
  });

};

exports.down = pgm => {
      pgm.dropConstraint('comments', 'fk_comments.thread_id.threads.id');
      pgm.dropConstraint('comments', 'fk_comments.owner.users.id');
      pgm.dropTable('comments');
};
