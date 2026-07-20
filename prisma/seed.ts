import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";

console.log("DATABASE_URL:", process.env.DATABASE_URL);

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  await prisma.topic.createMany({
    data: [
      { name: "Array" },
      { name: "String" },
      { name: "Binary Search" },
      { name: "Two Pointers" },
      { name: "Sliding Window" },
      { name: "Linked List" },
      { name: "Tree" },
      { name: "Graph" },
      { name: "Dynamic Programming" },
      { name: "Greedy" },
    ],
    skipDuplicates: true,
  });

  console.log("✅ Topics seeded");
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });