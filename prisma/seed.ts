import "dotenv/config";
import {
  PrismaClient,
  Difficulty,
} from "../src/generated/prisma/client";
console.log("DATABASE_URL:", process.env.DATABASE_URL);

const problems = [
  {
    title: "Two Sum",
    slug: "two-sum",
    difficulty: Difficulty.EASY,
    description: "Find indices of two numbers that add up to a target.",
    topics: ["Array"],
  },
  {
    title: "Contains Duplicate",
    slug: "contains-duplicate",
    difficulty: Difficulty.EASY,
    description: "Determine whether any value appears at least twice.",
    topics: ["Array"],
  },
  {
  title: "Best Time to Buy and Sell Stock",
  slug: "best-time-to-buy-and-sell-stock",
  difficulty: Difficulty.EASY,
  description: "Find the maximum profit.",
  topics: ["Array"],
},
{
  title: "Maximum Subarray",
  slug: "maximum-subarray",
  difficulty: Difficulty.MEDIUM,
  description: "Find the contiguous subarray with the largest sum.",
  topics: ["Array", "Dynamic Programming"],
},
{
  title: "Longest Common Prefix",
  slug: "longest-common-prefix",
  difficulty: Difficulty.EASY,
  description: "Find the longest common prefix.",
  topics: ["String"],
},
{
  title: "Valid Palindrome",
  slug: "valid-palindrome",
  difficulty: Difficulty.EASY,
  description: "Check whether a string is a palindrome.",
  topics: ["String", "Two Pointers"],
},
{
  title: "Binary Search",
  slug: "binary-search",
  difficulty: Difficulty.EASY,
  description: "Classic binary search.",
  topics: ["Binary Search"],
},
{
  title: "Search Insert Position",
  slug: "search-insert-position",
  difficulty: Difficulty.EASY,
  description: "Return insertion index.",
  topics: ["Binary Search"],
},
{
  title: "Reverse Linked List",
  slug: "reverse-linked-list",
  difficulty: Difficulty.EASY,
  description: "Reverse a linked list.",
  topics: ["Linked List"],
},
{
  title: "Merge Two Sorted Lists",
  slug: "merge-two-sorted-lists",
  difficulty: Difficulty.EASY,
  description: "Merge two sorted linked lists.",
  topics: ["Linked List"],
},
{
  title: "Invert Binary Tree",
  slug: "invert-binary-tree",
  difficulty: Difficulty.EASY,
  description: "Invert a binary tree.",
  topics: ["Tree"],
},
{
  title: "Maximum Depth of Binary Tree",
  slug: "maximum-depth-of-binary-tree",
  difficulty: Difficulty.EASY,
  description: "Find tree depth.",
  topics: ["Tree"],
},
{
  title: "Number of Islands",
  slug: "number-of-islands",
  difficulty: Difficulty.MEDIUM,
  description: "Count islands.",
  topics: ["Graph"],
},
{
  title: "Course Schedule",
  slug: "course-schedule",
  difficulty: Difficulty.MEDIUM,
  description: "Detect cycles in prerequisites.",
  topics: ["Graph"],
},
{
  title: "Climbing Stairs",
  slug: "climbing-stairs",
  difficulty: Difficulty.EASY,
  description: "Count ways to climb stairs.",
  topics: ["Dynamic Programming"],
},
{
  title: "House Robber",
  slug: "house-robber",
  difficulty: Difficulty.MEDIUM,
  description: "Maximum money without adjacent houses.",
  topics: ["Dynamic Programming"],
},
{
  title: "Longest Substring Without Repeating Characters",
  slug: "longest-substring-without-repeating-characters",
  difficulty: Difficulty.MEDIUM,
  description: "Sliding window problem.",
  topics: ["Sliding Window", "String"],
},
{
  title: "3Sum",
  slug: "3sum",
  difficulty: Difficulty.MEDIUM,
  description: "Find unique triplets.",
  topics: ["Two Pointers"],
},
{
  title: "Jump Game",
  slug: "jump-game",
  difficulty: Difficulty.MEDIUM,
  description: "Reach the last index.",
  topics: ["Greedy"],
},
  {
    title: "Valid Anagram",
    slug: "valid-anagram",
    difficulty: Difficulty.EASY,
    description: "Check whether two strings are anagrams.",
    topics: ["String"],
  },
];

const prisma = new PrismaClient();

async function main() {

await prisma.problemTopic.deleteMany();
await prisma.problem.deleteMany();
await prisma.topic.deleteMany();
await prisma.user.deleteMany();

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

  const topicRecords = await prisma.topic.findMany();

const topicMap = new Map(
  topicRecords.map((topic) => [topic.name, topic.id])
);

for (const problem of problems) {
  await prisma.problem.create({
    data: {
      title: problem.title,
      slug: problem.slug,
      description: problem.description,
      difficulty: problem.difficulty,

      topics: {
        create: problem.topics.map((topicName) => {
          const topicId = topicMap.get(topicName);

          if (!topicId) {
            throw new Error(`Topic "${topicName}" not found.`);
          }

          return {
            weight: 1,
            topic: {
              connect: {
                id: topicId,
              },
            },
          };
        }),
      },
    },
  });
}

await prisma.user.createMany({
  data: [
    {
      name: "Alice",
      email: "alice@example.com",
      passwordHash: "hashedpassword",
    },
    {
      name: "Bob",
      email: "bob@example.com",
      passwordHash: "hashedpassword",
    },
    {
      name: "Charlie",
      email: "charlie@example.com",
      passwordHash: "hashedpassword",
    },
  ],
});

}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });