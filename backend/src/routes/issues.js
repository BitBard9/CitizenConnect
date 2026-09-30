import { Router } from "express";
import { requireAuth, requireRole } from "../middleware/auth.js";
import Issue from "../models/Issue.js";
import Notification from "../models/Notification.js";
import User from "../models/User.js";

const router = Router();

// Create issue (auth required)
router.post("/", requireAuth, async (req, res) => {
  try {
    const { title, description, category, priority, location, contactPhone, attachments = [] } = req.body;
    
    // Basic validation
    if (!title || !description || !location) {
      return res.status(400).json({ error: "Title, description, and location are required" });
    }
    
    console.log("Creating issue for user:", req.user.uid);
    const issue = await Issue.create({
      title, description, category, priority, location, contactPhone, attachments,
      residentUid: req.user.uid, status: "pending"
    });
    
    console.log("Issue created successfully:", issue._id);
    res.status(201).json(issue);
  } catch (error) {
    console.error("Error creating issue:", error);
    res.status(500).json({ error: "Failed to create issue" });
  }
});

// List my issues (auth required)
router.get("/", requireAuth, async (req, res) => {
  try {
    console.log("Fetching issues for user:", req.user.uid);
    const issues = await Issue.find({ residentUid: req.user.uid }).sort({ createdAt: -1 }).lean();
    console.log("Found issues:", issues.length);
    res.json(issues);
  } catch (error) {
    console.error("Error fetching issues:", error);
    res.status(500).json({ error: "Failed to fetch issues" });
  }
});

// List all issues (committee only)
router.get("/all", requireRole("committee"), async (req, res) => {
  try {
    console.log("Fetching all issues for committee:", req.user.uid);
    const issues = await Issue.find({}).sort({ createdAt: -1 }).lean();
    console.log("Found all issues:", issues.length);
    res.json(issues);
  } catch (error) {
    console.error("Error fetching all issues:", error);
    res.status(500).json({ error: "Failed to fetch all issues" });
  }
});

// Approve issue (committee only)
router.put("/:id/approve", requireRole("committee"), async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Approving issue:", id);
    
    const issue = await Issue.findByIdAndUpdate(
      id,
      { status: "approved", updatedAt: new Date() },
      { new: true }
    );
    
    if (!issue) {
      return res.status(404).json({ error: "Issue not found" });
    }
    
    console.log("Issue approved successfully:", id);
    res.json(issue);
  } catch (error) {
    console.error("Error approving issue:", error);
    res.status(500).json({ error: "Failed to approve issue" });
  }
});

// Assign issue to technician (committee only)
router.put("/:id/assign", requireRole("committee"), async (req, res) => {
  try {
    const { id } = req.params;
    const { technicianUid } = req.body;
    
    if (!technicianUid) {
      return res.status(400).json({ error: "Technician UID is required" });
    }
    
    console.log("Assigning issue:", id, "to technician:", technicianUid);
    
    const issue = await Issue.findByIdAndUpdate(
      id,
      { 
        status: "assigned", 
        assignedToUid: technicianUid,
        technicianResponse: "pending", // Reset to pending when assigning
        rejectionReason: "", // Clear any previous rejection reason
        updatedAt: new Date()
      },
      { new: true }
    );
    
    if (!issue) {
      return res.status(404).json({ error: "Issue not found" });
    }
    
    console.log("Issue assigned successfully:", id);
    res.json(issue);
  } catch (error) {
    console.error("Error assigning issue:", error);
    res.status(500).json({ error: "Failed to assign issue" });
  }
});

// Get issues assigned to a specific technician
router.get("/assigned", requireRole("technician"), async (req, res) => {
  try {
    console.log("Fetching assigned issues for technician:", req.user.uid);
    const issues = await Issue.find({ assignedToUid: req.user.uid })
      .sort({ createdAt: -1 })
      .lean();
    console.log("Found assigned issues:", issues.length);
    
    // Populate resident names
    const issuesWithResidentNames = await Promise.all(
      issues.map(async (issue) => {
        const resident = await User.findOne({ uid: issue.residentUid }).lean();
        return {
          ...issue,
          residentName: resident ? `${resident.firstName} ${resident.lastName}` : "Unknown Resident",
          residentPhone: resident?.phone || "",
          residentBuilding: resident?.building || "",
          residentUnit: resident?.unit || ""
        };
      })
    );
    
    res.json(issuesWithResidentNames);
  } catch (error) {
    console.error("Error fetching assigned issues:", error);
    res.status(500).json({ error: "Failed to fetch assigned issues" });
  }
});

