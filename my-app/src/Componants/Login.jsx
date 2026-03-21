 import React, {useState } from "react";
 import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {

  const [isLogin, setIsLogin] = useState(true);

  const [formData, setFormData] = useState({
    Fullname: "",
    Username: "",
    Email: "",
    Password: "",
    ConfirmPassword: "",
  });
   
const navigate=useNavigate()
  const handleChange = (e) => {
    
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleSubmit = async (e) => {
e.preventDefault(); 
    try {
      const url = isLogin
        ?  `${import.meta.env.VITE_API_URL}/login`
        :  `${import.meta.env.VITE_API_URL}/signup`;

      const res = await axios.post(url, formData);
      console.log(res.data);
      alert("Success ✅");

        if (isLogin) {
      // 🔹 Save token and user details
      console.log(res.data)
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.user.id)
      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("username",res.data.user.Username)
      navigate("/home")
    } else {
      alert("Signup Successful ✅, now login");
      setIsLogin(true);
    }
    } catch (err) {
      console.log(err);
      alert("Error ❌");
    }
    
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-96">

        <h2 className="text-2xl font-bold text-center mb-6 text-black">
          {isLogin ? "Login" : "Signup"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          {!isLogin && (
            <input
              type="text"
              name="Fullname"
              placeholder="Full Name"
              value={formData.Fullname}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-lg text-black"
            />
          )}

          <input
            type="text"
            name="Username"
            placeholder="Username"
            value={formData.Username}
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 rounded-lg text-black"
          />

          {!isLogin && (
            <input
              type="email"
              name="Email"
              placeholder="Email"
              value={formData.Email}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-lg text-black"
            />
          )}

          <input
            type="password"
            name="Password"
            placeholder="Password"
            value={formData.Password}
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 rounded-lg text-black"
          />

          {!isLogin && (
            <input
              type="password"
              name="ConfirmPassword"
              placeholder="Confirm Password"
              value={formData.ConfirmPassword}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-lg text-black"
            />
          )}

          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded-lg hover:opacity-90"
          >
            {isLogin ? "Login" : "Signup"}
          </button>

        </form>

        <p className="text-center mt-5 text-sm text-black">
          {isLogin
            ? "Don't have an account?"
            : "Already have an account?"}

          <span
            className="ml-2 font-semibold cursor-pointer"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Signup" : "Login"}
          </span>
        </p>

      </div>
    </div>
  );
}

export default Login;