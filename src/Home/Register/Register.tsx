
import { useForm, SubmitHandler } from "react-hook-form";
import "../Login/login.css";
import { useState } from "react";
import { useRegisterUserMutation } from "../../redux/api/authApi";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

// Define the form data interface
interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

type ErrorData = {
  message?: string;
  errorSources?: { path: string; message: string }[];
};

const Register = () => {
  // Initialize useForm hook
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const [showPassword, setShowPassword] = useState(false);
  const [registerUser, { isLoading, error, isSuccess }] =
    useRegisterUserMutation();

  // Password visibility toggle
  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  // Handle form submission
  const onSubmit: SubmitHandler<FormData> = async (data) => {
    await registerUser(data);
  };

  // Type guards
  function isFetchBaseQueryError(error: unknown): error is FetchBaseQueryError {
    return typeof error === "object" && error !== null && "data" in error;
  }

  function hasErrorData(data: unknown): data is ErrorData {
    return typeof data === "object" && data !== null;
  }

  return (
    <div className="card flex justify-center items-center min-h-screen">
      <div className="wrapper">
        <form onSubmit={handleSubmit(onSubmit)}>
          <h2>Register</h2>

          {/* ✅ Error Messages */}
          {isFetchBaseQueryError(error) && hasErrorData(error.data) && (
            <div className="text-white">
              {/* Show top-level error */}
              {error.data.message && <p>{error.data.message}</p>}

              {/* Show field-specific errors */}
              {error.data.errorSources &&
                error.data.errorSources.map((err, idx) => (
                  <p key={idx}>
                    {err.path}: {err.message}
                  </p>
                ))}
            </div>
          )}

          {/* ✅ Success Message */}
          {isSuccess && (
            <span className="text-white">
              Your registration is successful, please login
            </span>
          )}

          {/* First Name Field */}
          <div className="input-field">
            <input
              type="text"
              {...register("firstName", { required: "First name is required" })}
            />
            <label>Enter your first name</label>
            {errors.firstName && (
              <span className="text-white">{errors.firstName.message}</span>
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
              <span className="text-white">{errors.lastName.message}</span>
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
              <span className="text-white">{errors.email.message}</span>
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
              <span className="text-white">{errors.password.message}</span>
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
              <p>{showPassword ? "Hide" : "Show"} Password</p>
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
    </div>
  );
};

export default Register;


// import { useForm, SubmitHandler } from "react-hook-form";
// import "../Login/login.css";
// import { useState } from "react";
// import { useRegisterUserMutation } from "../../redux/api/authApi";
// import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

// // Define the form data interface
// interface FormData {
//   firstName: string;
//   lastName: string;
//   email: string;
//   password: string;
// }
// type ErrorData = {
//   message?: string;
// };
// const Register = () => {
//   // Initialize useForm hook
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm<FormData>();
//   const [showPassword, setShowPassword] = useState(false);
//   const [registerUser, { isLoading, error, isSuccess }] =
//     useRegisterUserMutation();

//   // Password visibility toggle
//   const togglePasswordVisibility = () => {
//     setShowPassword((prevState) => !prevState);
//   };

//   // Handle form submission
//   const onSubmit: SubmitHandler<FormData> = async (data) => {
//     await registerUser(data);
//   };
//   function isFetchBaseQueryError(error: unknown): error is FetchBaseQueryError {
//     return typeof error === "object" && error !== null && "data" in error;
//   }

//   function hasMessage(data: unknown): data is ErrorData {
//     return (
//       typeof data === "object" &&
//       data !== null &&
//       "message" in data &&
//       typeof (data as ErrorData).message === "string"
//     );
//   }

//   return (
//     <div className="card flex justify-center items-center min-h-screen">
//       <div className="wrapper">
//         <form onSubmit={handleSubmit(onSubmit)}>
//           <h2>Register</h2>
//           {isFetchBaseQueryError(error) && hasMessage(error.data) && (
//             <span className="text-white">{error.data.message}</span>
//           )}
//           {isSuccess && (
//             <span className="text-white">
//               Your registration is successful , please login
//             </span>
//           )}
//           {/* First Name Field */}
//           <div className="input-field">
//             <input
//               type="text"
//               {...register("firstName", { required: "First name is required" })}
//             />
//             <label>Enter your first name</label>

//             {errors.firstName && (
//               <span className="text-white">{errors.firstName.message}</span>
//             )}
//           </div>

//           {/* Last Name Field */}
//           <div className="input-field">
//             <input
//               type="text"
//               {...register("lastName", { required: "Last name is required" })}
//             />
//             <label>Enter your last name</label>
//             {errors.lastName && (
//               <span className="text-white">{errors.lastName.message}</span>
//             )}
//           </div>

//           {/* Email Field */}
//           <div className="input-field">
//             <input
//               type="email"
//               {...register("email", { required: "Email is required" })}
//             />

//             <label>Enter your email</label>

//             {errors.email && (
//               <span className="text-white">{errors.email.message}</span>
//             )}
//           </div>

//           {/* Password Field */}
//           <div className="input-field">
//             <input
//               type={showPassword ? "text" : "password"}
//               {...register("password", { required: "Password is required" })}
//             />
//             <label>Enter your password</label>

//             {errors.password && (
//               <span className="text-white">{errors.password.message}</span>
//             )}
//           </div>

//           {/* Remember Me Checkbox */}
//           <div className="forget">
//             <label>
//               <input
//                 type="checkbox"
//                 id="remember"
//                 onClick={togglePasswordVisibility}
//               />
//               <p> {showPassword ? "Hide" : "Show"} Password</p>
//             </label>
//           </div>

//           {/* Submit Button */}
//           <button type="submit">
//             {isLoading ? "Submitting..." : "Register"}
//           </button>

//           {/* Login Link */}
//           <div className="register">
//             <p>
//               Already have an account? <a href="/">Login</a>
//             </p>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Register;
