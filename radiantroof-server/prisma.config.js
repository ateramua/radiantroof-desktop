module.exports = {
  datasource: {
    url: process.env.DATABASE_URL,
    shadowDatabaseUrl: process.env.SHADOW_DATABASE_URL,
  },
  // Add this to help with migrations
  migrations: {
    path: "prisma/migrations"
  }
}
