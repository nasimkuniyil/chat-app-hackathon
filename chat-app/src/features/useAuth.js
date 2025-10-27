import { useSelector, useDispatch } from "react-redux";
import { setAuth, clearAuth, setLoading } from "../redux/slices/authlSlice";

export const useAuth = () => {
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);

  const login = (authData) => {
    dispatch(setAuth(authData));
  };

  const logout = () => {
    dispatch(clearAuth());
  };

  return {
    ...authState,
    login,
    logout,
  };
};
