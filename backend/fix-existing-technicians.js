// One-time script to fix existing technicians without isApproved field
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

async function fixExistingTechnicians() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    // Update all existing technicians without isApproved field
    const result = await mongoose.connection.db.collection('users').updateMany(
      { 
        role: "technician",
        isApproved: { $exists: false }
      },
      { 
        $set: { 
          isApproved: true,
          approvedAt: new Date()
        } 
      }
    );

    console.log(`✅ Fixed ${result.modifiedCount} existing technician(s)`);
    console.log("All existing technicians are now marked as approved");

    // Show updated technicians
    const technicians = await mongoose.connection.db.collection('users').find({ 
      role: "technician" 
    }).toArray();
    
    console.log("\nAll technicians in database:");
    technicians.forEach(tech => {
      console.log(`- ${tech.firstName} ${tech.lastName}: isApproved = ${tech.isApproved}`);
    });

    await mongoose.connection.close();
    console.log("\n✅ Migration complete!");
    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

fixExistingTechnicians();
