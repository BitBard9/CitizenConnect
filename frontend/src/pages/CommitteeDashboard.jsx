import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../config/firebaseConfig";
import { useAuth } from "../context/AuthContext";
import api from "../api/apiClients";
import TechnicianApprovalPage from "../components/TechnicianApprovalPage";

export default function CommitteeDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userName, setUserName] = useState("");
  const [allIssues, setAllIssues] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [selectedTechnician, setSelectedTechnician] = useState("");
  const [selectedIssueForQuickAssign, setSelectedIssueForQuickAssign] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    fetchUserInfo();
    fetchAllIssues();
    fetchTechnicians();
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

  // Refresh technicians when switching to assignments or approvals tab
  useEffect(() => {
    if (activeTab === "assignments" || activeTab === "approvals") {
      fetchTechnicians();
    }
  }, [activeTab]);

  // Fetch all issues from backend
  const fetchAllIssues = async () => {
    try {
      setLoading(true);
      console.log("Fetching all issues for committee...");
      const response = await api.get('/issues/all');
      console.log("All issues fetched:", response.data);
      setAllIssues(response.data);
      setError(null);
    } catch (error) {
      console.error("Error fetching all issues:", error);
      setError("Failed to load issues. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchTechnicians = async () => {
    try {
      console.log("Fetching technicians...");
      const response = await api.get('/users/technicians');
      console.log("Technicians fetched:", response.data);
      console.log("Number of technicians:", response.data.length);
      setTechnicians(response.data);
      
      if (response.data.length === 0) {
        console.warn("⚠️ No technicians found! Check backend query.");
      }
    } catch (error) {
      console.error("Error fetching technicians:", error);
      console.error("Error details:", error.response?.data);
      // Don't set error state for technicians, just log it
    }
  };

  // Filtered issues based on search and filters
  const filteredIssues = allIssues.filter(issue => {
    const matchesSearch = issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         issue.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         issue.resident.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || issue.status === statusFilter;
    const matchesCategory = categoryFilter === "all" || issue.category === categoryFilter;
    const matchesPriority = priorityFilter === "all" || issue.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesCategory && matchesPriority;
  });

  // Action handlers
  const handleApproveIssue = async (issueId) => {
    try {
      console.log("Approving issue:", issueId);
      const response = await api.put(`/issues/${issueId}/approve`);
      console.log("Issue approved:", response.data);
      
      // Update local state
      setAllIssues(prev => prev.map(issue => 
        issue._id === issueId ? { ...issue, status: "approved" } : issue
      ));
    } catch (error) {
      console.error("Error approving issue:", error);
      alert("Failed to approve issue. Please try again.");
    }
  };

  const handleAssignIssue = async (issueId) => {
    if (!selectedTechnician) {
      alert("Please select a technician first.");
      return;
    }
    
    try {
      console.log("Assigning issue:", issueId, "to technician:", selectedTechnician);
      const response = await api.put(`/issues/${issueId}/assign`, { technicianUid: selectedTechnician });
      console.log("Issue assigned:", response.data);
      
      // Update local state
      setAllIssues(prev => prev.map(issue => 
        issue._id === issueId ? { ...issue, status: "assigned", assignedToUid: selectedTechnician } : issue
      ));
      
      // Clear selection
      setSelectedTechnician("");
    } catch (error) {
      console.error("Error assigning issue:", error);
      alert("Failed to assign issue. Please try again.");
    }
  };

  const handleViewIssue = (issueId) => {
    // In a real app, this would open a detailed view
    console.log(`Viewing issue ${issueId}`);
  };

  const stats = {
    total: allIssues.length,
    pending: allIssues.filter(issue => issue.status === "pending").length,
    inProgress: allIssues.filter(issue => issue.status === "in-progress").length,
    resolved: allIssues.filter(issue => issue.status === "resolved").length,
    urgent: allIssues.filter(issue => issue.priority === "urgent").length,
    medium: allIssues.filter(issue => issue.priority === "medium").length
  };

  const handleLogout = async () => {
    await auth.signOut();
    navigate("/login");
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white text-lg font-bold">👥</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900">CitizenConnect</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">Committee Member</p>
                <p className="text-xs text-gray-500">Management Dashboard</p>
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
              { id: "issues", label: "All Issues", icon: "📋" },
              { id: "assignments", label: "Assignments", icon: "👷" },
              { id: "approvals", label: "Technician Approvals", icon: "✅" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? "border-green-500 text-green-600"
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => setActiveTab("issues")}
                  className="p-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-green-400 hover:bg-green-50 transition-all duration-200 text-center group"
                >
                  <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">📋</div>
                  <p className="font-medium text-gray-700">Review Issues</p>
                  <p className="text-sm text-gray-500">Approve and assign tasks</p>
                </button>
                
                <button
                  onClick={() => setActiveTab("assignments")}
                  className="p-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 text-center group"
                >
                  <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">👷</div>
                  <p className="font-medium text-gray-700">Manage Assignments</p>
                  <p className="text-sm text-gray-500">Assign technicians</p>
                </button>
              </div>
            </div>

            {/* Recent Issues */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Recent Issues</h3>
                <button
                  onClick={() => setActiveTab("issues")}
                  className="text-sm text-green-600 hover:text-green-700 font-medium"
                >
                  View All →
                </button>
              </div>
              <div className="space-y-3">
                {allIssues.slice(0, 3).map((issue) => (
                  <div key={issue.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">{getCategoryIcon(issue.category)}</span>
                      <div>
                        <p className="font-medium text-gray-800">{issue.title}</p>
                        <p className="text-sm text-gray-500">{issue.resident} • {issue.location}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(issue.priority)}`}>
                        {issue.priority}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(issue.status)}`}>
                        {issue.status.replace('-', ' ')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "issues" && (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">All Community Issues</h2>
              <p className="text-gray-600">Review and manage all reported issues from residents.</p>
            </div>
            
            {/* Search and Filters */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                  <input
                    type="text"
                    placeholder="Search issues..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select 
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="all">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                  <select 
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="all">All Priorities</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select 
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="all">All Categories</option>
                    <option value="plumbing">Plumbing</option>
                    <option value="electrical">Electrical</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="security">Security</option>
                    <option value="cleaning">Cleaning</option>
                    <option value="landscaping">Landscaping</option>
                    <option value="general">General</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Issues Table */}
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
                      onClick={fetchAllIssues} 
                      className="mt-2 text-sm text-red-600 hover:text-red-500 underline"
                    >
                      Try again
                    </button>
                  </div>
                </div>
              </div>
            ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Issue
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Resident
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Location
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Priority
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredIssues.map((issue) => (
                      <tr key={issue._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className="text-lg mr-3">{getCategoryIcon(issue.category)}</span>
                            <div>
                              <div className="text-sm font-medium text-gray-900">{issue.title}</div>
                              <div className="text-sm text-gray-500">{issue.description.substring(0, 60)}...</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">Resident</div>
                          <div className="text-sm text-gray-500">{issue.contactPhone || 'No phone'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {issue.location}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(issue.priority)}`}>
                            {issue.priority}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(issue.status)}`}>
                            {issue.status.replace('-', ' ')}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            {issue.status === "pending" && (
                              <button 
                                onClick={() => handleApproveIssue(issue._id)}
                                className="text-green-600 hover:text-green-900 bg-green-100 hover:bg-green-200 px-3 py-1 rounded-md transition-colors"
                              >
                                Approve
                              </button>
                            )}
                            {issue.status === "approved" && (
                              <div className="flex items-center space-x-2">
                                <select
                                  value={selectedTechnician}
                                  onChange={(e) => setSelectedTechnician(e.target.value)}
                                  className="text-sm border border-gray-300 rounded-md px-2 py-1"
                                >
                                  <option value="">Select Technician</option>
                                  {technicians.map(tech => (
                                    <option key={tech.uid} value={tech.uid}>
                                      {tech.firstName} {tech.lastName} - {tech.specialization.join(', ')}
                                    </option>
                                  ))}
                                </select>
                                <button
                                  onClick={() => handleAssignIssue(issue._id)}
                                  disabled={!selectedTechnician}
                                  className="text-blue-600 hover:text-blue-900 bg-blue-100 hover:bg-blue-200 px-3 py-1 rounded-md transition-colors disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
                                >
                                  Assign
                                </button>
                              </div>
                            )}
                            <button 
                              onClick={() => handleViewIssue(issue._id)}
                              className="text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-md transition-colors"
                            >
                              View
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            )}
          </div>
        )}

        {activeTab === "assignments" && (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Technician Assignments</h2>
              <p className="text-gray-600">Assign and track work orders for technicians.</p>
            </div>

            {/* Assignment Overview
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                    <span className="text-2xl text-blue-600">👷</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Available Technicians</p>
                    <p className="text-2xl font-bold text-gray-900">8</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mr-4">
                    <span className="text-2xl text-yellow-600">📋</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Pending Assignments</p>
                    <p className="text-2xl font-bold text-gray-900">12</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                    <span className="text-2xl text-green-600">✅</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Completed Today</p>
                    <p className="text-2xl font-bold text-gray-900">5</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                    <span className="text-2xl text-purple-600">⏱️</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Avg. Response Time</p>
                    <p className="text-2xl font-bold text-gray-900">2.3h</p>
                  </div>
                </div>
              </div>
            </div> */}

            {/* Technician Management */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Available Technicians</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Technician
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Specializations
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {technicians.length === 0 ? (
                      <tr>
                        <td colSpan="2" className="px-6 py-12 text-center">
                          <div className="text-gray-500">
                            <p className="text-lg font-medium mb-2">No Technicians Available</p>
                            <p className="text-sm">Approve technicians from the "Technician Approvals" tab</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      technicians.map((tech) => (
                        <tr key={tech.uid} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-medium">
                                {tech.firstName[0]}{tech.lastName[0]}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{tech.firstName} {tech.lastName}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-wrap gap-1">
                              {tech.specialization.map((skill) => (
                                <span key={skill} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full capitalize">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Quick Assignment */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Assignment</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Issue</label>
                  <select 
                    value={selectedIssueForQuickAssign}
                    onChange={(e) => setSelectedIssueForQuickAssign(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Choose an issue...</option>
                    {allIssues
                      .filter(issue => ['approved', 'pending', 'rejected'].includes(issue.status))
                      .map(issue => (
                        <option key={issue._id} value={issue._id}>
                          {issue.title} ({issue.status})
                        </option>
                      ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Technician</label>
                  <select 
                    value={selectedTechnician}
                    onChange={(e) => setSelectedTechnician(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Choose a technician...</option>
                    {technicians.map(tech => (
                      <option key={tech.uid} value={tech.uid}>
                        {tech.firstName} {tech.lastName} ({tech.specialization.join('/')})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-end">
                  <button 
                    onClick={() => {
                      if (selectedIssueForQuickAssign && selectedTechnician) {
                        handleAssignIssue(selectedIssueForQuickAssign);
                      } else {
                        alert("Please select both an issue and a technician");
                      }
                    }}
                    disabled={!selectedIssueForQuickAssign || !selectedTechnician}
                    className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    Assign Work
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "approvals" && (
          <TechnicianApprovalPage />
        )}

      </main>
    </div>
  );
}
