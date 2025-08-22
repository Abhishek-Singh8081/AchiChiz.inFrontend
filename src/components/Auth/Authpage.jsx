import React, { useState, useEffect, useContext } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { toast } from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import OTPPage from "./OtpPage";
import { AuthContext, useAuth } from "../../context/AuthContext";
import { auth } from "../../data/allapi";

const PasswordInput = ({ name, value, onChange, placeholder, show, setShow }) => (
  <div className="relative">
    <input
      type={show ? "text" : "password"}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full px-4 py-2 border border-gray-300"
      required
    />
    <div
      className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
      onClick={() => setShow(!show)}
    >
      {show ? <FiEyeOff /> : <FiEye />}
    </div>
  </div>
);

const AuthPage = ({ onSuccess }) => {
  const location = useLocation();
  const { login } = useAuth();
  const { settoken } = useContext(AuthContext);
  const navigate = useNavigate();

  const emailFromQuery = new URLSearchParams(location.search).get("email") || "";

  const [mode, setMode] = useState("login"); // login | signup | forgot
  const [step, setStep] = useState("form"); // form | otp | reset
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpEmail, setOtpEmail] = useState("");
  const [otpCode, setOtpCode] = useState(""); // <--- store OTP here for reset

  // Forgot Password Modal state & email input
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const isSignup = mode === "signup";

  useEffect(() => {
    if (emailFromQuery) {
      setForm((prev) => ({ ...prev, email: emailFromQuery }));
      setMode("signup");
      setStep("form");
    }
  }, [emailFromQuery]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const sendOtp = async () => {
    if (!form.email) return toast.error("Please enter your email");
    try {
      await fetch("https://reqres.in/api/send-otp", {
        method: "POST",
        body: JSON.stringify({ email: form.email }),
        headers: { "Content-Type": "application/json" },
      });
      toast.success("OTP sent to your email!");
      setOtpEmail(form.email);
      setShowOtpModal(true);
    } catch (err) {
      toast.error("Failed to send OTP");
    }
  };

  // OTP verify for signup and login
  const handleOtpVerify = async (otp) => {
    try {
      await fetch(auth.VERIFY_OTP, {
        method: "POST",
        body: JSON.stringify({ otp }),
        headers: { "Content-Type": "application/json" },
      });

      toast.success("OTP verified!");
      setShowOtpModal(false);

      if (mode === "signup") {
        localStorage.setItem("user", JSON.stringify({ name: form.name || "User" }));
        login(form.name || "User");
        onSuccess?.();
        resetAll();
      }
    } catch (err) {
      toast.error("Invalid OTP");
    }
  };

  // OTP verify for forgot password flow
const handleForgotOtpVerify = async (otp) => {
  console.log("Verifying OTP for reset:", otp); // <-- ADD THIS
  try {
    const res = await fetch(auth.FORGOT_OTP_VERIFY, {
      method: "POST",
      body: JSON.stringify({ otp }),
      headers: { "Content-Type": "application/json" },
    });

    toast.success("OTP verified!");
    setShowOtpModal(false);
    setOtpCode(otp); // Save OTP for reset password step
    setStep("reset");
  } catch (err) {
    toast.error("Invalid OTP");
  }
};


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      return toast.error("Email and password are required");
    }

    if (mode === "signup") {
      if (!form.name || !form.confirmPassword) return toast.error("Please fill all fields");
      if (form.password !== form.confirmPassword) return toast.error("Passwords do not match");

      try {
        const res = await fetch(auth.SIGNUP_BY_EMAIL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...form, accountType: "User" }),
        });

        const data = await res.json();

        if (res.ok) {
          setOtpEmail(form.email);
          setShowOtpModal(true);
          navigate("/authpage")
        } else {
          toast.error(data.message || "Signup failed");
          navigate("/notfound");
        }
      } catch (err) {
        toast.error("An error occurred during signup");
        navigate("/notfound");
      }
    } else if (mode === "login") {
      try {
        const res = await fetch(auth.LOGIN_BY_EMAIL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: form.email, password: form.password }),
        });

        const { data } = await res.json();
        const { token, user } = data || {};

        if (res.ok) {
          settoken(token);
          login(user?.name || "User");
          toast.success("Login successful!");
          onSuccess?.();
          resetAll();
        } else {
          toast.error("Login failed");
        }
      } catch (err) {
        toast.error("An error occurred during login");
      }
    } else if (mode === "forgot") {
      sendOtp();
    }
  };

