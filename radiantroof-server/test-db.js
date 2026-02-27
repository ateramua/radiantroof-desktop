const { PrismaClient } = require('@prisma/client')
const { Pool } = require('pg')
const { PrismaPg } = require('@prisma/adapter-pg')

// Create a PostgreSQL connection pool using your .env variables
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  user: process.env.DB_USER || 'macnifient',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'radiantroof_db',
})

// Initialize the adapter
const adapter = new PrismaPg(pool)

// Pass the adapter to PrismaClient
const prisma = new PrismaClient({ adapter })

async function main() {
  try {
    const userCount = await prisma.users.count()
    console.log('✅ Connection successful!')
    console.log(`📊 Current users in database: ${userCount}`)
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()