import { useState, useEffect } from "react";
import { Eye, EyeOff, UserPlus, CheckCircle, AlertCircle } from "lucide-react";

export default function RegisterPage() {
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [role, setRole] = useState("customer");

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [registrationStatus, setRegistrationStatus] = useState({
    success: false,
    message: "",
  });
  const [isAnimating, setIsAnimating] = useState(true);

  // Trigger animation on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  //this is for validating the form
  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) errors.name = "Name is required";

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      errors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || "Registration failed");
      }

      // Success
      setRegistrationStatus({
        success: true,
        message: "Registration successful! Redirecting to login...",
      });

      // Clear form
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      // Simulate redirect after success
      setTimeout(() => {
        // Redirect logic would go here (e.g., using React Router)
        console.log("Would redirect to login page");
      }, 2000);
    } catch (error) {
      setRegistrationStatus({
        success: false,
        message: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div
        className={`max-w-md w-full bg-white rounded-xl shadow-xl overflow-hidden transform transition-all duration-500 ${
          isAnimating ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
        }`}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 py-6 px-6">
          <h2 className="text-white text-2xl font-bold flex items-center">
            <UserPlus className="mr-2" size={24} />
            Create Account
          </h2>
          <p className="text-blue-100 mt-1">Join our community today</p>
        </div>

        {/* Form */}
        <div className="p-6">
          {registrationStatus.message && (
            <div
              className={`mb-4 p-3 rounded-lg flex items-center text-sm ${
                registrationStatus.success
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}
            >
              {registrationStatus.success ? (
                <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0" />
              ) : (
                <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
              )}
              {registrationStatus.message}
            </div>
          )}

          <div className="space-y-4">
            {/* Name Field */}
            <div className="space-y-1">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:outline-none transition-all ${
                  formErrors.name
                    ? "border-red-300 focus:ring-red-200"
                    : "border-gray-300 focus:ring-blue-200 focus:border-blue-400"
                }`}
                placeholder="Enter your name"
              />
              {formErrors.name && (
                <p className="text-red-600 text-xs mt-1">{formErrors.name}</p>
              )}
            </div>

            {/* Email Field */}
            <div className="space-y-1">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:outline-none transition-all ${
                  formErrors.email
                    ? "border-red-300 focus:ring-red-200"
                    : "border-gray-300 focus:ring-blue-200 focus:border-blue-400"
                }`}
                placeholder="your.email@example.com"
              />
              {formErrors.email && (
                <p className="text-red-600 text-xs mt-1">{formErrors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:outline-none transition-all ${
                    formErrors.password
                      ? "border-red-300 focus:ring-red-200"
                      : "border-gray-300 focus:ring-blue-200 focus:border-blue-400"
                  }`}
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {formErrors.password && (
                <p className="text-red-600 text-xs mt-1">
                  {formErrors.password}
                </p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-1">
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:outline-none transition-all ${
                    formErrors.confirmPassword
                      ? "border-red-300 focus:ring-red-200"
                      : "border-gray-300 focus:ring-blue-200 focus:border-blue-400"
                  }`}
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
              {formErrors.confirmPassword && (
                <p className="text-red-600 text-xs mt-1">
                  {formErrors.confirmPassword}
                </p>
              )}
            </div>

            {/* Role Selection */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Account Type
              </label>
              <div className="grid grid-cols-2 gap-3 mt-1">
                <div
                  className={`border rounded-lg p-3 cursor-pointer transition-all ${
                    role === "customer"
                      ? "bg-blue-50 border-blue-400 ring-2 ring-blue-200"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                  onClick={() => setRole("customer")}
                >
                  <div className="font-medium text-gray-900">Customer</div>
                  <div className="text-xs text-gray-500">Shop products</div>
                </div>
                <div
                  className={`border rounded-lg p-3 cursor-pointer transition-all ${
                    role === "support"
                      ? "bg-blue-50 border-blue-400 ring-2 ring-blue-200"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                  onClick={() => setRole("support")}
                >
                  <div className="font-medium text-gray-900">Support</div>
                  <div className="text-xs text-gray-500">Support Team</div>
                </div>

                <div
                  className={`border rounded-lg p-3 cursor-pointer transition-all ${
                    role === "admin"
                      ? "bg-blue-50 border-blue-400 ring-2 ring-blue-200"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                  onClick={() => setRole("admin")}
                >
                  <div className="font-medium text-gray-900">Admin</div>
                  <div className="text-xs text-gray-500">Admin</div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className={`w-full py-2 px-4 rounded-lg text-white font-medium transition-all transform hover:scale-[1.02] active:scale-[0.98] ${
                isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-500 to-indigo-600 hover:shadow-md"
              }`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                "Create Account"
              )}
            </button>

            {/* Login Link */}
            <div className="text-center mt-4 text-sm text-gray-600">
              Already have an account?{" "}
              <a
                href="/login"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Sign in
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
