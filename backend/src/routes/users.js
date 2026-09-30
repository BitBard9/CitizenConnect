import { Router } from "express";
import { requireAuth, requireRole } from "../middleware/auth.js";
import User from "../models/User.js";

const router = Router();

router.get("/me", requireAuth, async (req, res) => {
  try {
    console.log("Looking for user with UID:", req.user.uid);
    const user = await User.findOne({ uid: req.user.uid }).lean();
    console.log("Found user in MongoDB:", user ? "Yes" : "No");
    
    const response = {
      uid: req.user.uid,
      email: req.user.email || null,
      role: user?.role || "resident",
      profile: user || null
    };
    
    console.log("Returning user data:", response);
    res.json(response);
  } catch (error) {
    console.error("Error in /users/me:", error);
    res.status(500).json({ error: "Failed to fetch user data" });
  }
});

// Upsert user profile/role into MongoDB
router.post("/sync", requireAuth, async (req, res) => {
  const { profile = {} } = req.body;
  
  // Validate technician specialization
  if (profile.role === "technician" && (!profile.specialization || profile.specialization.length === 0)) {
    return res.status(400).json({ error: "At least one specialization required for technicians" });
  }
  
  const updateData = {
    uid: req.user.uid,
    email: req.user.email || profile.email || "",
    username: profile.username,
    role: profile.role || "resident",
    firstName: profile.firstName,
    lastName: profile.lastName,
    phone: profile.phone,
    building: profile.building,
    unit: profile.unit,
    specialization: profile.specialization || []
  };
  
  // NEW: Technicians need approval, residents/committee are auto-approved
  if (profile.role === "technician") {
    updateData.isApproved = false; // Require committee approval
  } else {
    updateData.isApproved = true; // Auto-approve residents and committee
  }
  
  const updated = await User.findOneAndUpdate(
    { uid: req.user.uid },
    updateData,
    { new: true, upsert: true }
  ).lean();

  res.json(updated);
});

// Get technicians by specializations
router.get("/technicians", requireAuth, async (req, res) => {
  try {
    const { specializations } = req.query;
    const specializationsArray = specializations ? specializations.split(',') : [];
    
    console.log("📋 Fetching technicians...");
    console.log("Specializations filter:", specializationsArray);
    
    // Query: role is technician AND (isApproved is true OR isApproved doesn't exist - for backward compatibility)
    let query = { 
      role: "technician",
      $or: [
        { isApproved: true },
        { isApproved: { $exists: false } } // Include old technicians without isApproved field
      ]
    };
    
    if (specializationsArray.length > 0) {
      query.specialization = { $in: specializationsArray };
    }
    
    console.log("Query:", JSON.stringify(query, null, 2));
    
    const technicians = await User.find(query)
      .select('uid firstName lastName specialization email phone')
      .lean();
    
    console.log(`✅ Found ${technicians.length} technician(s)`);
    console.log("Technicians:", technicians);
    
    res.json(technicians);
  } catch (error) {
    console.error("❌ Error fetching technicians:", error);
    res.status(500).json({ error: "Failed to fetch technicians" });
  }
});

// NEW: Get pending technicians (for committee approval)
router.get("/pending-technicians", requireRole("committee"), async (req, res) => {
  try {
    const pendingTechnicians = await User.find({
      role: "technician",
      isApproved: false
    })
      .select('uid firstName lastName specialization email phone createdAt')
      .sort({ createdAt: -1 })
      .lean();
    
    res.json(pendingTechnicians);
  } catch (error) {
    console.error("Error fetching pending technicians:", error);
    res.status(500).json({ error: "Failed to fetch pending technicians" });
  }
});

// NEW: Approve technician (committee only)
router.put("/:uid/approve", requireRole("committee"), async (req, res) => {
  try {
    const { uid } = req.params;
    
    const updated = await User.findOneAndUpdate(
      { uid, role: "technician" },
      {
        isApproved: true,
        approvedBy: req.user.uid,
        approvedAt: new Date()
      },
      { new: true }
    );
    
    if (!updated) {
      return res.status(404).json({ error: "Technician not found" });
    }
    
    res.json(updated);
  } catch (error) {
    console.error("Error approving technician:", error);
    res.status(500).json({ error: "Failed to approve technician" });
  }
});

// NEW: Reject technician (committee only)
router.delete("/:uid/reject", requireRole("committee"), async (req, res) => {
  try {
    const { uid } = req.params;
    
    const deleted = await User.findOneAndDelete({
      uid,
      role: "technician",
      isApproved: false
    });
    
    if (!deleted) {
      return res.status(404).json({ error: "Pending technician not found" });
    }
    
    res.json({ message: "Technician registration rejected" });
  } catch (error) {
    console.error("Error rejecting technician:", error);
    res.status(500).json({ error: "Failed to reject technician" });
  }
});

export default router;