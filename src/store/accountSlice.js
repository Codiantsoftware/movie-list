import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userDetails: {},
  isRememberMe: null,
};

export const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    setUserDetails: (state, action) => ({
      ...state,
      userDetails: action.payload,
    }),
    setIsRememberMe: (state, action) => {
      state.isRememberMe = action.payload;
    },
    setResetUserDetails: (state) => ({
      ...state,
      userDetails: {},
    }),
  },
});

export const { setUserDetails, setIsRememberMe, setResetUserDetails } =
  accountSlice.actions;
export const accountReducer = accountSlice.reducer;
