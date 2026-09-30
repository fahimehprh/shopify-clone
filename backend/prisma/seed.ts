import 'dotenv/config';
import * as bcrypt from 'bcrypt';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client';

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

const products = [
  { name: 'Classic T-Shirt', stock: 50 },
  { name: 'Slim Fit Jeans', stock: 30 },
  { name: 'Running Sneakers', stock: 20 },
  { name: 'Leather Belt', stock: 40 },
  { name: 'Wool Sweater', stock: 15 },
  { name: 'Baseball Cap', stock: 60 },
  { name: 'Canvas Backpack', stock: 10 },
  { name: 'Sunglasses', stock: 25 },
];

const sampleUserName = 'Sample Shopper';
const sampleUserPassword = 'password123';

async function main() {
  let user = await prisma.user.findFirst({ where: { name: sampleUserName } });

  if (!user) {
    const password = await bcrypt.hash(sampleUserPassword, 10);
    user = await prisma.user.create({ data: { name: sampleUserName, password } });
  }

  console.log(`Sample user: ${user.id} (${user.name})`);

  for (const product of products) {
    const existing = await prisma.product.findFirst({
      where: { name: product.name },
    });

    if (existing) {
      await prisma.product.update({
        where: { id: existing.id },
        data: { stock: product.stock },
      });
    } else {
      await prisma.product.create({ data: product });
    }
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