const handleResetPassword = async (e) => {
  e.preventDefault();
  if (!form.password || !form.confirmPassword) return toast.error("Fill both fields");
  if (form.password !== form.confirmPassword) return toast.error("Passwords do not match");

  console.log("Reset Password Payload:", {
    email: forgotEmail,
    otp: otpCode,
    password: form.password,
    confirmPassword: form.confirmPassword,
  }); // <-- ADDED LOG HERE

  try {
    const res = await fetch(auth.RESET_PASSWORD, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: forgotEmail,
        otp: otpCode, // Use saved OTP here
        password: form.password,
        confirmPassword: form.confirmPassword,
      }),
    });

    const data = await res.json();

    console.log("Reset Password Response:", data); // <-- ADDED LOG HERE

    if (res.ok) {
      toast.success(data.message || "Password reset successful!");
      resetAll();
      setMode("login");
      setStep("form");
    } else {
      toast.error(data.message || "Password reset failed");
    }
  } catch (error) {
    toast.error("An error occurred during password reset");
  }
};

  const resetAll = () => {
    setMode("login");
    setStep("form");
    setShowOtpModal(false);
    setShowForgotModal(false);
    setForm({ name: "", email: "", password: "", confirmPassword: "" });
    setForgotEmail("");
    setOtpCode("");
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const handleGoogleLogin = () => {
    login("Google User");
    localStorage.setItem("user", JSON.stringify({ name: "Google User" }));
    toast.success("Google login successful!");
    onSuccess?.();
  };

  // Send OTP for forgot password modal
  const handleForgotSendOtp = async () => {
    if (!forgotEmail) return toast.error("Please enter your email");
    try {
      await fetch(auth.FORGOT_PASSWORD, {
        method: "POST",
        body: JSON.stringify({ email: forgotEmail }),
        headers: { "Content-Type": "application/json" },
      });
      toast.success("OTP sent to your email!");
      setOtpEmail(forgotEmail);
      setShowOtpModal(true);
      setShowForgotModal(false);
      setMode("forgot");
      setStep("otp");
    } catch (err) {
      toast.error("Failed to send OTP");
    }
  };

  const title =
    mode === "signup"
      ? "SIGN UP"
      : mode === "forgot" && step === "reset"
      ? "RESET PASSWORD"
      : mode === "forgot"
      ? "FORGOT PASSWORD"
      : "SIGN IN";

  return (
    <div className="p-6 w-full max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4 text-center">{title}</h2>

      {step === "reset" ? (
        <form onSubmit={handleResetPassword} className="space-y-4">
          <PasswordInput
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="New Password*"
            show={showPassword}
            setShow={setShowPassword}
          />
          <PasswordInput
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm Password*"
            show={showConfirmPassword}
            setShow={setShowConfirmPassword}
          />
          <button className="w-full bg-orange-600 text-white py-2 rounded" type="submit">
            RESET PASSWORD
          </button>
        </form>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignup && (
            <input
              type="text"
              name="name"
              placeholder="Name*"
              value={form.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border"
              required
            />
          )}

          <input
            type="email"
            name="email"
            placeholder="Email*"
            value={form.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border"
            required
          />

          {(mode === "signup" || mode === "login") && (
            <PasswordInput
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Password*"
              show={showPassword}
              setShow={setShowPassword}
            />
          )}

          {isSignup && (
            <PasswordInput
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm Password*"
              show={showConfirmPassword}
              setShow={setShowConfirmPassword}
            />
          )}

          <button
            type="submit"
            className="w-full bg-orange-600 hover:bg-orange-700 text-white py-2 rounded"
          >
            {mode === "signup" ? "SIGN UP" : mode === "forgot" ? "SEND OTP" : "SIGN IN"}
          </button>

          {mode !== "forgot" && (
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
            >
              {mode === "signup" ? "Sign up with Google" : "Sign in with Google"}
            </button>
          )}
        </form>
      )}

      {mode === "login" && (
        <p className="text-center mt-3">
          <button
            onClick={() => {
              setForgotEmail(form.email || "");
              setShowForgotModal(true);
            }}
            className="text-sm text-orange-700 underline"
          >
            Forgot Password?
          </button>
        </p>
      )}

      <p className="text-center text-sm mt-4">
        {mode === "signup" ? (
          <>
            Already have an account?{" "}
            <button onClick={() => setMode("login")} className="text-orange-700 underline">
              Sign in
            </button>
          </>
        ) : (
          <>
            Don’t have an account?{" "}
            <button onClick={() => setMode("signup")} className="text-orange-700 underline">
              Sign up
            </button>
          </>
        )}
      </p>

      {showOtpModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 relative w-full max-w-md">
            <button
              onClick={() => setShowOtpModal(false)}
              className="absolute top-2 right-3 text-gray-500 hover:text-black text-2xl"
            >
              ×
            </button>
            {/* Pass correct onVerify handler based on mode */}
            <OTPPage
              email={otpEmail}
              onVerify={mode === "forgot" ? handleForgotOtpVerify : handleOtpVerify}
              onResend={mode === "forgot" ? handleForgotSendOtp : sendOtp}
            />
          </div>
        </div>
      )}

      {showForgotModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 relative w-full max-w-sm">
            <button
              onClick={() => setShowForgotModal(false)}
              className="absolute top-2 right-3 text-gray-500 hover:text-black text-2xl"
            >
              ×
            </button>
            <h3 className="text-lg font-semibold mb-4 text-center">Forgot Password</h3>
            <input
              type="email"
              placeholder="Enter your email"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              className="w-full px-4 py-2 border mb-4"
              required
            />
            <button
              onClick={handleForgotSendOtp}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white py-2 rounded"
            >
              Send OTP
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthPage;
