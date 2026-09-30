import { useState, useMemo } from "react";

export default function IssueList({ issues, onEdit, onDelete }) {
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
    let filtered = issues.filter(issue => {
      const matchesSearch = issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           issue.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           issue.location.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || issue.status === statusFilter;
      const matchesCategory = categoryFilter === "all" || issue.category === categoryFilter;
      const matchesPriority = priorityFilter === "all" || issue.priority === priorityFilter;
      
      return matchesSearch && matchesStatus && matchesCategory && matchesPriority;
    });

    // Sort issues
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
          const statusOrder = { "in-progress": 1, pending: 2, resolved: 3, closed: 4 };
          return statusOrder[a.status] - statusOrder[b.status];
        default:
          return 0;
      }
    });

    return filtered;
  }, [issues, searchTerm, statusFilter, categoryFilter, priorityFilter, sortBy]);

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

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 gap-4">
        <div>
          <h4 className="text-2xl font-bold text-gray-800">My Issues</h4>
          <p className="text-gray-600">
            {filteredAndSortedIssues.length} of {issues.length} issues
          </p>
        </div>
        
        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search issues..."
            className="w-full lg:w-80 px-4 py-2 pl-10 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
        </div>
      </div>

      {/* Filters and Sort */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            {statuses.map(status => (
              <option key={status.value} value={status.value}>{status.label}</option>
            ))}
          </select>
        </div>

        {/* Category Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat.value} value={cat.value}>{cat.icon} {cat.label}</option>
            ))}
          </select>
        </div>

        {/* Priority Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
          >
            <option value="all">All Priorities</option>
            {priorities.map(priority => (
              <option key={priority.value} value={priority.value}>{priority.label}</option>
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
            <option value="createdAt">Date Created</option>
            <option value="priority">Priority</option>
            <option value="title">Title</option>
            <option value="status">Status</option>
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

      {/* Issues List */}
      {filteredAndSortedIssues.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📋</div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No issues found</h3>
          <p className="text-gray-500">
            {searchTerm || statusFilter !== "all" || categoryFilter !== "all" || priorityFilter !== "all"
              ? "Try adjusting your filters or search terms"
              : "You haven't reported any issues yet"}
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
                    <h5 className="text-lg font-semibold text-gray-800">{issue.title}</h5>
                  </div>
                  <p className="text-gray-600 text-sm mb-2">{issue.location}</p>
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
                  {issue.contactPhone && <span>📞 {issue.contactPhone}</span>}
                </div>
                
                <div className="flex gap-2">
                  {/* Edit button - only for pending or approved issues */}
                  {["pending", "approved"].includes(issue.status) && onEdit && (
                    <button
                      onClick={() => onEdit(issue)}
                      className="px-4 py-2 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                    >
                      ✏️ Edit
                    </button>
                  )}
                  
                  {/* Delete button - only for pending issues */}
                  {issue.status === "pending" && onDelete && (
                    <button
                      onClick={() => onDelete(issue)}
                      className="px-4 py-2 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                    >
                      🗑️ Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
