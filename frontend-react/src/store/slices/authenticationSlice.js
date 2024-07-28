import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";
import { UploadFile } from "../../services/cloudinary";

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  message: "",
  status: "idle",
  sendMail: false,
  error: "",
};

// define async thunks
export const signOut = createAsyncThunk("authentication/signOut", async () => {
  try {
    const response = await api.get("api/v1/users/logout");
    return response.data;
  } catch (error) {
    if (!error.response) {
      throw error;
    }

    return error.response.data;
  }
});

export const login = createAsyncThunk(
  "authentication/login",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await api.post("api/v1/users/email", payload);

      return response.data;
    } catch (error) {
      if (!error.response) {
        throw error;
      }
      console.log(error);

      return rejectWithValue(error.response.data);
    }
  }
);

export const confirmPassword = createAsyncThunk(
  "authentication/confirmPassword",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await api.post("api/v1/users/password", payload, {
        withCredentials: true,
      });

      return response.data;
    } catch (error) {
      if (!error.response) {
        throw error;
      }
      console.log(error);

      return rejectWithValue(error.response.data);
    }
  }
);
export const forgotPassword = createAsyncThunk(
  "authentication/forgotPassword",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await api.post("api/v1/users/forgot-password", payload, {
        withCredentials: true,
      });

      return response.data;
    } catch (error) {
      if (!error.response) {
        throw error;
      }
      console.log(error);

      return rejectWithValue(error.response.data);
    }
  }
);

export const protectedData = createAsyncThunk(
  "authentication/protectedData",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("api/v1/users/user/protected");

      return response.data;
    } catch (error) {
      if (!error.response) {
        throw error;
      }
      console.log(error);

      return rejectWithValue(error.response.data);
    }
  }
);

export const register = createAsyncThunk(
  "authentication/register",
  async (payload, { rejectWithValue }) => {
    try {
      const { url } = await UploadFile(payload.avatar);

      const response = await api.post(`api/v1/users/register`, {
        ...payload,
        avatar: url,
      });
      return response.data;
    } catch (error) {
      if (!error.response) {
        throw error;
      }
      return rejectWithValue(error.response.data);
    }
  }
);

export const editUserDetails = createAsyncThunk(
  "authentication/editUserDetails",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await api.put(`api/v1/users/user`, payload);
      return response.data;
    } catch (error) {
      if (!error.response) {
        throw error;
      }
      return rejectWithValue(error.response.data);
    }
  }
);

const authenticationSlice = createSlice({
  name: "authentication",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    resetSendMail: (state) => {
      state.sendMail = false;
    },
  },
  extraReducers: (builder) =>
    builder
      .addCase(signOut.fulfilled, (state, action) => {
        state.user = null;
        state.loading = false;
        state.isAuthenticated = false;
        state.message = action.payload.message;
      })
      .addCase(login.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        console.log(action);
        state.loading = false;
        // state.user = action.payload.data.user;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.message = action.error.message || "invalid login";
        console.log(action);
      })

      .addCase(confirmPassword.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(confirmPassword.fulfilled, (state, action) => {
        console.log(action);
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.data.user;
      })
      .addCase(confirmPassword.rejected, (state, action) => {
        state.loading = false;
        state.message = action.error.message || "invalid login";
        console.log(action);
      })
      .addCase(forgotPassword.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        console.log(action);
        state.loading = false;
        state.sendMail = action.payload.sendMail;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.message = action.error.message || "invalid login";
        state.sendMail = false;
        console.log(action);
      })

      .addCase(protectedData.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(protectedData.fulfilled, (state, action) => {
        // console.log(action);
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
      })
      .addCase(protectedData.rejected, (state, action) => {
        state.loading = false;
        state.message = action.error.message || "invalid login";
        state.isAuthenticated = false;
        console.log(action);
      })

      .addCase(editUserDetails.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(editUserDetails.fulfilled, (state, action) => {
        console.log(action);
        state.loading = false;
        state.user = action.payload.data.user;
        state.message = action.payload.message;
      })
      .addCase(editUserDetails.rejected, (state, action) => {
        state.loading = false;
        state.message = action.error.message || "try again";
        console.log(action);
      })

      .addCase(register.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        console.log(action);
        state.loading = false;
        state.isAuthenticated = true;
        state.message = action.payload.message;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action?.payload?.message ||
          action?.error?.message ||
          "invalid registration";
        state.isAuthenticated = false;

        console.log(action);
      }),
});

export const { setUser, clearUser, setLoading, resetSendMail } =
  authenticationSlice.actions;
export default authenticationSlice.reducer;
