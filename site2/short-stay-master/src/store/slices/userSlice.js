import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  profile: {},
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    resetUser: () => initialState,
    setUserProfile: (state, action) => {
      state.profile = action.payload;
    },
  },
});
export const { resetUser, setUserProfile } = userSlice.actions;
export default userSlice.reducer;
