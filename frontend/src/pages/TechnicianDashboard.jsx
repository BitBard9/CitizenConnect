import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../config/firebaseConfig";
import { useAuth } from "../context/AuthContext";
import api from "../api/apiClients";
import ConfirmDialog from "../components/ConfirmDialog";

export default function TechnicianDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const navigate = useNavigate();
  const { user } = useAuth();
  const [assignedWork, setAssignedWork] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userName, setUserName] = useState("");
  const [respondDialog, setRespondDialog] = useState({ isOpen: false, issue: null, action: null });
  const [rejectionReason, setRejectionReason] = useState("");

  useEffect(() => {
    if (!user) return;
    fetchUserInfo();
    fetchAssignedWork();
  }, [user]);

  // Fetch user info
  const fetchUserInfo = async () => {
    try {
      const response = await api.get('/users/me');
      const profile = response.data.profile;
      if (profile) {
        setUserName(`${profile.firstName} ${profile.lastName}`);
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  const fetchAssignedWork = async () => {
    try {
      setLoading(true);
      console.log("Fetching assigned work for technician...");
      const response = await api.get('/issues/assigned');
      console.log("Assigned work fetched:", response.data);
      
      // Convert backend issues to frontend work format
      const convertedWork = response.data.map(convertIssueToWork);
      setAssignedWork(convertedWork);
      setError(null);
    } catch (error) {
      console.error("Error fetching assigned work:", error);
      setError("Failed to load assigned work. Please try again.");
      setAssignedWork([]);
    } finally {
      setLoading(false);
    }
  };

  const updateIssueStatus = async (issueId, newStatus) => {
    try {
      console.log("Updating issue status:", issueId, "to", newStatus);
      const response = await api.put(`/issues/${issueId}/status`, { status: newStatus });
      console.log("Issue status updated:", response.data);
      
      // Update local state
      setAssignedWork(prev => prev.map(issue =>
        issue._id === issueId ? { ...issue, status: newStatus } : issue
      ));
    } catch (error) {
      console.error("Error updating issue status:", error);
      alert("Failed to update issue status. Please try again.");
    }
  };

  const stats = {
    total: assignedWork.length,
    assigned: assignedWork.filter(work => work.status === "assigned").length,
    inProgress: assignedWork.filter(work => work.status === "in-progress").length,
    completed: assignedWork.filter(work => work.status === "completed").length,
    urgent: assignedWork.filter(work => work.priority === "urgent").length,
    medium: assignedWork.filter(work => work.priority === "medium").length
  };

  const handleLogout = async () => {
    await auth.signOut();
    navigate("/login");
  };

  const updateWorkStatus = (workId, newStatus) => {
    updateIssueStatus(workId, newStatus);
  };

  const handleAcceptIssue = async (issueId) => {
    try {
      const { data } = await api.put(`/issues/${issueId}/respond`, {
        response: "accepted"
      });
      setAssignedWork(prev => prev.map(w => w._id === issueId ? data : w));
      setRespondDialog({ isOpen: false, issue: null, action: null });
    } catch (error) {
      console.error("Error accepting issue:", error);
      alert("Failed to accept issue");
    }
  };

  const handleRejectIssue = async (issueId) => {
    try {
      const { data } = await api.put(`/issues/${issueId}/respond`, {
        response: "rejected",
        rejectionReason: rejectionReason || "No reason provided"
      });
      setAssignedWork(prev => prev.filter(w => w._id !== issueId));
      setRespondDialog({ isOpen: false, issue: null, action: null });
      setRejectionReason("");
    } catch (error) {
      console.error("Error rejecting issue:", error);
      alert("Failed to reject issue");
    }
  };

  // Convert backend issue format to frontend work format
  const convertIssueToWork = (issue) => ({
    id: issue._id,
    _id: issue._id,
    title: issue.title,
    description: issue.description,
    status: issue.status,
    category: issue.category,
    priority: issue.priority,
    location: issue.location,
    resident: issue.residentName || "Unknown Resident", // Use populated resident name
    residentPhone: issue.residentPhone || "",
    assignedDate: issue.createdAt,
    estimatedDuration: "2-4 hours", // Default estimate
    requiredTools: getToolsForCategory(issue.category),
    technicianResponse: issue.technicianResponse || "pending", // IMPORTANT: Include this field
    rejectionReason: issue.rejectionReason || ""
  });

  const getToolsForCategory = (category) => {
    const toolMap = {
      plumbing: ["Wrench", "Plumber's tape", "Pipe cutter"],
      electrical: ["Multimeter", "Wire stripper", "Electrical tape"],
      maintenance: ["Drill", "Screwdriver", "Safety gear"],
      security: ["Drill", "Screwdriver", "Cable tester"],
      general: ["Basic toolkit", "Safety gear"]
    };
    return toolMap[category] || ["Basic toolkit"];
  };

  const getStatusColor = (status) => {
    const colors = {
      "assigned": "bg-blue-100 text-blue-800",
      "in-progress": "bg-yellow-100 text-yellow-800",
      "completed": "bg-green-100 text-green-800",
      "pending": "bg-gray-100 text-gray-800"
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getPriorityColor = (priority) => {
    const colors = {
      "low": "bg-gray-100 text-gray-700",
      "medium": "bg-yellow-100 text-yellow-700",
      "urgent": "bg-red-100 text-red-700"
    };
    return colors[priority] || "bg-gray-100 text-gray-700";
  };

  const getCategoryIcon = (category) => {
    const icons = {
      "plumbing": "🚰",
      "electrical": "⚡",
      "maintenance": "🔧",
      "security": "🔒",
      "cleaning": "🧹",
      "landscaping": "🌳",
      "general": "📋"
    };
    return icons[category] || "📋";
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return "Today";
    if (diffDays === 2) return "Yesterday";
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white text-lg font-bold">🔧</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900">CitizenConnect</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">Technician</p>
                <p className="text-xs text-gray-500">Work Order Dashboard</p>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: "overview", label: "Overview", icon: "📊" },
              { id: "assigned", label: "Assigned Work", icon: "📋" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? "border-orange-500 text-orange-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                    <span className="text-2xl text-blue-600">📋</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Assigned</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mr-4">
                    <span className="text-2xl text-yellow-600">🔄</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">In Progress</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.inProgress}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                    <span className="text-2xl text-green-600">✅</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Completed</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mr-4">
                    <span className="text-2xl text-red-600">🔥</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Urgent</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.urgent}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                <button
                  onClick={() => setActiveTab("assigned")}
                  className="p-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-orange-400 hover:bg-orange-50 transition-all duration-200 text-center group"
                >
                  <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">📋</div>
                  <p className="font-medium text-gray-700">View Assigned Work</p>
                  <p className="text-sm text-gray-500">Check your work orders</p>
                </button>
              </div>
            </div>

            {/* Recent Assigned Work */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Recent Work Orders</h3>
                <button
                  onClick={() => setActiveTab("assigned")}
                  className="text-sm text-orange-600 hover:text-orange-700 font-medium"
                >
                  View All →
                </button>
              </div>
              <div className="space-y-3">
                {assignedWork.slice(0, 3).map((work) => (
                  <div key={work.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">{getCategoryIcon(work.category)}</span>
                      <div>
                        <p className="font-medium text-gray-800">{work.title}</p>
                        <p className="text-sm text-gray-500">{work.resident} • {work.location}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(work.priority)}`}>
                        {work.priority}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(work.status)}`}>
                        {work.status.replace('-', ' ')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "assigned" && (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Assigned Work Orders</h2>
              <p className="text-gray-600">Manage your assigned maintenance and repair tasks.</p>
            </div>
            
            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading assigned work...</p>
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <div className="text-red-500 text-6xl mb-4">⚠️</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Work</h3>
                  <p className="text-gray-500 mb-4">{error}</p>
                  <button
                    onClick={fetchAssignedWork}
                    className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                  >
                    Try Again
                  </button>
                </div>
              ) : assignedWork.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🔧</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Assigned Work</h3>
                  <p className="text-gray-500">You don't have any assigned work orders at the moment.</p>
                </div>
              ) : (
                assignedWork.map((work) => (
                <div key={work.id} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                  {/* Work Header */}
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-4 gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">{getCategoryIcon(work.category)}</span>
                        <h3 className="text-lg font-semibold text-gray-800">{work.title}</h3>
                      </div>
                      <p className="text-gray-600 text-sm mb-2">
                        <strong>Resident:</strong> {work.resident} • <strong>Location:</strong> {work.location}
                      </p>
                      <p className="text-gray-600 text-sm">
                        <strong>Assigned:</strong> {formatDate(work.assignedDate)} • <strong>Duration:</strong> {work.estimatedDuration}
                      </p>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(work.status)}`}>
                        {work.status.replace('-', ' ')}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(work.priority)}`}>
                        {work.priority}
                      </span>
                    </div>
                  </div>

                  {/* Work Description */}
                  <p className="text-gray-700 mb-4 leading-relaxed">{work.description}</p>

                  {/* Required Tools */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Required Tools:</h4>
                    <div className="flex flex-wrap gap-2">
                      {work.requiredTools.map((tool, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-sm">
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200">
                    {/* Accept/Reject buttons for assigned issues */}
                    {work.status === "assigned" && work.technicianResponse === "pending" && (
                      <>
                        <button
                          onClick={() => setRespondDialog({ isOpen: true, issue: work, action: "accept" })}
                          className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                          ✅ Accept
                        </button>
                        <button
                          onClick={() => setRespondDialog({ isOpen: true, issue: work, action: "reject" })}
                          className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                          ❌ Reject
                        </button>
                      </>
                    )}

                    {/* Status update buttons for accepted issues */}
                    {work.status === "accepted" && (
                      <button
                        onClick={() => updateWorkStatus(work._id, "in-progress")}
                        className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        🚀 Start Work
                      </button>
                    )}
                    
                    {work.status === "in-progress" && (
                      <>
                        <button
                          onClick={() => updateWorkStatus(work._id, "resolved")}
                          className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                          ✅ Mark Resolved
                        </button>
                        <button
                          onClick={() => updateWorkStatus(work._id, "unresolved")}
                          className="px-4 py-2 text-sm bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                        >
                          ⚠️ Mark Unresolved
                        </button>
                      </>
                    )}
                    
                    <button className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                      View Details
                    </button>
                  </div>
                </div>
              ))
              )}
            </div>
          </div>
        )}

      </main>

      {/* Accept/Reject Dialog */}
      <ConfirmDialog
        isOpen={respondDialog.isOpen}
        title={respondDialog.action === "accept" ? "Accept Issue?" : "Reject Issue?"}
        message={
          respondDialog.action === "accept"
            ? `Accept "${respondDialog.issue?.title}"? You'll be responsible for resolving this issue.`
            : (
              <div>
                <p className="mb-3">Reject "{respondDialog.issue?.title}"?</p>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Reason for rejection (optional)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                />
              </div>
            )
        }
        confirmText={respondDialog.action === "accept" ? "Accept" : "Reject"}
        cancelText="Cancel"
        type={respondDialog.action === "accept" ? "info" : "warning"}
        onConfirm={() =>
          respondDialog.action === "accept"
            ? handleAcceptIssue(respondDialog.issue?._id)
            : handleRejectIssue(respondDialog.issue?._id)
        }
        onCancel={() => {
          setRespondDialog({ isOpen: false, issue: null, action: null });
          setRejectionReason("");
        }}
      />
    </div>
  );
}
