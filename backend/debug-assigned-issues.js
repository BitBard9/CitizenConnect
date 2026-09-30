import mongoose from "mongoose";
import Issue from "./src/models/Issue.js";
import User from "./src/models/User.js";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/citizenconnect_test";

async function debugAssignedIssues() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB\n");

    // Get all issues
    const allIssues = await Issue.find({}).lean();
    console.log(`📊 Total issues in database: ${allIssues.length}\n`);

    // Get all users
    const allUsers = await User.find({}).lean();
    console.log(`👥 Total users in database: ${allUsers.length}\n`);

    // Check assigned issues
    const assignedIssues = await Issue.find({ assignedToUid: { $ne: "" } }).lean();
    console.log(`📋 Assigned issues: ${assignedIssues.length}\n`);

    if (assignedIssues.length > 0) {
      console.log("🔍 Checking assigned issues:\n");
      
      for (const issue of assignedIssues) {
        console.log(`Issue: "${issue.title}"`);
        console.log(`  - Resident UID: ${issue.residentUid}`);
        console.log(`  - Assigned to UID: ${issue.assignedToUid}`);
        
        // Find resident
        const resident = await User.findOne({ uid: issue.residentUid }).lean();
        if (resident) {
          console.log(`  - ✅ Resident found: ${resident.firstName} ${resident.lastName}`);
        } else {
          console.log(`  - ❌ Resident NOT found in User collection!`);
        }
        
        // Find technician
        const technician = await User.findOne({ uid: issue.assignedToUid }).lean();
        if (technician) {
          console.log(`  - ✅ Technician found: ${technician.firstName} ${technician.lastName}`);
        } else {
          console.log(`  - ❌ Technician NOT found in User collection!`);
        }
        console.log("");
      }
    } else {
      console.log("⚠️  No assigned issues found. Checking all issues:\n");
      
      for (const issue of allIssues) {
        console.log(`Issue: "${issue.title}"`);
        console.log(`  - Status: ${issue.status}`);
        console.log(`  - Resident UID: ${issue.residentUid}`);
        console.log(`  - Assigned to UID: ${issue.assignedToUid || "(none)"}`);
        
        const resident = await User.findOne({ uid: issue.residentUid }).lean();
        if (resident) {
          console.log(`  - ✅ Resident: ${resident.firstName} ${resident.lastName}`);
        } else {
          console.log(`  - ❌ Resident NOT found!`);
        }
        console.log("");
      }
    }

    console.log("\n👥 All users in database:");
    allUsers.forEach(user => {
      console.log(`  - ${user.firstName} ${user.lastName} (${user.role}) - UID: ${user.uid}`);
    });

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

debugAssignedIssues();
