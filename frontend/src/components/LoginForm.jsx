// import { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";

// export default function LoginForm() {
//   const [formData, setFormData] = useState({
//     username: "",
//     password: "",
//     role: "resident"
//   });
//   const [errors, setErrors] = useState({});
//   const [isLoading, setIsLoading] = useState(false);
//   const navigate = useNavigate();

//   const validateForm = () => {
//     const newErrors = {};
//     if (!formData.username.trim()) {
//       newErrors.username = "Username is required";
//     } else if (formData.username.length < 3) {
//       newErrors.username = "Username must be at least 3 characters";
//     }
    
//     if (!formData.password) {
//       newErrors.password = "Password is required";
//     } else if (formData.password.length < 6) {
//       newErrors.password = "Password must be at least 6 characters";
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

//   const handleLogin = async (e) => {
//     e.preventDefault();
    
//     if (!validateForm()) return;
    
//     setIsLoading(true);
    
//     // Simulate API call
//     setTimeout(() => {
//       setIsLoading(false);
//       if (formData.role === "resident") navigate("/resident");
//       if (formData.role === "committee") navigate("/committee");
//       if (formData.role === "technician") navigate("/technician");
//     }, 1000);
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
//       <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
//         {/* Header */}
//         <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6 text-white text-center">
//           <h1 className="text-3xl font-bold mb-2">CitizenConnect</h1>
//           <p className="text-blue-100">Community Issue Management System</p>
//         </div>
        
//         {/* Form */}
//         <div className="px-8 py-8">
//           <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Welcome Back</h2>
          
//           <form onSubmit={handleLogin} className="space-y-6">
//             {/* Username Field */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Username
//               </label>
//               <input
//                 type="text"
//                 name="username"
//                 placeholder="Enter your username"
//                 className={`w-full px-4 py-3 border rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
//                   errors.username ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
//                 }`}
//                 value={formData.username}
//                 onChange={handleInputChange}
//               />
//               {errors.username && (
//                 <p className="mt-1 text-sm text-red-600">{errors.username}</p>
//               )}
//             </div>

//             {/* Password Field */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Password
//               </label>
//               <input
//                 type="password"
//                 name="password"
//                 placeholder="Enter your password"
//                 className={`w-full px-4 py-3 border rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
//                   errors.password ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
//                 }`}
//                 value={formData.password}
//                 onChange={handleInputChange}
//               />
//               {errors.password && (
//                 <p className="mt-1 text-sm text-red-600">{errors.password}</p>
//               )}
//             </div>

//             {/* Role Selection */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Select Your Role
//               </label>
//               <div className="grid grid-cols-3 gap-3">
//                 {["resident", "committee", "technician"].map((role) => (
//                   <button
//                     key={role}
//                     type="button"
//                     onClick={() => handleInputChange({ target: { name: 'role', value: role } })}
//                     className={`p-3 rounded-xl border-2 transition-all duration-200 text-center ${
//                       formData.role === role
//                         ? 'border-blue-500 bg-blue-50 text-blue-700'
//                         : 'border-gray-200 hover:border-gray-300 text-gray-600 hover:text-gray-800'
//                     }`}
//                   >
//                     <div className="text-2xl mb-1">{getRoleIcon(role)}</div>
//                     <div className="text-sm font-medium capitalize">{role}</div>
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* Login Button */}
//             <button
//               type="submit"
//               disabled={isLoading}
//               className={`w-full py-3 px-4 rounded-xl font-semibold text-white transition-all duration-200 ${
//                 isLoading
//                   ? 'bg-gray-400 cursor-not-allowed'
//                   : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transform hover:scale-[1.02] active:scale-[0.98]'
//               }`}
//             >
//               {isLoading ? (
//                 <div className="flex items-center justify-center">
//                   <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
//                   Signing In...
//                 </div>
//               ) : (
//                 'Sign In'
//               )}
//             </button>
//           </form>

//           {/* Demo Info */}
//           <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
//             <p className="text-sm text-blue-800 text-center">
//               <strong>Demo Mode:</strong> Any username/password will work. 
//               Select your role to explore different dashboards.
//             </p>
//           </div>

//           {/* Register Link */}
//           <div className="mt-4 text-center">
//             <p className="text-gray-600">
//               Don't have an account?{" "}
//               <Link to="/register" className="text-blue-600 hover:text-blue-700 font-medium">
//                 Register here
//               </Link>
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


// updaated code with firebase integration

// src/components/LoginForm.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
// import { doc, getDoc } from "firebase/firestore";
import { auth, googleProvider } from "../config/firebaseConfig";
import api from "../api/apiClients";
import { dashboardPath } from "../context/AuthContext";

export default function LoginForm() {
  const [formData, setFormData] = useState({
    email: "",   // ✅ Use email instead of username for Firebase login
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const redirectByRole = (role) => {
    navigate(dashboardPath(role));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
  
    setIsLoading(true);
  
    try {
      console.log("Attempting login with:", formData.email);
      const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;
      console.log("Firebase login successful:", user.uid);
    
      const { data: me } = await api.get("/users/me");
      console.log("Backend /users/me response:", me);
      
      if (!me || !me.role) {
        console.error("User not found in MongoDB or missing role");
        setErrors({ email: "User profile not found. Please register first." });
        return;
      }

      redirectByRole(me.role);
    } catch (error) {
      console.error("Login error details:", error);
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        setErrors({ email: "Invalid email or password." });
      } else if (error.response?.status === 401) {
        setErrors({ email: "Authentication failed. Please try again." });
      } else {
        setErrors({ email: "Login failed. Please try again." });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
  
      // Check if user already exists in MongoDB
      const { data: existingUser } = await api.get("/users/me").catch(() => ({ data: null }));
      
      if (existingUser && existingUser.profile) {
        console.log("Existing user found:", existingUser);
        redirectByRole(existingUser.role);
      } else {
        // New user - redirect to registration page
        // Sign out first so they can register properly
        await auth.signOut();
        setErrors({ email: "No account found. Please register first." });
        setTimeout(() => {
          navigate("/register");
        }, 2000);
      }
    } catch (error) {
      console.error("Google login error:", error);
      setErrors({ email: "Google sign-in failed. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6 text-white text-center">
            <h1 className="text-3xl font-bold mb-2">CitizenConnect</h1>
            <p className="text-blue-100">Community Issue Management System</p>
          </div>

        {/* Form */}
        <div className="px-8 py-8">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Welcome Back</h2>

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                className={`w-full px-4 py-3 border rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.email ? "border-red-300 bg-red-50" : "border-gray-300 hover:border-gray-400"
                }`}
                value={formData.email}
                onChange={handleInputChange}
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <Link 
                  to="/forgot-password" 
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Forgot Password?
                </Link>
              </div>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                className={`w-full px-4 py-3 border rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.password ? "border-red-300 bg-red-50" : "border-gray-300 hover:border-gray-400"
                }`}
                value={formData.password}
                onChange={handleInputChange}
              />
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-xl font-semibold text-white transition-all duration-200 ${
                isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transform hover:scale-[1.02] active:scale-[0.98]"
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Signing In...
                </div>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Google Sign-In */}
          <div className="mt-4">
            <button
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-gray-300 bg-white text-gray-700 font-medium hover:bg-gray-50 transition-all duration-200"
            >
              <img
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                alt="Google"
                className="h-5 w-5"
              />
              Sign in with Google
            </button>
          </div>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don&apos;t have an account?{" "}
              <Link to="/register" className="text-blue-600 hover:text-blue-700 font-medium">
                Register here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
