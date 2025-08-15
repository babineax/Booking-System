import { seedDatabase } from "./seedData";

(async () => {
  try {
    const result = await seedDatabase();
    console.log("Seed finished:", result);
    process.exit(0);
  } catch (err) {
    console.error("Seed failed:", err);
    process.exit(1);
  }
})();
