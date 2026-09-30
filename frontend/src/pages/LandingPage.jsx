import { useState, useMemo } from "react";
import { Link } from "react-router-dom";

export default function LandingPage() {
  // Mock data for public viewing - in a real app, this would come from an API
  const allPublicIssues = [
    { 
      id: 1,
      title: "Leaky Faucet", 
      description: "Kitchen faucet is leaking and needs immediate attention. Water is dripping constantly and has caused some water damage to the counter.", 
      status: "pending",
      category: "plumbing",
      priority: "high",
      location: "Building A, Floor 2, Unit 205",
      resident: "Aditya Raut",
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    },
    { 
      id: 2,
      title: "Broken Light Fixture", 
      description: "Light in the hallway is not working. The fixture seems to be loose and makes a buzzing sound when switched on.", 
      status: "resolved",
      category: "electrical",
      priority: "medium",
      location: "Building A, Floor 2, Hallway",
      resident: "Shreya Rane",
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
    },
    { 
      id: 3,
      title: "Garbage Chute Stuck", 
      description: "The garbage chute on the 3rd floor is completely blocked. Residents cannot dispose of their trash properly.", 
      status: "in-progress",
      category: "maintenance",
      priority: "urgent",
      location: "Building B, Floor 3, Garbage Room",
      resident: "Anchita Patekar",
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
    },
    { 
      id: 4,
      title: "Security Camera Malfunction", 
      description: "Security camera at the main entrance is not recording properly.", 
      status: "pending",
      category: "security",
      priority: "high",
      location: "Building A, Main Entrance",
      resident: "Rohit Patil",
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
    },
    { 
      id: 5,
      title: "Elevator Maintenance", 
      description: "Elevator in Building B is making unusual noises and sometimes gets stuck between floors.", 
      status: "resolved",
      category: "maintenance",
      priority: "high",
      location: "Building B, Elevator",
      resident: "Aditya Raut",
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString()
    },
    { 
      id: 6,
      title: "Parking Lot Lighting", 
      description: "Several parking lot lights are not working, making it difficult to see at night.", 
      status: "pending",
      category: "electrical",
      priority: "medium",
      location: "Building A, Parking Lot",
      resident: "Rohit Patil",
      createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
    }
  ];

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [sortBy, setSortBy] = useState("createdAt");

  const categories = [
    { value: "plumbing", label: "Plumbing", icon: "🚰" },
    { value: "electrical", label: "Electrical", icon: "⚡" },
    { value: "maintenance", label: "Maintenance", icon: "🔧" },
    { value: "security", label: "Security", icon: "🔒" },
    { value: "cleaning", label: "Cleaning", icon: "🧹" },
    { value: "landscaping", label: "Landscaping", icon: "🌳" },
    { value: "general", label: "General", icon: "📋" }
  ];

  const priorities = [
    { value: "low", label: "Low", color: "bg-gray-100 text-gray-700" },
    { value: "medium", label: "Medium", color: "bg-yellow-100 text-yellow-700" },
    { value: "urgent", label: "Urgent", color: "bg-red-100 text-red-700" }
  ];

  const statuses = [
    { value: "pending", label: "Pending", color: "bg-yellow-100 text-yellow-800" },
    { value: "in-progress", label: "In Progress", color: "bg-blue-100 text-blue-800" },
    { value: "resolved", label: "Resolved", color: "bg-green-100 text-green-800" },
    { value: "closed", label: "Closed", color: "bg-gray-100 text-gray-800" }
  ];

  const filteredAndSortedIssues = useMemo(() => {
    let filtered = allPublicIssues.filter(issue => {
      const matchesSearch = issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           issue.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           issue.resident.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || issue.status === statusFilter;
      const matchesCategory = categoryFilter === "all" || issue.category === categoryFilter;
      const matchesPriority = priorityFilter === "all" || issue.priority === priorityFilter;
      
      return matchesSearch && matchesStatus && matchesCategory && matchesPriority;
    });

    // Sort the filtered results
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "createdAt":
          return new Date(b.createdAt) - new Date(a.createdAt);
        case "priority":
          const priorityOrder = { urgent: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case "title":
          return a.title.localeCompare(b.title);
        case "status":
          return a.status.localeCompare(b.status);
        default:
          return 0;
      }
    });

    return filtered;
  }, [allPublicIssues, searchTerm, statusFilter, categoryFilter, priorityFilter, sortBy]);

  const getStatusColor = (status) => {
    return statuses.find(s => s.value === status)?.color || "bg-gray-100 text-gray-800";
  };

  const getPriorityColor = (priority) => {
    return priorities.find(p => p.value === priority)?.color || "bg-gray-100 text-gray-700";
  };

  const getCategoryIcon = (category) => {
    return categories.find(c => c.value === category)?.icon || "📋";
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

  const getStatusIcon = (status) => {
    const icons = {
      "pending": "⏳",
      "in-progress": "🔄",
      "resolved": "✅",
      "closed": "🔒"
    };
    return icons[status] || "❓";
  };

  // Calculate statistics for the public view
  const stats = {
    total: filteredAndSortedIssues.length,
    pending: filteredAndSortedIssues.filter(issue => issue.status === "pending").length,
    inProgress: filteredAndSortedIssues.filter(issue => issue.status === "in-progress").length,
    resolved: filteredAndSortedIssues.filter(issue => issue.status === "resolved").length,
    urgent: filteredAndSortedIssues.filter(issue => issue.priority === "urgent").length,
    medium: filteredAndSortedIssues.filter(issue => issue.priority === "medium").length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Welcome to CitizenConnect
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Community Issue Management & Transparency Portal
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/login"
                className="px-8 py-3 bg-white text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-200 transform hover:scale-105"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-8 py-3 border-2 border-white text-white rounded-xl font-semibold hover:bg-white hover:text-blue-600 transition-all duration-200 transform hover:scale-105"
              >
                Join Community
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Community Overview</h2>
          <p className="text-gray-600 text-lg">Stay informed about maintenance and community issues</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-12">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-center">
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
            <div className="flex items-center justify-center">
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
            <div className="flex items-center justify-center">
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
            <div className="flex items-center justify-center">
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
            <div className="flex items-center justify-center">
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
      </div>

      {/* Issues Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="bg-gray-50 px-6 py-6 border-b border-gray-200">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h3 className="text-2xl font-bold text-gray-800">Community Issues</h3>
                <p className="text-gray-600">View all reported maintenance and community issues</p>
              </div>
              
              {/* Search Bar */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search issues by title, description, or resident name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full lg:w-80 px-4 py-2 pl-10 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
              </div>
            </div>

            {/* Filters and Sort */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mt-6">
              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>

              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select 
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Categories</option>
                  {categories.map(category => (
                    <option key={category.value} value={category.value}>
                      {category.icon} {category.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Priority Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                <select 
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Priorities</option>
                  {priorities.map(priority => (
                    <option key={priority.value} value={priority.value}>
                      {priority.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort By */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="createdAt">Date Reported</option>
                  <option value="priority">Priority</option>
                  <option value="title">Title</option>
                  <option value="status">Status</option>
                  <option value="resident">Resident Name</option>
                </select>
              </div>

              {/* Clear Filters */}
              <div className="flex items-end">
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setStatusFilter("all");
                    setCategoryFilter("all");
                    setPriorityFilter("all");
                    setSortBy("createdAt");
                  }}
                  className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>

          {/* Issues List */}
          <div className="p-6">
            {filteredAndSortedIssues.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📋</div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No issues found</h3>
                <p className="text-gray-500">
                  {searchTerm || statusFilter !== "all" || categoryFilter !== "all" || priorityFilter !== "all"
                    ? "Try adjusting your filters or search terms"
                    : "No issues have been reported yet"}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredAndSortedIssues.map((issue) => (
                  <div key={issue.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all duration-200 bg-gray-50/50">
                    {/* Issue Header */}
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-4 gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-2xl">{getCategoryIcon(issue.category)}</span>
                          <h4 className="text-lg font-semibold text-gray-800">{issue.title}</h4>
                        </div>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-2">
                          <span><strong>Resident:</strong> {issue.resident}</span>
                          <span><strong>Location:</strong> {issue.location}</span>
                          <span><strong>Reported:</strong> {formatDate(issue.createdAt)}</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(issue.status)}`}>
                          {getStatusIcon(issue.status)} {issue.status.replace('-', ' ')}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(issue.priority)}`}>
                          {issue.priority}
                        </span>
                      </div>
                    </div>

                    {/* Issue Description */}
                    <p className="text-gray-700 mb-4 leading-relaxed">{issue.description}</p>

                    {/* Issue Footer */}
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pt-4 border-t border-gray-200">
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>📅 {formatDate(issue.createdAt)}</span>
                        {issue.updatedAt !== issue.createdAt && (
                          <span>🔄 Updated: {formatDate(issue.updatedAt)}</span>
                        )}
                      </div>
                      
                      <div className="flex gap-2">
                        <Link
                          to="/login"
                          className="px-4 py-2 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                        >
                          Sign In to Report Similar Issue
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-3xl font-bold mb-4">Join Our Community</h2>
          <p className="text-xl mb-8 text-green-100">
            Report issues, track maintenance, and stay connected with your neighbors
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="px-8 py-3 bg-white text-green-600 rounded-xl font-semibold hover:bg-green-50 transition-all duration-200 transform hover:scale-105"
            >
              Create Account
            </Link>
            <Link
              to="/login"
              className="px-8 py-3 border-2 border-white text-white rounded-xl font-semibold hover:bg-white hover:text-green-600 transition-all duration-200 transform hover:scale-105"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
