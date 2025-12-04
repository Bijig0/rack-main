import { setTheme, toggleTheme } from "../slices/themeSlice";

export const setLightTheme = () => (dispatch, getState) => {
  if (getState().theme.theme !== "light") {
    dispatch(setTheme("light"));
  }
};

export const setDarkTheme = () => (dispatch, getState) => {
  if (getState().theme.theme !== "dark") {
    dispatch(setTheme("dark"));
  }
};

export const toggleAppTheme = () => (dispatch) => {
  dispatch(toggleTheme());
};