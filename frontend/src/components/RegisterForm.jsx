// import { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";

// export default function RegisterForm() {
//   const [formData, setFormData] = useState({
//     firstName: "",
//     lastName: "",
//     email: "",
//     username: "",
//     password: "",
//     confirmPassword: "",
//     role: "resident",
//     phone: "",
//     building: "",
//     unit: ""
//   });
//   const [errors, setErrors] = useState({});
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const navigate = useNavigate();

//   const validateForm = () => {
//     const newErrors = {};
    
//     if (!formData.firstName.trim()) {
//       newErrors.firstName = "First name is required";
//     }
    
//     if (!formData.lastName.trim()) {
//       newErrors.lastName = "Last name is required";
//     }
    
//     if (!formData.email.trim()) {
//       newErrors.email = "Email is required";
//     } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
//       newErrors.email = "Please enter a valid email address";
//     }
    
//     if (!formData.username.trim()) {
//       newErrors.username = "Username is required";
//     } else if (formData.username.length < 3) {
//       newErrors.username = "Username must be at least 3 characters";
//     }
    
//     if (!formData.password) {
//       newErrors.password = "Password is required";
//     } else if (formData.password.length < 8) {
//       newErrors.password = "Password must be at least 8 characters";
//     } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
//       newErrors.password = "Password must contain at least one uppercase letter, one lowercase letter, and one number";
//     }
    
//     if (formData.password !== formData.confirmPassword) {
//       newErrors.confirmPassword = "Passwords do not match";
//     }
    
//     if (!formData.phone.trim()) {
//       newErrors.phone = "Phone number is required";
//     }
    
//     if (!formData.building.trim()) {
//       newErrors.building = "Building is required";
//     }
    
//     if (!formData.unit.trim()) {
//       newErrors.unit = "Unit number is required";
//     }
    
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//     // Clear error when user starts typing
//     if (errors[name]) {
//       setErrors(prev => ({ ...prev, [name]: "" }));
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!validateForm()) return;
    
//     setIsSubmitting(true);
    
//     // Simulate API call
//     setTimeout(() => {
//       setIsSubmitting(false);
//       // In a real app, you would send the registration data to your backend
//       console.log("Registration data:", formData);
//       navigate("/login");
//     }, 2000);
//   };

//   const getRoleIcon = (role) => {
//     const icons = {
//       resident: "🏠",
//       committee: "👥",
//       technician: "🔧"
//     };
//     return icons[role] || "👤";
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
//       <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden">
//         {/* Header */}
//         <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-8 py-6 text-white text-center">
//           <h1 className="text-3xl font-bold mb-2">CitizenConnect</h1>
//           <p className="text-green-100">Join our community today</p>
//         </div>
        
//         {/* Form */}
//         <div className="px-8 py-8">
//           <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Create Your Account</h2>
          
//           <form onSubmit={handleSubmit} className="space-y-6">
//             {/* Personal Information */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   First Name *
//                 </label>
//                 <input
//                   type="text"
//                   name="firstName"
//                   placeholder="Enter your first name"
//                   className={`w-full px-4 py-3 border rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
//                     errors.firstName ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
//                   }`}
//                   value={formData.firstName}
//                   onChange={handleInputChange}
//                 />
//                 {errors.firstName && (
//                   <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
//                 )}
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Last Name *
//                 </label>
//                 <input
//                   type="text"
//                   name="lastName"
//                   placeholder="Enter your last name"
//                   className={`w-full px-4 py-3 border rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
//                     errors.lastName ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
//                   }`}
//                   value={formData.lastName}
//                   onChange={handleInputChange}
//                 />
//                 {errors.lastName && (
//                   <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
//                 )}
//               </div>
//             </div>

//             {/* Contact Information */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Email Address *
//                 </label>
//                 <input
//                   type="email"
//                   name="email"
//                   placeholder="Enter your email"
//                   className={`w-full px-4 py-3 border rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
//                     errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
//                   }`}
//                   value={formData.email}
//                   onChange={handleInputChange}
//                 />
//                 {errors.email && (
//                   <p className="mt-1 text-sm text-red-600">{errors.email}</p>
//                 )}
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Phone Number *
//                 </label>
//                 <input
//                   type="tel"
//                   name="phone"
//                   placeholder="Enter your phone number"
//                   className={`w-full px-4 py-3 border rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
//                     errors.phone ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
//                   }`}
//                   value={formData.phone}
//                   onChange={handleInputChange}
//                 />
//                 {errors.phone && (
//                   <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
//                 )}
//               </div>
//             </div>

//             {/* Account Information */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Username *
//                 </label>
//                 <input
//                   type="text"
//                   name="username"
//                   placeholder="Choose a username"
//                   className={`w-full px-4 py-3 border rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
//                     errors.username ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
//                   }`}
//                   value={formData.username}
//                   onChange={handleInputChange}
//                 />
//                 {errors.username && (
//                   <p className="mt-1 text-sm text-red-600">{errors.username}</p>
//                 )}
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Select Your Role *
//                 </label>
//                 <select
//                   name="role"
//                   className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent hover:border-gray-400 transition-all duration-200"
//                   value={formData.role}
//                   onChange={handleInputChange}
//                 >
//                   <option value="resident">🏠 Resident</option>
//                   <option value="committee">👥 Committee Member</option>
//                   <option value="technician">🔧 Technician</option>
//                 </select>
//               </div>
//             </div>

