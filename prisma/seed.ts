import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Add your seeding logic here
  console.log('Database seeded successfully')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

