import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  loginAdmin,
  fetchMe,
  logout as logoutAction,
  selectAuth,
} from "../store/authSlice.js";

export function useAuth() {
  const dispatch = useDispatch();
  const { admin, token, loading, error } = useSelector(selectAuth);

  const login = useCallback(
    async (username, password) => {
      const result = await dispatch(loginAdmin({ username, password }));
      if (loginAdmin.rejected.match(result)) {
        throw new Error(result.payload || "Login failed.");
      }
      return result.payload.admin;
    },
    [dispatch]
  );

  const logout = useCallback(() => {
    dispatch(logoutAction());
  }, [dispatch]);

  const bootstrap = useCallback(() => {
    if (token) dispatch(fetchMe());
  }, [dispatch, token]);

  return { admin, token, loading, error, login, logout, bootstrap };
}
