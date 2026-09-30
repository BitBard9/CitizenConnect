import { useState } from "react";

export default function RoleSelectionModal({ isOpen, onClose, onSubmit, userInfo }) {
  const [formData, setFormData] = useState({
    role: "resident",
    building: "",
    unit: "",
    specialization: [],
    phone: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSpecializationChange = (e) => {
    const value = e.target.value;
    const checked = e.target.checked;

    setFormData((prev) => ({
      ...prev,
      specialization: checked
        ? [...prev.specialization, value]
        : prev.specialization.filter((s) => s !== value),
    }));

    if (errors.specialization) {
      setErrors((prev) => ({ ...prev, specialization: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }

    if (formData.role === "resident") {
      if (!formData.building.trim()) {
        newErrors.building = "Building is required for residents";
      }
      if (!formData.unit.trim()) {
        newErrors.unit = "Unit number is required for residents";
      }
    }

    if (formData.role === "technician") {
      if (!formData.specialization || formData.specialization.length === 0) {
        newErrors.specialization = "At least one specialization is required for technicians";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error("Error submitting role selection:", error);
      setErrors({ general: "Failed to complete registration. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 text-white">
          <h2 className="text-2xl font-bold">Complete Your Profile</h2>
          <p className="text-blue-100 text-sm mt-1">
            Welcome, {userInfo?.displayName || "User"}! Please select your role and provide additional information.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {errors.general && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {errors.general}
            </div>
          )}

          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Select Your Role *
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: "resident", icon: "🏠", label: "Resident" },
                { value: "committee", icon: "👥", label: "Committee" },
                { value: "technician", icon: "🔧", label: "Technician" },
              ].map((role) => (
                <button
                  key={role.value}
                  type="button"
                  onClick={() => handleInputChange({ target: { name: "role", value: role.value } })}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                    formData.role === role.value
                      ? "border-blue-500 bg-blue-50 text-blue-700 shadow-md"
                      : "border-gray-200 hover:border-gray-300 text-gray-600"
                  }`}
                >
                  <div className="text-3xl mb-2">{role.icon}</div>
                  <div className="text-sm font-semibold">{role.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number *
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Enter your phone number"
              className={`w-full px-4 py-3 border rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.phone ? "border-red-300 bg-red-50" : "border-gray-300"
              }`}
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
            )}
          </div>

          {/* Resident-Specific Fields */}
          {formData.role === "resident" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Building *
                </label>
                <input
                  type="text"
                  name="building"
                  value={formData.building}
                  onChange={handleInputChange}
                  placeholder="e.g., Building A, Tower 1"
                  className={`w-full px-4 py-3 border rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.building ? "border-red-300 bg-red-50" : "border-gray-300"
                  }`}
                />
                {errors.building && (
                  <p className="mt-1 text-sm text-red-600">{errors.building}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Unit Number *
                </label>
                <input
                  type="text"
                  name="unit"
                  value={formData.unit}
                  onChange={handleInputChange}
                  placeholder="e.g., 205, 3B"
                  className={`w-full px-4 py-3 border rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.unit ? "border-red-300 bg-red-50" : "border-gray-300"
                  }`}
                />
                {errors.unit && (
                  <p className="mt-1 text-sm text-red-600">{errors.unit}</p>
                )}
              </div>
            </div>
          )}

          {/* Technician-Specific Fields */}
          {formData.role === "technician" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Specializations * (Select all that apply)
              </label>
              <div className="grid grid-cols-2 gap-3 p-4 border border-gray-300 rounded-xl max-h-64 overflow-y-auto">
                {[
                  "plumbing",
                  "electrical",
                  "hvac",
                  "carpentry",
                  "painting",
                  "flooring",
                  "roofing",
                  "appliance",
                  "security",
                  "landscaping",
                  "general",
                  "other",
                ].map((spec) => (
                  <label
                    key={spec}
                    className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                  >
                    <input
                      type="checkbox"
                      name="specialization"
                      value={spec}
                      checked={formData.specialization.includes(spec)}
                      onChange={handleSpecializationChange}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm capitalize">{spec}</span>
                  </label>
                ))}
              </div>
              {errors.specialization && (
                <p className="mt-1 text-sm text-red-600">{errors.specialization}</p>
              )}
              {formData.role === "technician" && (
                <p className="mt-2 text-sm text-amber-600 bg-amber-50 p-3 rounded-lg border border-amber-200">
                  ⚠️ Note: Technician accounts require committee approval before you can access the system.
                </p>
              )}
            </div>
          )}

          {/* Committee Info */}
          {formData.role === "committee" && (
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Committee Member:</strong> You will have access to manage issues, approve technicians, and oversee community operations.
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex-1 px-4 py-3 rounded-xl font-semibold text-white transition-all duration-200 ${
                isSubmitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transform hover:scale-[1.02] active:scale-[0.98]"
              }`}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Completing...
                </div>
              ) : (
                "Complete Registration"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
