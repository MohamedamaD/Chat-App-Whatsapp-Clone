import { createSlice } from "@reduxjs/toolkit";

export const asideOptions = {
  profile: "profile",
  users: "users",
  groups: "groups",
  createGroup: "createGroup",
  groupInfo: "groupInfo",
  status: "status",
};

const initialState = {
  theme: "light",
  aside: asideOptions.users,
  connection: null,
  group: null,
  myStatus: [ ],
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
    setAside: (state, action) => {
      state.aside = action.payload;
    },
    setConnection: (state, action) => {
      state.connection = action.payload;
    },
    setGroup: (state, action) => {
      console.log(action.payload);
      state.group = action.payload;
    },
  },
});

export const { setTheme, setAside, setConnection, setGroup } = appSlice.actions;
export default appSlice.reducer;