//             {/* Password Fields */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Password *
//                 </label>
//                 <input
//                   type="password"
//                   name="password"
//                   placeholder="Create a strong password"
//                   className={`w-full px-4 py-3 border rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
//                     errors.password ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
//                   }`}
//                   value={formData.password}
//                   onChange={handleInputChange}
//                 />
//                 {errors.password && (
//                   <p className="mt-1 text-sm text-red-600">{errors.password}</p>
//                 )}
//                 <p className="mt-1 text-xs text-gray-500">
//                   Must be at least 8 characters with uppercase, lowercase, and number
//                 </p>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Confirm Password *
//                 </label>
//                 <input
//                   type="password"
//                   name="confirmPassword"
//                   placeholder="Confirm your password"
//                   className={`w-full px-4 py-3 border rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
//                     errors.confirmPassword ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
//                   }`}
//                   value={formData.confirmPassword}
//                   onChange={handleInputChange}
//                 />
//                 {errors.confirmPassword && (
//                   <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
//                 )}
//               </div>
//             </div>

//             {/* Location Information */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Building *
//                 </label>
//                 <input
//                   type="text"
//                   name="building"
//                   placeholder="e.g., Building A, Tower 1"
//                   className={`w-full px-4 py-3 border rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
//                     errors.building ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
//                   }`}
//                   value={formData.building}
//                   onChange={handleInputChange}
//                 />
//                 {errors.building && (
//                   <p className="mt-1 text-sm text-red-600">{errors.building}</p>
//                 )}
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Unit Number *
//                 </label>
//                 <input
//                   type="text"
//                   name="unit"
//                   placeholder="e.g., 205, 3B, Penthouse"
//                   className={`w-full px-4 py-3 border rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
//                     errors.unit ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
//                   }`}
//                   value={formData.unit}
//                   onChange={handleInputChange}
//                 />
//                 {errors.unit && (
//                   <p className="mt-1 text-sm text-red-600">{errors.unit}</p>
//                 )}
//               </div>
//             </div>

//             {/* Submit Button */}
//             <button
//               type="submit"
//               disabled={isSubmitting}
//               className={`w-full py-3 px-4 rounded-xl font-semibold text-white transition-all duration-200 ${
//                 isSubmitting
//                   ? 'bg-gray-400 cursor-not-allowed'
//                   : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 transform hover:scale-[1.02] active:scale-[0.98]'
//               }`}
//             >
//               {isSubmitting ? (
//                 <div className="flex items-center justify-center">
//                   <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
//                   Creating Account...
//                 </div>
//               ) : (
//                 'Create Account'
//               )}
//             </button>
//           </form>

//           {/* Login Link */}
//           <div className="mt-6 text-center">
//             <p className="text-gray-600">
//               Already have an account?{" "}
//               <Link to="/login" className="text-green-600 hover:text-green-700 font-medium">
//                 Sign in here
//               </Link>
//             </p>
//           </div>

//           {/* Demo Info */}
//           <div className="mt-6 p-4 bg-green-50 rounded-xl border border-green-200">
//             <p className="text-sm text-green-800 text-center">
//               <strong>Demo Mode:</strong> This is a demonstration registration form. 
//               No actual accounts will be created.
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }



// updated code with role specific inputs 

// import { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";

// export default function RegisterForm() {
//   const [formData, setFormData] = useState({
//     firstName: "",
//     lastName: "",
//     email: "",
//     username: "",
//     password: "",
//     confirmPassword: "",
//     role: "resident",
//     phone: "",
//     building: "",
//     unit: "",
//     committeePosition: "",
//     specialization: ""
//   });
//   const [errors, setErrors] = useState({});
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const navigate = useNavigate();

//   const validateForm = () => {
//     const newErrors = {};

//     // --- Common Validations ---
//     if (!formData.firstName.trim()) {
//       newErrors.firstName = "First name is required";
//     }

//     if (!formData.lastName.trim()) {
//       newErrors.lastName = "Last name is required";
//     }

//     if (!formData.email.trim()) {
//       newErrors.email = "Email is required";
//     } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
//       newErrors.email = "Please enter a valid email address";
//     }

//     if (!formData.username.trim()) {
//       newErrors.username = "Username is required";
//     } else if (formData.username.length < 3) {
//       newErrors.username = "Username must be at least 3 characters";
//     }

//     if (!formData.password) {
//       newErrors.password = "Password is required";
//     } else if (formData.password.length < 8) {
//       newErrors.password = "Password must be at least 8 characters";
//     } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
//       newErrors.password =
//         "Password must contain at least one uppercase letter, one lowercase letter, and one number";
//     }

//     if (formData.password !== formData.confirmPassword) {
//       newErrors.confirmPassword = "Passwords do not match";
//     }

