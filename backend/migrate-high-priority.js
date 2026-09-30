import mongoose from "mongoose";
import Issue from "./src/models/Issue.js";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/citizenconnect_test";

async function migrateHighPriority() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB\n");

    // Find all issues with "high" priority
    const highPriorityIssues = await Issue.find({ priority: "high" });
    
    console.log(`📊 Found ${highPriorityIssues.length} issues with "high" priority\n`);

    if (highPriorityIssues.length === 0) {
      console.log("✅ No issues to migrate!");
      process.exit(0);
    }

    console.log("🔄 Migrating 'high' priority to 'urgent'...\n");

    // Update all "high" priority issues to "urgent"
    // You can change "urgent" to "medium" if you prefer
    const result = await Issue.updateMany(
      { priority: "high" },
      { $set: { priority: "urgent" } }
    );

    console.log(`✅ Migration complete!`);
    console.log(`   - ${result.modifiedCount} issues updated from "high" to "urgent"\n`);

    // Show updated issues
    console.log("📋 Updated issues:");
    const updatedIssues = await Issue.find({ priority: "urgent" });
    updatedIssues.forEach((issue, index) => {
      console.log(`   ${index + 1}. "${issue.title}" - Priority: ${issue.priority}`);
    });

    process.exit(0);
  } catch (error) {
    console.error("❌ Error during migration:", error);
    process.exit(1);
  }
}

migrateHighPriority();
