exports.up = function(knex) {
  // console.log("creating topics table...");
  return knex.schema.createTable("topics", topicsTable => {
    topicsTable
      .string("slug", 50)
      .primary()
      .unique();
    topicsTable.string("description").notNullable();
  });
};

exports.down = function(knex) {
  //console.log("dropping topics table...");
  return knex.schema.dropTable("topics");
};
