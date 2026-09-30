import { useState } from "react";
import api from "../api/apiClients";

export default function IssueForm({ addIssue, onSuccess }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "general",
    priority: "medium",
    location: "",
    contactPhone: ""
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = "Issue title is required";
    } else if (formData.title.length < 5) {
      newErrors.title = "Title must be at least 5 characters";
    }
    
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.length < 20) {
      newErrors.description = "Description must be at least 20 characters";
    }
    
    if (!formData.location.trim()) {
      newErrors.location = "Location is required";
    }
    
    if (formData.contactPhone && !/^[\+]?[1-9][\d]{0,15}$/.test(formData.contactPhone.replace(/\s/g, ''))) {
      newErrors.contactPhone = "Please enter a valid phone number";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      console.log("Submitting issue:", formData);
      const response = await api.post('/issues', formData);
      console.log("Issue created successfully:", response.data);
      
      // Add to local state if addIssue function provided
      if (addIssue) {
        addIssue(response.data);
      }
      
      // Call success callback if provided
      if (onSuccess) {
        onSuccess(response.data);
      }
      
      // Reset form
      setFormData({
        title: "",
        description: "",
        category: "general",
        priority: "medium",
        location: "",
        contactPhone: ""
      });
      
      // Clear errors
      setErrors({});
      
    } catch (error) {
      console.error("Error creating issue:", error);
      setErrors({ 
        general: error.response?.data?.error || "Failed to create issue. Please try again." 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPriorityColor = (priority) => {
    return priorities.find(p => p.value === priority)?.color || "bg-gray-100 text-gray-700";
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-100">
      <div className="flex items-center mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center mr-3">
          <span className="text-white text-xl">📝</span>
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-800">Report a New Issue</h3>
          <p className="text-gray-600 text-sm">Help us maintain our community by reporting issues</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title and Category Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Issue Title *
            </label>
            <input
              type="text"
              name="title"
              placeholder="Brief description of the issue"
              className={`w-full px-4 py-3 border rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.title ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
              }`}
              value={formData.title}
              onChange={handleInputChange}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <select
              name="category"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-400 transition-all duration-200"
              value={formData.category}
              onChange={handleInputChange}
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.icon} {cat.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Priority and Location Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Priority Level *
            </label>
            <div className="grid grid-cols-4 gap-2">
              {priorities.map((priority) => (
                <button
                  key={priority.value}
                  type="button"
                  onClick={() => handleInputChange({ target: { name: 'priority', value: priority.value } })}
                  className={`p-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                    formData.priority === priority.value
                      ? priority.color + ' ring-2 ring-blue-500'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {priority.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location *
            </label>
            <input
              type="text"
              name="location"
              placeholder="e.g., Building A, Floor 3, Room 301"
              className={`w-full px-4 py-3 border rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.location ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
              }`}
              value={formData.location}
              onChange={handleInputChange}
            />
            {errors.location && (
              <p className="mt-1 text-sm text-red-600">{errors.location}</p>
            )}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Detailed Description *
          </label>
          <textarea
            name="description"
            rows="4"
            placeholder="Please provide detailed information about the issue, including any specific details that might help our team resolve it quickly..."
            className={`w-full px-4 py-3 border rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
              errors.description ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
            }`}
            value={formData.description}
            onChange={handleInputChange}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            {formData.description.length}/500 characters
          </p>
        </div>

        {/* Contact Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Contact Phone (Optional)
          </label>
          <input
            type="tel"
            name="contactPhone"
            placeholder="+1 (555) 123-4567"
            className={`w-full px-4 py-3 border rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.contactPhone ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
            }`}
            value={formData.contactPhone}
            onChange={handleInputChange}
          />
          {errors.contactPhone && (
            <p className="mt-1 text-sm text-red-600">{errors.contactPhone}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            We'll contact you if we need additional information
          </p>
        </div>


        {/* General Error Display */}
        {errors.general && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <span className="text-red-400">⚠️</span>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-800">{errors.general}</p>
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-8 py-3 rounded-xl font-semibold text-white transition-all duration-200 ${
              isSubmitting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 transform hover:scale-[1.02] active:scale-[0.98]'
            }`}
          >
            {isSubmitting ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Submitting...
              </div>
            ) : (
              'Submit Issue Report'
            )}
          </button>
        </div>
      </form>
      
      {/* Debug Component - Remove in production */}
    </div>
  );
}