//     if (!formData.phone.trim()) {
//       newErrors.phone = "Phone number is required";
//     }

//     // --- Role-Specific Validations ---
//     if (formData.role === "resident") {
//       if (!formData.building.trim())
//         newErrors.building = "Building is required";
//       if (!formData.unit.trim())
//         newErrors.unit = "Unit number is required";
//     }

//     if (formData.role === "committee") {
//       if (!formData.committeePosition?.trim())
//         newErrors.committeePosition = "Committee position is required";
//     }

//     if (formData.role === "technician") {
//       if (!formData.specialization?.trim())
//         newErrors.specialization = "Specialization is required";
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//     if (errors[name]) {
//       setErrors((prev) => ({ ...prev, [name]: "" }));
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!validateForm()) return;

//     setIsSubmitting(true);

//     // Simulate API call
//     setTimeout(() => {
//       setIsSubmitting(false);
//       console.log("Registration data:", formData);
//       navigate("/login");
//     }, 2000);
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
//       <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden">
//         {/* Header */}
//         <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-8 py-6 text-white text-center">
//           <h1 className="text-3xl font-bold mb-2">CitizenConnect</h1>
//           <p className="text-green-100">Join our community today</p>
//         </div>

//         {/* Form */}
//         <div className="px-8 py-8">
//           <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
//             Create Your Account
//           </h2>

//           <form onSubmit={handleSubmit} className="space-y-6">
//             {/* Personal Information */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   First Name *
//                 </label>
//                 <input
//                   type="text"
//                   name="firstName"
//                   placeholder="Enter your first name"
//                   className={`w-full px-4 py-3 border rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
//                     errors.firstName
//                       ? "border-red-300 bg-red-50"
//                       : "border-gray-300 hover:border-gray-400"
//                   }`}
//                   value={formData.firstName}
//                   onChange={handleInputChange}
//                 />
//                 {errors.firstName && (
//                   <p className="mt-1 text-sm text-red-600">
//                     {errors.firstName}
//                   </p>
//                 )}
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Last Name *
//                 </label>
//                 <input
//                   type="text"
//                   name="lastName"
//                   placeholder="Enter your last name"
//                   className={`w-full px-4 py-3 border rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
//                     errors.lastName
//                       ? "border-red-300 bg-red-50"
//                       : "border-gray-300 hover:border-gray-400"
//                   }`}
//                   value={formData.lastName}
//                   onChange={handleInputChange}
//                 />
//                 {errors.lastName && (
//                   <p className="mt-1 text-sm text-red-600">
//                     {errors.lastName}
//                   </p>
//                 )}
//               </div>
//             </div>

//             {/* Contact Information */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Email Address *
//                 </label>
//                 <input
//                   type="email"
//                   name="email"
//                   placeholder="Enter your email"
//                   className={`w-full px-4 py-3 border rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
//                     errors.email
//                       ? "border-red-300 bg-red-50"
//                       : "border-gray-300 hover:border-gray-400"
//                   }`}
//                   value={formData.email}
//                   onChange={handleInputChange}
//                 />
//                 {errors.email && (
//                   <p className="mt-1 text-sm text-red-600">{errors.email}</p>
//                 )}
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Phone Number *
//                 </label>
//                 <input
//                   type="tel"
//                   name="phone"
//                   placeholder="Enter your phone number"
//                   className={`w-full px-4 py-3 border rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
//                     errors.phone
//                       ? "border-red-300 bg-red-50"
//                       : "border-gray-300 hover:border-gray-400"
//                   }`}
//                   value={formData.phone}
//                   onChange={handleInputChange}
//                 />
//                 {errors.phone && (
//                   <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
//                 )}
//               </div>
//             </div>

//             {/* Account Information */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Username *
//                 </label>
//                 <input
//                   type="text"
//                   name="username"
//                   placeholder="Choose a username"
//                   className={`w-full px-4 py-3 border rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
//                     errors.username
//                       ? "border-red-300 bg-red-50"
//                       : "border-gray-300 hover:border-gray-400"
//                   }`}
//                   value={formData.username}
//                   onChange={handleInputChange}
//                 />
//                 {errors.username && (
//                   <p className="mt-1 text-sm text-red-600">
//                     {errors.username}
//                   </p>
//                 )}
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Select Your Role *
//                 </label>
//                 <select
//                   name="role"
//                   className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent hover:border-gray-400 transition-all duration-200"
//                   value={formData.role}
//                   onChange={handleInputChange}
//                 >
//                   <option value="resident">🏠 Resident</option>
//                   <option value="committee">👥 Committee Member</option>
//                   <option value="technician">🔧 Technician</option>
//                 </select>
//               </div>
//             </div>

