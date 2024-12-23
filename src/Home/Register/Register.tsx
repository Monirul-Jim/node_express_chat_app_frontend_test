import { useForm, SubmitHandler } from "react-hook-form";
import "../Login/login.css";
import { useState } from "react";
import { useRegisterUserMutation } from "../../redux/api/authApi";
import { useNavigate } from "react-router-dom";

// Define the form data interface
interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

const Register = () => {
  const navigate = useNavigate();
  // Initialize useForm hook
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const [showPassword, setShowPassword] = useState(false);
  const [registerUser, { isLoading }] = useRegisterUserMutation();

  // Password visibility toggle
  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  // Handle form submission
  const onSubmit: SubmitHandler<FormData> = async (data) => {
    await registerUser(data);
    navigate("/");
  };

  return (
    <div className="wrapper">
      <form onSubmit={handleSubmit(onSubmit)}>
        <h2>Register</h2>

        {/* First Name Field */}
        <div className="input-field">
          <input
            type="text"
            {...register("firstName", { required: "First name is required" })}
          />
          <label>Enter your first name</label>

          {errors.firstName && (
            <span className="error">{errors.firstName.message}</span>
          )}
        </div>

        {/* Last Name Field */}
        <div className="input-field">
          <input
            type="text"
            {...register("lastName", { required: "Last name is required" })}
          />
          <label>Enter your last name</label>
          {errors.lastName && (
            <span className="error">{errors.lastName.message}</span>
          )}
        </div>

        {/* Email Field */}
        <div className="input-field">
          <input
            type="email"
            {...register("email", { required: "Email is required" })}
          />

          <label>Enter your email</label>

          {errors.email && (
            <span className="error">{errors.email.message}</span>
          )}
        </div>

        {/* Password Field */}
        <div className="input-field">
          <input
            type={showPassword ? "text" : "password"}
            {...register("password", { required: "Password is required" })}
          />
          <label>Enter your password</label>

          {errors.password && (
            <span className="error">{errors.password.message}</span>
          )}
        </div>

        {/* Remember Me Checkbox */}
        <div className="forget">
          <label>
            <input
              type="checkbox"
              id="remember"
              onClick={togglePasswordVisibility}
            />
            <p> {showPassword ? "Hide" : "Show"} Password</p>
          </label>
        </div>

        {/* Submit Button */}
        <button type="submit">
          {isLoading ? "Submitting..." : "Register"}
        </button>

        {/* Login Link */}
        <div className="register">
          <p>
            Already have an account? <a href="/">Login</a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Register;
