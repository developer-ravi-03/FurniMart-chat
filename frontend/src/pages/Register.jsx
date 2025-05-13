/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useContext } from "react";
import {
  Eye,
  EyeOff,
  UserPlus,
  CheckCircle,
  AlertCircle,
  UserRound,
  Mail,
  Lock,
  Users,
} from "lucide-react";
import { UserContext } from "../context/UserContext"; // Adjust path as needed
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
  // Get auth context functions
  const { register, isLoading, error, setError } = useContext(UserContext);

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
  const [formErrors, setFormErrors] = useState({});
  const [registrationStatus, setRegistrationStatus] = useState({
    success: false,
    message: "",
    showStatus: false,
  });
  const [isAnimating, setIsAnimating] = useState(true);
  const [formTouched, setFormTouched] = useState({
    name: false,
    email: false,
    password: false,
    confirmPassword: false,
  });

  // Trigger animation on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Update registration status if there's an error from context
  useEffect(() => {
    if (error) {
      setRegistrationStatus({
        success: false,
        message: error,
        showStatus: true,
      });
    }
  }, [error]);

  // Reset error from context when form changes
  useEffect(() => {
    if (error) {
      setError("");
    }
  }, [formData, error, setError]);

  // Live validation when fields are touched
  useEffect(() => {
    if (Object.values(formTouched).some((field) => field === true)) {
      validateForm(false);
    }
  }, [formData, formTouched]);

  const validateForm = (isSubmitting = true) => {
    const errors = {};

    // Only validate fields that are touched or if we're submitting
    if (isSubmitting || formTouched.name) {
      if (!formData.name.trim()) errors.name = "Name is required";
    }

    if (isSubmitting || formTouched.email) {
      if (!formData.email.trim()) {
        errors.email = "Email is required";
      } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
        errors.email = "Please enter a valid email";
      }
    }

    if (isSubmitting || formTouched.password) {
      if (!formData.password) {
        errors.password = "Password is required";
      } else if (formData.password.length < 6) {
        errors.password = "Password must be at least 6 characters";
      }
    }

    if (isSubmitting || formTouched.confirmPassword) {
      if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = "Passwords do not match";
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Mark field as touched
    if (!formTouched[name]) {
      setFormTouched({
        ...formTouched,
        [name]: true,
      });
    }
  };

  const handleBlur = (field) => {
    setFormTouched({
      ...formTouched,
      [field]: true,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // First validate the form
    if (!validateForm()) {
      return;
    }

    // Clear any previous status messages
    setRegistrationStatus({
      success: false,
      message: "",
      showStatus: false,
    });

    // Call register function from context
    const result = await register({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role,
      navigate,
    });

    if (result?.success) {
      setRegistrationStatus({
        success: true,
        message: "Registration successful! Redirecting to dashboard...",
        showStatus: true,
      });

      // Reset form after successful registration
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      // Redirect will happen automatically if your context sets isAuth to true
    }
  };

  // Password strength indicator
  const getPasswordStrength = () => {
    const { password } = formData;
    if (!password) return { strength: 0, label: "" };

    if (password.length < 6) return { strength: 1, label: "Weak" };
    if (password.length < 8) return { strength: 2, label: "Fair" };

    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const score = [hasUppercase, hasLowercase, hasNumbers, hasSpecial].filter(
      Boolean
    ).length;

    if (password.length >= 8 && score >= 3)
      return { strength: 4, label: "Strong" };
    if (password.length >= 8 && score >= 2)
      return { strength: 3, label: "Good" };

    return { strength: 2, label: "Fair" };
  };

  const passwordStrength = getPasswordStrength();

  // Colors for password strength
  const strengthColors = [
    "",
    "bg-red-500",
    "bg-yellow-500",
    "bg-blue-500",
    "bg-green-500",
  ];

  const strengthLabels = [
    "",
    "text-red-600",
    "text-yellow-600",
    "text-blue-600",
    "text-green-600",
  ];

  // Close status message
  const dismissStatus = () => {
    setRegistrationStatus({
      ...registrationStatus,
      showStatus: false,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div
        className={`max-w-md w-full bg-white rounded-xl shadow-xl overflow-hidden transform transition-all duration-500 ${
          isAnimating ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
        }`}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 py-6 px-6">
          <h2 className="text-white text-2xl font-bold flex items-center">
            <UserPlus className="mr-2" size={24} />
            Create Account
          </h2>
          <p className="text-blue-100 mt-1">Join our community today</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {registrationStatus.showStatus && (
            <div
              className={`mb-6 p-3 rounded-lg flex items-center justify-between text-sm ${
                registrationStatus.success
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}
            >
              <div className="flex items-center">
                {registrationStatus.success ? (
                  <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                ) : (
                  <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                )}
                {registrationStatus.message}
              </div>
              <button
                type="button"
                onClick={dismissStatus}
                className="text-gray-500 hover:text-gray-700"
              >
                &times;
              </button>
            </div>
          )}

          <div className="space-y-5">
            {/* Name Field */}
            <div className="space-y-1">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <UserRound size={18} />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  onBlur={() => handleBlur("name")}
                  className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:outline-none transition-all ${
                    formErrors.name
                      ? "border-red-300 focus:ring-red-200"
                      : "border-gray-300 focus:ring-blue-200 focus:border-blue-400"
                  }`}
                  placeholder="Enter your name"
                />
              </div>
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
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Mail size={18} />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={() => handleBlur("email")}
                  className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:outline-none transition-all ${
                    formErrors.email
                      ? "border-red-300 focus:ring-red-200"
                      : "border-gray-300 focus:ring-blue-200 focus:border-blue-400"
                  }`}
                  placeholder="your.email@example.com"
                />
              </div>
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
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Lock size={18} />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={() => handleBlur("password")}
                  className={`w-full pl-10 pr-10 py-2 border rounded-lg focus:ring-2 focus:outline-none transition-all ${
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
              {formData.password && (
                <div className="mt-2">
                  <div className="flex items-center space-x-2">
                    <div className="h-1 flex-1 flex space-x-1">
                      {[1, 2, 3, 4].map((index) => (
                        <div
                          key={index}
                          className={`h-full rounded-full flex-1 ${
                            index <= passwordStrength.strength
                              ? strengthColors[passwordStrength.strength]
                              : "bg-gray-200"
                          }`}
                        ></div>
                      ))}
                    </div>
                    {passwordStrength.label && (
                      <span
                        className={`text-xs font-medium ${
                          strengthLabels[passwordStrength.strength]
                        }`}
                      >
                        {passwordStrength.label}
                      </span>
                    )}
                  </div>
                </div>
              )}
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
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Lock size={18} />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onBlur={() => handleBlur("confirmPassword")}
                  className={`w-full pl-10 pr-10 py-2 border rounded-lg focus:ring-2 focus:outline-none transition-all ${
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
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 flex items-center">
                <Users size={18} className="mr-1" />
                Account Type
              </label>
              <div className="grid grid-cols-3 gap-3 mt-1">
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
                  <div className="text-xs text-gray-500">Help users</div>
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
                  <div className="text-xs text-gray-500">Full access</div>
                </div>
              </div>
            </div>

            {/* Terms & Conditions (optional) */}
            <div className="flex items-start mt-4">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="terms" className="text-gray-600">
                  I agree to the{" "}
                  <a href="/terms" className="text-blue-600 hover:underline">
                    Terms and Conditions
                  </a>{" "}
                  and{" "}
                  <a href="/privacy" className="text-blue-600 hover:underline">
                    Privacy Policy
                  </a>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-all transform hover:scale-[1.02] active:scale-[0.98] ${
                isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-indigo-700 hover:shadow-md"
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
                  Creating Account...
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
        </form>
      </div>
    </div>
  );
}