//             {/* Password Fields */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Password *
//                 </label>
//                 <input
//                   type="password"
//                   name="password"
//                   placeholder="Create a strong password"
//                   className={`w-full px-4 py-3 border rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
//                     errors.password
//                       ? "border-red-300 bg-red-50"
//                       : "border-gray-300 hover:border-gray-400"
//                   }`}
//                   value={formData.password}
//                   onChange={handleInputChange}
//                 />
//                 {errors.password && (
//                   <p className="mt-1 text-sm text-red-600">
//                     {errors.password}
//                   </p>
//                 )}
//                 <p className="mt-1 text-xs text-gray-500">
//                   Must be at least 8 characters with uppercase, lowercase, and
//                   number
//                 </p>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Confirm Password *
//                 </label>
//                 <input
//                   type="password"
//                   name="confirmPassword"
//                   placeholder="Confirm your password"
//                   className={`w-full px-4 py-3 border rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
//                     errors.confirmPassword
//                       ? "border-red-300 bg-red-50"
//                       : "border-gray-300 hover:border-gray-400"
//                   }`}
//                   value={formData.confirmPassword}
//                   onChange={handleInputChange}
//                 />
//                 {errors.confirmPassword && (
//                   <p className="mt-1 text-sm text-red-600">
//                     {errors.confirmPassword}
//                   </p>
//                 )}
//               </div>
//             </div>

//             {/* Role-Specific Fields */}
//             {formData.role === "resident" && (
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Building *
//                   </label>
//                   <input
//                     type="text"
//                     name="building"
//                     placeholder="e.g., Building A, Tower 1"
//                     className={`w-full px-4 py-3 border rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
//                       errors.building
//                         ? "border-red-300 bg-red-50"
//                         : "border-gray-300 hover:border-gray-400"
//                     }`}
//                     value={formData.building}
//                     onChange={handleInputChange}
//                   />
//                   {errors.building && (
//                     <p className="mt-1 text-sm text-red-600">
//                       {errors.building}
//                     </p>
//                   )}
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Unit Number *
//                   </label>
//                   <input
//                     type="text"
//                     name="unit"
//                     placeholder="e.g., 205, 3B, Penthouse"
//                     className={`w-full px-4 py-3 border rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
//                       errors.unit
//                         ? "border-red-300 bg-red-50"
//                         : "border-gray-300 hover:border-gray-400"
//                     }`}
//                     value={formData.unit}
//                     onChange={handleInputChange}
//                   />
//                   {errors.unit && (
//                     <p className="mt-1 text-sm text-red-600">{errors.unit}</p>
//                   )}
//                 </div>
//               </div>
//             )}

//             {formData.role === "committee" && (
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Committee Position *
//                 </label>
//                 <input
//                   type="text"
//                   name="committeePosition"
//                   placeholder="e.g., Treasurer, Secretary"
//                   className={`w-full px-4 py-3 border rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
//                     errors.committeePosition
//                       ? "border-red-300 bg-red-50"
//                       : "border-gray-300 hover:border-gray-400"
//                   }`}
//                   value={formData.committeePosition}
//                   onChange={handleInputChange}
//                 />
//                 {errors.committeePosition && (
//                   <p className="mt-1 text-sm text-red-600">
//                     {errors.committeePosition}
//                   </p>
//                 )}
//               </div>
//             )}

//             {formData.role === "technician" && (
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Specialization *
//                 </label>
//                 <input
//                   type="text"
//                   name="specialization"
//                   placeholder="e.g., Electrical, Plumbing"
//                   className={`w-full px-4 py-3 border rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
//                     errors.specialization
//                       ? "border-red-300 bg-red-50"
//                       : "border-gray-300 hover:border-gray-400"
//                   }`}
//                   value={formData.specialization}
//                   onChange={handleInputChange}
//                 />
//                 {errors.specialization && (
//                   <p className="mt-1 text-sm text-red-600">
//                     {errors.specialization}
//                   </p>
//                 )}
//               </div>
//             )}

//             {/* Submit Button */}
//             <button
//               type="submit"
//               disabled={isSubmitting}
//               className={`w-full py-3 px-4 rounded-xl font-semibold text-white transition-all duration-200 ${
//                 isSubmitting
//                   ? "bg-gray-400 cursor-not-allowed"
//                   : "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 transform hover:scale-[1.02] active:scale-[0.98]"
//               }`}
//             >
//               {isSubmitting ? (
//                 <div className="flex items-center justify-center">
//                   <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
//                   Creating Account...
//                 </div>
//               ) : (
//                 "Create Account"
//               )}
//             </button>
//           </form>

//           {/* Login Link */}
//           <div className="mt-6 text-center">
//             <p className="text-gray-600">
//               Already have an account?{" "}
//               <Link
//                 to="/login"
//                 className="text-green-600 hover:text-green-700 font-medium"
//               >
//                 Sign in here
//               </Link>
//             </p>
//           </div>

//           {/* Demo Info */}
//           <div className="mt-6 p-4 bg-green-50 rounded-xl border border-green-200">
//             <p className="text-sm text-green-800 text-center">
//               <strong>Demo Mode:</strong> This is a demonstration registration
//               form. No actual accounts will be created.
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }



// updated code with firebase integration 

// import { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import {
//   createUserWithEmailAndPassword,
//   signInWithPopup,
// } from "firebase/auth";
// import { doc, setDoc } from "firebase/firestore";
// import { auth, db, googleProvider } from "../config/firebaseConfig";
// import api from "../api/apiClients";

