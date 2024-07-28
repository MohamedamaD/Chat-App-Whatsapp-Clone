import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  targetUser: { _id: null },
  imagePreview: null,
  videoPreview: null,
  chatPreviewIsOpen: false,
  connection: null,
  messages: [{}],
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    startChat: (state, action) => {
      state.targetUser = action.payload.user;
    },
    endChat: (state) => {
      state.targetUser = { _id: null };
    },
    setConnection: (state, action) => {
      state.connection = action.payload;
    },
    createChatMessage: async (state, action) => {
      state.connection.emit("create-message", action.payload);
      state.connection.on("messages", (data) => {});
    },

    setImagePreview: (state, action) => {
      state.imagePreview = action.payload;
      state.chatPreviewIsOpen = true;
    },
    setVideoPreview: (state, action) => {
      state.videoPreview = action.payload;
      state.chatPreviewIsOpen = true;
    },
    clearPreview: (state) => {
      state.imagePreview = state.videoPreview = null;
      state.chatPreviewIsOpen = false;
    },
  },
});

export const {
  startChat,
  endChat,
  setConnection,
  setImagePreview,
  setVideoPreview,
  clearPreview,
  createChatMessage,
} = chatSlice.actions;
export default chatSlice.reducer;
