import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../config/firebaseConfig";
import { useAuth } from "../context/AuthContext";
import IssueForm from "../components/IssueForm.jsx";
import IssueList from "../components/IssueList.jsx";
import NotificationBell from "../components/NotificationBell";
import NotificationPanel from "../components/NotificationPanel";
import NotificationList from "../components/NotificationList";
import EditIssueModal from "../components/EditIssueModal";
import ConfirmDialog from "../components/ConfirmDialog";
import api from "../api/apiClients";

export default function ResidentDashboard() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userName, setUserName] = useState("");

  const [activeTab, setActiveTab] = useState("overview");
  const [showNotifications, setShowNotifications] = useState(false);
  const [editingIssue, setEditingIssue] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, issue: null });
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    fetchUserInfo();
    fetchIssues();
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

  // Fetch issues from backend
  const fetchIssues = async () => {
    try {
      setLoading(true);
      console.log("Fetching issues from backend...");
      const response = await api.get('/issues');
      console.log("Issues fetched:", response.data);
      setIssues(response.data);
      setError(null);
    } catch (error) {
      console.error("Error fetching issues:", error);
      setError("Failed to load issues. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const addIssue = (newIssue) => {
    setIssues([newIssue, ...issues]);
  };

  const handleIssueSuccess = (newIssue) => {
    // Refresh the issues list
    const fetchIssues = async () => {
      try {
        const response = await api.get('/issues');
        setIssues(response.data);
      } catch (error) {
        console.error("Error refreshing issues:", error);
      }
    };
    fetchIssues();
  };

  const updateIssueStatus = (issueId, newStatus) => {
    setIssues(issues.map(issue => 
      issue.id === issueId 
        ? { ...issue, status: newStatus, updatedAt: new Date().toISOString() }
        : issue
    ));
  };

  const handleDeleteIssue = async (issueId) => {
    try {
      await api.delete(`/issues/${issueId}`);
      setIssues(prev => prev.filter(i => i._id !== issueId));
      setDeleteConfirm({ isOpen: false, issue: null });
    } catch (error) {
      console.error("Error deleting issue:", error);
      alert(error.response?.data?.error || "Failed to delete issue");
    }
  };

  // Calculate statistics
  const stats = {
    total: issues.length,
    pending: issues.filter(issue => issue.status === "pending").length,
    inProgress: issues.filter(issue => issue.status === "in-progress").length,
    resolved: issues.filter(issue => issue.status === "resolved").length,
    urgent: issues.filter(issue => issue.priority === "urgent").length
  };

  const handleLogout = async () => {
    await auth.signOut();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white text-lg font-bold">🏠</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900">CitizenConnect</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <NotificationBell onClick={() => setShowNotifications(!showNotifications)} />
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">Resident</p>
                <p className="text-xs text-gray-500">Resident Dashboard</p>
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
              { id: "report", label: "Report Issue", icon: "📝" },
              { id: "issues", label: "My Issues", icon: "📋" },
              { id: "notifications", label: "Notifications", icon: "🔔" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
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
                    <span className="text-2xl text-blue-600">📊</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Issues</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mr-4">
                    <span className="text-2xl text-yellow-600">⏳</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Pending</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                    <span className="text-2xl text-blue-600">🔄</span>
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
                    <p className="text-sm font-medium text-gray-600">Resolved</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.resolved}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mr-4">
                    <span className="text-2xl text-red-600">🚨</span>
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => setActiveTab("report")}
                  className="p-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 text-center group"
                >
                  <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">📝</div>
                  <p className="font-medium text-gray-700">Report New Issue</p>
                  <p className="text-sm text-gray-500">Submit a maintenance request</p>
                </button>
                
                <button
                  onClick={() => setActiveTab("issues")}
                  className="p-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-green-400 hover:bg-green-50 transition-all duration-200 text-center group"
                >
                  <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">📋</div>
                  <p className="font-medium text-gray-700">View All Issues</p>
                  <p className="text-sm text-gray-500">Check status and updates</p>
                </button>
                
                {/* <div className="p-4 bg-gray-50 rounded-xl text-center">
                  <div className="text-3xl mb-2">📞</div>
                  <p className="font-medium text-gray-700">Emergency Contact</p>
                  <p className="text-sm text-gray-500">24/7 Support: (555) 911-0000</p>
                </div> */}
              </div>
            </div>

            {/* Recent Issues Preview */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Recent Issues</h3>
                <button
                  onClick={() => setActiveTab("issues")}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  View All →
                </button>
              </div>
              <div className="space-y-3">
                {issues.slice(0, 3).map((issue) => (
                  <div key={issue._id || issue.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">{getCategoryIcon(issue.category)}</span>
                      <div>
                        <p className="font-medium text-gray-800">{issue.title}</p>
                        <p className="text-sm text-gray-500">{issue.location}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(issue.status)}`}>
                      {issue.status.replace('-', ' ')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "report" && (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Report a New Issue</h2>
              <p className="text-gray-600">Help us maintain our community by reporting any issues you encounter.</p>
            </div>
            <IssueForm addIssue={addIssue} onSuccess={handleIssueSuccess} />
          </div>
        )}

        {activeTab === "issues" && (
          <div>
            <div className="mb-6 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">My Issues</h2>
                <p className="text-gray-600">Track the status of all your reported issues and maintenance requests.</p>
              </div>
              <button
                onClick={fetchIssues}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <span className="mr-2">🔄</span>
                )}
                Refresh
              </button>
            </div>
            
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-600">Loading issues...</span>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <span className="text-red-400">⚠️</span>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Error Loading Issues</h3>
                    <p className="mt-1 text-sm text-red-700">{error}</p>
                    <button 
                      onClick={() => window.location.reload()} 
                      className="mt-2 text-sm text-red-600 hover:text-red-500 underline"
                    >
                      Try again
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                {issues.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">📝</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Issues Found</h3>
                    <p className="text-gray-500 mb-4">You haven't reported any issues yet.</p>
                    <button
                      onClick={() => setActiveTab("report")}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Report Your First Issue
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="mb-4 text-sm text-gray-600">
                      Showing {issues.length} issue{issues.length !== 1 ? 's' : ''}
                    </div>
                    <IssueList 
                      issues={issues}
                      onEdit={(issue) => setEditingIssue(issue)}
                      onDelete={(issue) => setDeleteConfirm({ isOpen: true, issue })}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === "notifications" && (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Notifications</h2>
              <p className="text-gray-600">Stay updated on your issue status changes.</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <NotificationList />
            </div>
          </div>
        )}
      </main>

      {/* Edit Issue Modal */}
      <EditIssueModal
        issue={editingIssue}
        isOpen={!!editingIssue}
        onClose={() => setEditingIssue(null)}
        onSuccess={(updated) => {
          setIssues(prev => prev.map(i => i._id === updated._id ? updated : i));
          setEditingIssue(null);
        }}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        title="Delete Issue?"
        message={`Are you sure you want to delete "${deleteConfirm.issue?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        onConfirm={() => handleDeleteIssue(deleteConfirm.issue._id)}
        onCancel={() => setDeleteConfirm({ isOpen: false, issue: null })}
      />

      {/* Notification Panel Dropdown */}
      <NotificationPanel
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
      />
    </div>
  );
}

// Helper functions (these should ideally be moved to a utilities file)
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

const getStatusColor = (status) => {
  const colors = {
    "pending": "bg-yellow-100 text-yellow-800",
    "in-progress": "bg-blue-100 text-blue-800",
    "resolved": "bg-green-100 text-green-800",
    "closed": "bg-gray-100 text-gray-800"
  };
  return colors[status] || "bg-gray-100 text-gray-800";
};
