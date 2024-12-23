import { useForm, SubmitHandler } from "react-hook-form";
import "./login.css";
import { useState } from "react";
import { useLoginUserMutation } from "../../redux/api/authApi";
import { verifyToken } from "../../utils/verifyToken";
import { useAppDispatch } from "../../redux/feature/hooks";
import { setUser, TUser } from "../../redux/feature/auth/authSlice";

// Define the form data interface
interface FormData {
  email: string;
  password: string;
  remember: boolean;
}

const Login = () => {
  // Initialize useForm hook
  const dispatch = useAppDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const [showPassword, setShowPassword] = useState(false);
  const [loginUser, { isLoading, error }] = useLoginUserMutation();

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  // Handle form submission
  const onSubmit: SubmitHandler<FormData> = async (data) => {
    const res = await loginUser(data);
    console.log(res?.data?.data);

    const user = verifyToken(res?.data?.data?.accessToken) as TUser;
    dispatch(setUser({ user: user, token: res?.data?.data?.accessToken }));
  };

  return (
    <div className="card flex justify-center items-center min-h-screen">
      <div className="wrapper">
        <form onSubmit={handleSubmit(onSubmit)}>
          <h2>Login</h2>

          {/* Email Field */}
          <div className="input-field">
            <input
              type="text"
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
            {error?.data?.message && (
              <span className="text-white">{error?.data?.message}</span>
            )}
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
          <button type="submit">Log In</button>

          {/* Register Link */}
          <div className="register">
            <p>
              Don't have an account? <a href="/register">Register</a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