// export default function RegisterForm() {
//   const [formData, setFormData] = useState({
//     firstName: "",
//     lastName: "",
//     email: "",
//     username: "",
//     password: "",
//     confirmPassword: "",
//     role: "resident",
//     phone: "",
//     building: "",
//     unit: "",
//     committeePosition: "",
//     specialization: "",
//   });

//   const [errors, setErrors] = useState({});
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const navigate = useNavigate();

//   // ------------------ VALIDATION ------------------
//   const validateForm = () => {
//     const newErrors = {};

//     if (!formData.firstName.trim())
//       newErrors.firstName = "First name is required";

//     if (!formData.lastName.trim())
//       newErrors.lastName = "Last name is required";

//     if (!formData.email.trim()) {
//       newErrors.email = "Email is required";
//     } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
//       newErrors.email = "Please enter a valid email address";
//     }

//     if (!formData.username.trim()) {
//       newErrors.username = "Username is required";
//     } else if (formData.username.length < 3) {
//       newErrors.username = "Username must be at least 3 characters";
//     }

//     if (!formData.password) {
//       newErrors.password = "Password is required";
//     } else if (formData.password.length < 8) {
//       newErrors.password = "Password must be at least 8 characters";
//     } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
//       newErrors.password =
//         "Password must contain uppercase, lowercase, and a number";
//     }

//     if (formData.password !== formData.confirmPassword) {
//       newErrors.confirmPassword = "Passwords do not match";
//     }

//     if (!formData.phone.trim()) newErrors.phone = "Phone number is required";

//     // Role-specific validation
//     if (formData.role === "resident") {
//       if (!formData.building.trim())
//         newErrors.building = "Building is required";
//       if (!formData.unit.trim()) newErrors.unit = "Unit number is required";
//     }

//     if (formData.role === "committee") {
//       if (!formData.committeePosition.trim())
//         newErrors.committeePosition = "Committee position is required";
//     }

//     if (formData.role === "technician") {
//       if (!formData.specialization.trim())
//         newErrors.specialization = "Specialization is required";
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   // ------------------ HANDLERS ------------------
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));

//     if (errors[name]) {
//       setErrors((prev) => ({ ...prev, [name]: "" }));
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!validateForm()) return;

//     setIsSubmitting(true);

//     try {
//       // Create user in Firebase Auth
//       const userCredential = await createUserWithEmailAndPassword(
//         auth,
//         formData.email,
//         formData.password
//       );

//       const user = userCredential.user;

//       // Save extra data in Firestore

//       await api.post("/users/sync", {
//         profile: {
//           username: formData.username,
//           role: formData.role,
//           firstName: formData.firstName,
//           lastName: formData.lastName,
//           phone: formData.phone,
//           building: formData.role === "resident" ? formData.building : "",
//           unit: formData.role === "resident" ? formData.unit : "",
// //           specialization: formData.role === "technician" ? formData.specialization : []
//         }
//       });
      
//       const { data: me } = await api.get("/users/me");
//       // redirect using me.role, e.g.:
//       if (me.role === "resident") navigate("/resident");
//       else if (me.role === "committee") navigate("/committee");
//       else if (me.role === "technician") navigate("/technician");
//       else navigate("/dashboard");

//       await setDoc(doc(db, "users", user.uid), {
//         uid: user.uid,
//         firstName: formData.firstName,
//         lastName: formData.lastName,
//         username: formData.username,
//         email: formData.email,
//         phone: formData.phone,
//         role: formData.role,
//         building: formData.role === "resident" ? formData.building : "",
//         unit: formData.role === "resident" ? formData.unit : "",
//         committeePosition:
//           formData.role === "committee" ? formData.committeePosition : "",
//         specialization:
//           formData.role === "technician" ? formData.specialization : "",
//         createdAt: new Date(),
//       });

//       navigate("/dashboard"); // redirect to dashboard or login
//     } catch (error) {
//       console.error("Error registering user:", error.message);
//       setErrors({ general: error.message });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleGoogleSignIn = async () => {
//     try {
//       const result = await signInWithPopup(auth, googleProvider);
//       const user = result.user;

//       // Check if user already exists in Firestore, if not create one
//       await setDoc(
//         doc(db, "users", user.uid),
//         {
//           uid: user.uid,
//           firstName: user.displayName?.split(" ")[0] || "",
//           lastName: user.displayName?.split(" ")[1] || "",
//           email: user.email,
//           role: "resident", // default role
//           createdAt: new Date(),
//         },
//         { merge: true }
//       );

//       navigate("/dashboard");
//     } catch (error) {
//       console.error("Google Sign-in error:", error.message);
//       setErrors({ general: error.message });
//     }
//   };

//   // ------------------ UI ------------------
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
//       <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden">
//         {/* Header */}
//         <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-8 py-6 text-white text-center">
//           <h1 className="text-3xl font-bold mb-2">CitizenConnect</h1>
//           <p className="text-green-100">Join our community today</p>
//         </div>

