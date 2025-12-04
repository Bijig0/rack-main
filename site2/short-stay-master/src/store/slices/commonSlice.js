import { createSlice } from '@reduxjs/toolkit';
const initialState = {
    loader: false,
    toastInfo: {},
};
export const commonSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        showLoaderAction: (state) => {
            state.loader = true;
        },
        hideLoaderAction: (state) => {
            state.loader = false;
        },
        showToastAction: (state, action) => {
            state.toastInfo = action.payload;
        },
    },
});
export const { showLoaderAction, hideLoaderAction, showToastAction } = commonSlice.actions;
export default commonSlice.reducer;
