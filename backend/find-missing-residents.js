import mongoose from "mongoose";
import Issue from "./src/models/Issue.js";
import User from "./src/models/User.js";

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  throw new Error("Missing MONGODB_URI");
}

async function findMissingResidents() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Get all unique resident UIDs from issues
    const issues = await Issue.find({}).lean();
    const residentUids = [...new Set(issues.map(issue => issue.residentUid))];
    
    console.log(`\n📊 Found ${residentUids.length} unique resident UIDs in issues`);
    console.log(`📊 Total issues: ${issues.length}\n`);

    // Check which residents are missing from User collection
    const missingResidents = [];
    
    for (const uid of residentUids) {
      const user = await User.findOne({ uid });
      if (!user) {
        const issuesCount = issues.filter(i => i.residentUid === uid).length;
        missingResidents.push({ uid, issuesCount });
      }
    }

    if (missingResidents.length === 0) {
      console.log("✅ All residents found in database!");
    } else {
      console.log(`⚠️  Found ${missingResidents.length} missing residents:\n`);
      missingResidents.forEach((resident, index) => {
        console.log(`${index + 1}. UID: ${resident.uid}`);
        console.log(`   Issues created: ${resident.issuesCount}`);
        console.log(`   Sample issues:`);
        
        const sampleIssues = issues
          .filter(i => i.residentUid === resident.uid)
          .slice(0, 3);
        
        sampleIssues.forEach(issue => {
          console.log(`   - "${issue.title}" (${issue.location})`);
        });
        console.log("");
      });

      console.log("\n📝 To add these residents, update add-resident.js with the correct UID and details.");
    }

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

findMissingResidents();