//         {/* Form */}
//         <div className="px-8 py-8">
//           <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
//             Create Your Account
//           </h2>

//           {errors.general && (
//             <p className="mb-4 text-center text-red-600">{errors.general}</p>
//           )}

//           <form onSubmit={handleSubmit} className="space-y-6">
//             {/* Personal Info */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   First Name *
//                 </label>
//                 <input
//                   type="text"
//                   name="firstName"
//                   value={formData.firstName}
//                   onChange={handleInputChange}
//                   className={`w-full px-4 py-3 border rounded-xl ${
//                     errors.firstName
//                       ? "border-red-300 bg-red-50"
//                       : "border-gray-300"
//                   }`}
//                 />
//                 {errors.firstName && (
//                   <p className="mt-1 text-sm text-red-600">
//                     {errors.firstName}
//                   </p>
//                 )}
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Last Name *
//                 </label>
//                 <input
//                   type="text"
//                   name="lastName"
//                   value={formData.lastName}
//                   onChange={handleInputChange}
//                   className={`w-full px-4 py-3 border rounded-xl ${
//                     errors.lastName
//                       ? "border-red-300 bg-red-50"
//                       : "border-gray-300"
//                   }`}
//                 />
//                 {errors.lastName && (
//                   <p className="mt-1 text-sm text-red-600">
//                     {errors.lastName}
//                   </p>
//                 )}
//               </div>
//             </div>

//             {/* Email / Phone */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Email *
//                 </label>
//                 <input
//                   type="email"
//                   name="email"
//                   value={formData.email}
//                   onChange={handleInputChange}
//                   className={`w-full px-4 py-3 border rounded-xl ${
//                     errors.email ? "border-red-300 bg-red-50" : "border-gray-300"
//                   }`}
//                 />
//                 {errors.email && (
//                   <p className="mt-1 text-sm text-red-600">{errors.email}</p>
//                 )}
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Phone *
//                 </label>
//                 <input
//                   type="tel"
//                   name="phone"
//                   value={formData.phone}
//                   onChange={handleInputChange}
//                   className={`w-full px-4 py-3 border rounded-xl ${
//                     errors.phone ? "border-red-300 bg-red-50" : "border-gray-300"
//                   }`}
//                 />
//                 {errors.phone && (
//                   <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
//                 )}
//               </div>
//             </div>

//             {/* Username + Role */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Username *
//                 </label>
//                 <input
//                   type="text"
//                   name="username"
//                   value={formData.username}
//                   onChange={handleInputChange}
//                   className={`w-full px-4 py-3 border rounded-xl ${
//                     errors.username
//                       ? "border-red-300 bg-red-50"
//                       : "border-gray-300"
//                   }`}
//                 />
//                 {errors.username && (
//                   <p className="mt-1 text-sm text-red-600">
//                     {errors.username}
//                   </p>
//                 )}
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Select Role *
//                 </label>
//                 <select
//                   name="role"
//                   value={formData.role}
//                   onChange={handleInputChange}
//                   className="w-full px-4 py-3 border rounded-xl border-gray-300"
//                 >
//                   <option value="resident">🏠 Resident</option>
//                   <option value="committee">👥 Committee Member</option>
//                   <option value="technician">🔧 Technician</option>
//                 </select>
//               </div>
//             </div>

//             {/* Role-Specific Fields */}
//             {formData.role === "resident" && (
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm">Building *</label>
//                   <input
//                     type="text"
//                     name="building"
//                     value={formData.building}
//                     onChange={handleInputChange}
//                     className={`w-full px-4 py-3 border rounded-xl ${
//                       errors.building
//                         ? "border-red-300 bg-red-50"
//                         : "border-gray-300"
//                     }`}
//                   />
//                   {errors.building && (
//                     <p className="mt-1 text-sm text-red-600">
//                       {errors.building}
//                     </p>
//                   )}
//                 </div>
//                 <div>
//                   <label className="block text-sm">Unit *</label>
//                   <input
//                     type="text"
//                     name="unit"
//                     value={formData.unit}
//                     onChange={handleInputChange}
//                     className={`w-full px-4 py-3 border rounded-xl ${
//                       errors.unit
//                         ? "border-red-300 bg-red-50"
//                         : "border-gray-300"
//                     }`}
//                   />
//                   {errors.unit && (
//                     <p className="mt-1 text-sm text-red-600">{errors.unit}</p>
//                   )}
//                 </div>
//               </div>
//             )}

//             {formData.role === "committee" && (
//               <div>
//                 <label className="block text-sm">Committee Position *</label>
//                 <input
//                   type="text"
//                   name="committeePosition"
//                   value={formData.committeePosition}
//                   onChange={handleInputChange}
//                   className={`w-full px-4 py-3 border rounded-xl ${
//                     errors.committeePosition
//                       ? "border-red-300 bg-red-50"
//                       : "border-gray-300"
//                   }`}
//                 />
//                 {errors.committeePosition && (
//                   <p className="mt-1 text-sm text-red-600">
//                     {errors.committeePosition}
//                   </p>
//                 )}
//               </div>
//             )}

