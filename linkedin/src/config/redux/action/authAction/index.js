import { createAsyncThunk } from "@reduxjs/toolkit";
import { clientServer } from "../../../index.jsx";

// LOGIN
export const loginUser = createAsyncThunk(
  "/user/login",
  async (userData, thunkAPI) => {
    try {
      const response = await clientServer.post("/login", {
        email: userData.email,
        password: userData.password,
      });

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        return thunkAPI.fulfillWithValue(response.data);
      }

      return thunkAPI.rejectWithValue("Login failed: No token received");
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Login failed"
      );
    }
  }
);

// REGISTER
export const registerUser = createAsyncThunk(
  "/user/register",
  async (userData, thunkAPI) => {
    try {
      const response = await clientServer.post("/register", {
        name: userData.name,
        email: userData.email,
        password: userData.password,
        username: userData.username,
      });

      // If response exists, registration is successful
      if (response.data) {
        return thunkAPI.fulfillWithValue(response.data);
      }

      return thunkAPI.rejectWithValue("Registration failed");
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Registration failed"
      );
    }
  }
);