// Update issue status (for technicians)
router.put("/:id/status", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({ error: "Status is required" });
    }
    
    const validStatuses = ["accepted", "in-progress", "resolved", "unresolved", "closed"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }
    
    console.log("Updating issue status:", id, "to", status);
    
    const issue = await Issue.findByIdAndUpdate(
      id,
      { 
        status: status,
        updatedAt: new Date(),
        $push: {
          statusHistory: {
            status: status,
            changedBy: req.user.uid,
            changedAt: new Date(),
            note: `Status changed to ${status}`
          }
        }
      },
      { new: true }
    );
    
    if (!issue) {
      return res.status(404).json({ error: "Issue not found" });
    }
    
    // Create notification for resident
    await Notification.create({
      userId: issue.residentUid,
      issueId: id,
      type: "status_change",
      title: "Issue Status Updated",
      message: `Your issue "${issue.title}" status changed to: ${status}`
    });
    
    console.log("Issue status updated successfully:", id);
    res.json(issue);
  } catch (error) {
    console.error("Error updating issue status:", error);
    res.status(500).json({ error: "Failed to update issue status" });
  }
});

// NEW: Edit issue (resident only - their own issues)
router.put("/:id", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, category, priority, location, contactPhone } = req.body;
    
    // Find issue and verify ownership
    const issue = await Issue.findById(id);
    if (!issue) {
      return res.status(404).json({ error: "Issue not found" });
    }
    
    if (issue.residentUid !== req.user.uid) {
      return res.status(403).json({ error: "You can only edit your own issues" });
    }
    
    // Only allow editing if status is pending or approved
    if (!["pending", "approved"].includes(issue.status)) {
      return res.status(400).json({ error: "Cannot edit issue after it has been assigned" });
    }
    
    const updated = await Issue.findByIdAndUpdate(
      id,
      { title, description, category, priority, location, contactPhone, updatedAt: new Date() },
      { new: true }
    );
    
    res.json(updated);
  } catch (error) {
    console.error("Error updating issue:", error);
    res.status(500).json({ error: "Failed to update issue" });
  }
});

// NEW: Delete issue (resident only - their own issues)
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    
    const issue = await Issue.findById(id);
    if (!issue) {
      return res.status(404).json({ error: "Issue not found" });
    }
    
    if (issue.residentUid !== req.user.uid) {
      return res.status(403).json({ error: "You can only delete your own issues" });
    }
    
    // Only allow deleting if status is pending
    if (issue.status !== "pending") {
      return res.status(400).json({ error: "Cannot delete issue after it has been approved" });
    }
    
    await Issue.findByIdAndDelete(id);
    res.json({ message: "Issue deleted successfully" });
  } catch (error) {
    console.error("Error deleting issue:", error);
    res.status(500).json({ error: "Failed to delete issue" });
  }
});

// NEW: Technician accept/reject issue
router.put("/:id/respond", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { response, rejectionReason } = req.body; // response: "accepted" or "rejected"
    
    if (!["accepted", "rejected"].includes(response)) {
      return res.status(400).json({ error: "Invalid response. Must be 'accepted' or 'rejected'" });
    }
    
    const issue = await Issue.findById(id);
    if (!issue) {
      return res.status(404).json({ error: "Issue not found" });
    }
    
    if (issue.assignedToUid !== req.user.uid) {
      return res.status(403).json({ error: "This issue is not assigned to you" });
    }
    
    const updateData = {
      technicianResponse: response,
      updatedAt: new Date()
    };
    
    if (response === "accepted") {
      updateData.status = "accepted";
      updateData.$push = {
        statusHistory: {
          status: "accepted",
          changedBy: req.user.uid,
          changedAt: new Date(),
          note: "Technician accepted the issue"
        }
      };
    } else {
      updateData.rejectionReason = rejectionReason || "No reason provided";
      updateData.status = "rejected"; // Show as rejected
      updateData.assignedToUid = ""; // Clear assignment so committee can reassign
      updateData.$push = {
        statusHistory: {
          status: "rejected",
          changedBy: req.user.uid,
          changedAt: new Date(),
          note: `Technician rejected: ${rejectionReason || "No reason provided"}`
        }
      };
    }
    
    const updated = await Issue.findByIdAndUpdate(id, updateData, { new: true });
    
    // Create notification for resident
    await Notification.create({
      userId: issue.residentUid,
      issueId: id,
      type: response === "accepted" ? "approval" : "rejection",
      title: response === "accepted" ? "Issue Accepted" : "Issue Rejected",
      message: response === "accepted" 
        ? `Your issue "${issue.title}" has been accepted by the technician`
        : `Your issue "${issue.title}" was rejected. Reason: ${rejectionReason || "No reason provided"}`
    });
    
    res.json(updated);
  } catch (error) {
    console.error("Error responding to issue:", error);
    res.status(500).json({ error: "Failed to respond to issue" });
  }
});

export default router;