//             {formData.role === "technician" && (
//               <div>
//                 <label className="block text-sm">Specialization *</label>
//                 <input
//                   type="text"
//                   name="specialization"
//                   value={formData.specialization}
//                   onChange={handleInputChange}
//                   className={`w-full px-4 py-3 border rounded-xl ${
//                     errors.specialization
//                       ? "border-red-300 bg-red-50"
//                       : "border-gray-300"
//                   }`}
//                 />
//                 {errors.specialization && (
//                   <p className="mt-1 text-sm text-red-600">
//                     {errors.specialization}
//                   </p>
//                 )}
//               </div>
//             )}

//             {/* Passwords */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm">Password *</label>
//                 <input
//                   type="password"
//                   name="password"
//                   value={formData.password}
//                   onChange={handleInputChange}
//                   className={`w-full px-4 py-3 border rounded-xl ${
//                     errors.password
//                       ? "border-red-300 bg-red-50"
//                       : "border-gray-300"
//                   }`}
//                 />
//                 {errors.password && (
//                   <p className="mt-1 text-sm text-red-600">
//                     {errors.password}
//                   </p>
//                 )}
//               </div>
//               <div>
//                 <label className="block text-sm">Confirm Password *</label>
//                 <input
//                   type="password"
//                   name="confirmPassword"
//                   value={formData.confirmPassword}
//                   onChange={handleInputChange}
//                   className={`w-full px-4 py-3 border rounded-xl ${
//                     errors.confirmPassword
//                       ? "border-red-300 bg-red-50"
//                       : "border-gray-300"
//                   }`}
//                 />
//                 {errors.confirmPassword && (
//                   <p className="mt-1 text-sm text-red-600">
//                     {errors.confirmPassword}
//                   </p>
//                 )}
//               </div>
//             </div>

//             {/* Submit */}
//             <button
//               type="submit"
//               disabled={isSubmitting}
//               className="w-full py-3 px-4 rounded-xl font-semibold text-white bg-gradient-to-r from-green-600 to-emerald-600"
//             >
//               {isSubmitting ? "Creating Account..." : "Create Account"}
//             </button>
//           </form>

//           {/* Google Sign-in */}
//           <div className="mt-6">
//             <button
//               onClick={handleGoogleSignIn}
//               className="w-full py-3 px-4 rounded-xl font-semibold text-white bg-red-500 hover:bg-red-600"
//             >
//               Sign in with Google
//             </button>
//           </div>

//           {/* Login Link */}
//           <div className="mt-6 text-center">
//             <p className="text-gray-600">
//               Already have an account?{" "}
//               <Link
//                 to="/login"
//                 className="text-green-600 hover:text-green-700 font-medium"
//               >
//                 Sign in here
//               </Link>
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   const handleShowRoleModal = () => setShowRoleModal(true);
//   const handleCloseRoleModal = () => setShowRoleModal(false);

