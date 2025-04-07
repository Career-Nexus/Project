
import { useState } from "react"
import { authService } from "../../api/ApiServiceThree"
import OtpVerification from "./OtpTwo"
import { LoadingIcon } from "../../icons/icon"
// import { authService } from "../services/apiServices"
// import OtpVerification from "./OtpVerification"

const SignupTwo = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password1: "",
        password2: "",
    })
    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(false)
    const [showOtpModal, setShowOtpModal] = useState(false)
    const [signupEmail, setSignupEmail] = useState("")

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: value })

        // Clear error when user types
        if (errors[name]) {
            setErrors({ ...errors, [name]: "" })
        }
    }

    const validateForm = () => {
        const newErrors = {}

        if (!formData.name.trim()) {
            newErrors.name = "Full name is required"
        }
        if (!formData.email.trim()) {
            newErrors.email = "Email is required"
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Email is invalid"
        }

        if (!formData.password1) {
            newErrors.password1 = "Password is required"
        } else if (formData.password1.length < 6) {
            newErrors.password1 = "Password must be at least 6 characters"
        }

        if (formData.password1 !== formData.password2) {
            newErrors.password2 = "Passwords do not match"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    // Update the handleSubmit function to work with the single endpoint flow
    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!validateForm()) return

        setLoading(true)
        try {
            // Send signup request to initiate registration and get OTP
            await authService.signup({
                name: formData.name,
                email: formData.email,
                password1: formData.password1,
                password2: formData.password2,
            })

            // Store email for OTP verification
            setSignupEmail(formData.email)

            // Show OTP modal
            setShowOtpModal(true)
        } catch (error) {
            if (error.errors) {
                setErrors(error.errors)
            } else {
                setErrors({ general: error.message || "An error occurred during signup" })
            }
        } finally {
            setLoading(false)
        }
    }

    const handleOtpSuccess = () => {
        // Redirect to login or dashboard after successful verification
        window.location.href = "/login"
    }

    const handleCloseOtpModal = () => {
        setShowOtpModal(false)
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Create your account</h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Or{" "}
                        <a href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                            sign in to your account
                        </a>
                    </p>
                </div>

                {errors.general && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                        <span className="block sm:inline">{errors.general}</span>
                    </div>
                )}

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">

                        <div>
                            <label htmlFor="name" className="sr-only">
                                Full Name
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                value={formData.name}
                                onChange={handleChange}
                                className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${errors.name ? "border-red-300" : "border-gray-300"
                                    } placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                                placeholder="Full name"
                            />
                            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                        </div>


                        <div>
                            <label htmlFor="email" className="sr-only">
                                Email address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                value={formData.email}
                                onChange={handleChange}
                                className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${errors.email ? "border-red-300" : "border-gray-300"
                                    } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                                placeholder="Email address"
                            />
                            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                        </div>

                        <div>
                            <label htmlFor="password" className="sr-only">
                                Password
                            </label>
                            <input
                                id="password1"
                                name="password1"
                                type="password"
                                autoComplete="new-password"
                                value={formData.password1}
                                onChange={handleChange}
                                className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${errors.password1 ? "border-red-300" : "border-gray-300"
                                    } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                                placeholder="Password"
                            />
                            {errors.password1 && <p className="text-red-500 text-xs mt-1">{errors.password1}</p>}
                        </div>

                        <div>
                            <label htmlFor="password2" className="sr-only">
                                Confirm Password
                            </label>
                            <input
                                id="password2"
                                name="password2"
                                type="password"
                                autoComplete="new-password"
                                value={formData.password2}
                                onChange={handleChange}
                                className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${errors.password2 ? "border-red-300" : "border-gray-300"
                                    } placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                                placeholder="Confirm Password"
                            />
                            {errors.password2 && <p className="text-red-500 text-xs mt-1">{errors.password2}</p>}
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${loading ? "opacity-70 cursor-not-allowed" : ""
                                }`}
                        >
                            {loading ? (
                                <span className="flex items-center">
                                    <LoadingIcon/>
                                    {/* <svg
                                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                                    </svg> */}
                                    Processing...
                                </span>
                            ) : (
                                "Sign up"
                            )}
                        </button>
                    </div>
                </form>
            </div>

            {showOtpModal && (
                <OtpVerification email={signupEmail} onSuccess={handleOtpSuccess} onClose={handleCloseOtpModal} />
            )}
        </div>
    )
}

export default SignupTwo

