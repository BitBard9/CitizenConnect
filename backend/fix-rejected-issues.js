// One-time script to fix rejected issues that still show as "approved"
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

async function fixRejectedIssues() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    // Find issues where technicianResponse is "rejected" but status is still "approved"
    const result = await mongoose.connection.db.collection('issues').updateMany(
      { 
        technicianResponse: "rejected",
        status: { $in: ["approved", "assigned"] } // Fix both approved and assigned
      },
      { 
        $set: { 
          status: "rejected",
          assignedToUid: "" // Clear assignment
        } 
      }
    );

    console.log(`✅ Fixed ${result.modifiedCount} rejected issue(s)`);

    // Show all rejected issues
    const rejectedIssues = await mongoose.connection.db.collection('issues').find({ 
      technicianResponse: "rejected" 
    }).toArray();
    
    console.log("\nRejected issues in database:");
    rejectedIssues.forEach(issue => {
      console.log(`- ${issue.title}: status = ${issue.status}, technicianResponse = ${issue.technicianResponse}`);
      if (issue.rejectionReason) {
        console.log(`  Reason: ${issue.rejectionReason}`);
      }
    });

    await mongoose.connection.close();
    console.log("\n✅ Migration complete!");
    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

fixRejectedIssues();