//   return (
//     <>
//       <RoleSelectionModal
//         show={showRoleModal}
//         handleClose={handleCloseRoleModal}
//         formData={formData}
//         setFormData={setFormData}
//       />
//       <form onSubmit={handleSubmit}>
//         {{ ... }}
//       </form>
//     </>
//   );
// }

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
// import { doc, setDoc } from "firebase/firestore";
import { auth, googleProvider } from "../config/firebaseConfig";
import api from "../api/apiClients";

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    role: "resident",
    phone: "",
    building: "",
    unit: "",
    specialization: [],
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // ------------------ VALIDATION ------------------
  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";

    if (!formData.lastName.trim())
      newErrors.lastName = "Last name is required";

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Username is optional, but if provided, must be at least 3 characters
    if (formData.username.trim() && formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password =
        "Password must contain uppercase, lowercase, and a number";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";

    // Role-specific validation
    if (formData.role === "resident") {
      if (!formData.building.trim())
        newErrors.building = "Building is required";
      if (!formData.unit.trim()) newErrors.unit = "Unit number is required";
    }

    if (formData.role === "technician") {
      if (!formData.specialization || formData.specialization.length === 0)
        newErrors.specialization = "At least one specialization is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ------------------ HANDLERS ------------------
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
    
    setFormData(prev => ({
      ...prev,
      specialization: checked 
        ? [...prev.specialization, value]
        : prev.specialization.filter(s => s !== value)
    }));
    
    if (errors.specialization) {
      setErrors(prev => ({ ...prev, specialization: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;
    
      // Sync user to MongoDB
      await api.post("/users/sync", {
        profile: {
          username: formData.username,
          role: formData.role,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          building: formData.role === "resident" ? formData.building : "",
          unit: formData.role === "resident" ? formData.unit : "",
          specialization: formData.role === "technician" ? formData.specialization : []
        }
      });
    
      const { data: me } = await api.get("/users/me");
      console.log("Backend /users/me:", me);
      
      // Redirect based on role from MongoDB
      if (me.role === "committee") {
        navigate("/committee");
      } else if (me.role === "technician") {
        navigate("/technician");
      } else {
        navigate("/resident");
      }
    } catch (error) {
      console.error("Registration error:", error);
      setErrors({ general: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    // Validate form first (except password fields)
    const newErrors = {};

    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";

    if (!formData.lastName.trim())
      newErrors.lastName = "Last name is required";

    if (!formData.phone.trim())
      newErrors.phone = "Phone number is required";

    // Role-specific validation
    if (formData.role === "resident") {
      if (!formData.building.trim())
        newErrors.building = "Building is required";
      if (!formData.unit.trim())
        newErrors.unit = "Unit number is required";
    }

    if (formData.role === "technician") {
      if (!formData.specialization || formData.specialization.length === 0)
        newErrors.specialization = "At least one specialization is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
    
      // Sync user to MongoDB with form data
      await api.post("/users/sync", {
        profile: {
          username: formData.username || user.displayName?.split(" ")[0] || "user" + user.uid.slice(0, 6),
          role: formData.role,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          building: formData.role === "resident" ? formData.building : "",
          unit: formData.role === "resident" ? formData.unit : "",
          specialization: formData.role === "technician" ? formData.specialization : []
        }
      });
  
      const { data: me } = await api.get("/users/me");
      console.log("Backend /users/me:", me);
      
      // Redirect based on role from MongoDB
      if (me.role === "committee") {
        navigate("/committee");
      } else if (me.role === "technician") {
        navigate("/technician");
      } else {
        navigate("/resident");
      }
    } catch (error) {
      console.error("Google sign-in error:", error);
      setErrors({ general: error.message || "Google sign-in failed. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  // ------------------ UI ------------------
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-8 py-6 text-white text-center">
          <h1 className="text-3xl font-bold mb-2">CitizenConnect</h1>
          <p className="text-green-100">Join our community today</p>
        </div>

        {/* Form */}
        <div className="px-8 py-8">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
            Create Your Account
          </h2>

          {errors.general && (
            <p className="mb-4 text-center text-red-600">{errors.general}</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name *
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-xl ${
                    errors.firstName
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300"
                  }`}
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.firstName}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name *
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-xl ${
                    errors.lastName
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300"
                  }`}
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.lastName}
                  </p>
                )}
              </div>
            </div>

            {/* Email / Phone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-xl ${
                    errors.email ? "border-red-300 bg-red-50" : "border-gray-300"
                  }`}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-xl ${
                    errors.phone ? "border-red-300 bg-red-50" : "border-gray-300"
                  }`}
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                )}
              </div>
            </div>

            {/* Username + Role */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="Optional (auto-generated if empty)"
                  className={`w-full px-4 py-3 border rounded-xl ${
                    errors.username
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300"
                  }`}
                />
                {errors.username && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.username}
                  </p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Leave empty to auto-generate from your name
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Role *
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border rounded-xl border-gray-300"
                >
                  <option value="resident">🏠 Resident</option>
                  <option value="committee">👥 Committee Member</option>
                  <option value="technician">🔧 Technician</option>
                </select>
              </div>
            </div>

            {/* Role-Specific Fields */}
            {formData.role === "resident" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm">Building *</label>
                  <input
                    type="text"
                    name="building"
                    value={formData.building}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-xl ${
                      errors.building
                        ? "border-red-300 bg-red-50"
                        : "border-gray-300"
                    }`}
                  />
                  {errors.building && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.building}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm">Unit *</label>
                  <input
                    type="text"
                    name="unit"
                    value={formData.unit}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-xl ${
                      errors.unit
                        ? "border-red-300 bg-red-50"
                        : "border-gray-300"
                    }`}
                  />
                  {errors.unit && (
                    <p className="mt-1 text-sm text-red-600">{errors.unit}</p>
                  )}
                </div>
              </div>
            )}


            {/* Specialization Field - Only for Technicians */}
            {formData.role === "technician" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Specializations * (Select all that apply)
                </label>
                <div className="grid grid-cols-2 gap-3 p-4 border border-gray-300 rounded-xl">
                  {[
                    "plumbing", "electrical", "hvac", "carpentry", 
                    "painting", "flooring", "roofing", "appliance", 
                    "security", "landscaping", "general", "other"
                  ].map(spec => (
                    <label key={spec} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
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
              </div>
            )}

            {/* Passwords */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm">Password *</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-xl ${
                    errors.password
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300"
                  }`}
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.password}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm">Confirm Password *</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-xl ${
                    errors.confirmPassword
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300"
                  }`}
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-xl font-semibold text-white bg-gradient-to-r from-green-600 to-emerald-600"
            >
              {isSubmitting ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          {/* Google Sign-in */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or register with</span>
              </div>
            </div>
            <button
              onClick={handleGoogleSignIn}
              disabled={isSubmitting}
              className="mt-4 w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-gray-300 bg-white text-gray-700 font-medium hover:bg-gray-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <img
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                alt="Google"
                className="h-5 w-5"
              />
              {isSubmitting ? "Processing..." : "Register with Google"}
            </button>
            <p className="mt-2 text-xs text-center text-gray-500">
              Fill in your details above, then click to register with Google
            </p>
          </div>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-green-600 hover:text-green-700 font-medium"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}