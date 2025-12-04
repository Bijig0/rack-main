export const login = (token,next) => {
  try {
    if (token) {
    localStorage.setItem("appToken",JSON.stringify(token))
    }
    next()
  } catch (error) {
    console.log(error);
    return false;
  }
};
export const isAuthenticated = () => {
  try {
    if (typeof window == "undefined") {
      return false;
    }
    if (localStorage.getItem("appToken")) {
      return JSON.parse(localStorage.getItem("appToken"));
    } else if (sessionStorage.getItem("appToken")) {
      return JSON.parse(sessionStorage.getItem("appToken"));
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const authenticate = (appToken, rememberMe, next) => {;
  
  if (typeof window !== "undefined") {
    appToken = JSON.stringify(appToken);
    if (rememberMe) {
      localStorage.setItem("appToken", appToken);
    } else {
      sessionStorage.setItem("appToken", appToken);
    }
    next();
  }
};

export const logout = (next) => {
  if (typeof window !== "undefined") {
    localStorage.clear();
    sessionStorage.clear();
    if (next) {
      next();
    }
  }
};
