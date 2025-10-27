import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setAuth, setLoading } from "./redux/slices/authlSlice";
import { useAuth } from "./features/useAuth";
import Login from "./pages/login";
import ChatLayout from "./pages/layout/ChatLayout";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const userId = localStorage.getItem("userId");
    const userData = localStorage.getItem("user");

    if (token && userId && userData) {
      dispatch(
        setAuth({
          authToken: token,
          userId: userId,
          user: JSON.parse(userData),
        })
      );
    } else {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  const AppContent = () => {
    const { isAuthenticated, loading } = useAuth();
  
    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="flex flex-col items-center gap-6">
            <div className="w-16 h-16 border-4 border-gray-300 border-t-gray-900 rounded-full animate-spin"></div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Initializing...</h3>
              <p className="text-gray-500 text-sm">Preparing your workspace</p>
            </div>
          </div>
        </div>
      );
    }
  
    return isAuthenticated ? <ChatLayout /> : <Login />;
  };

  return (
    <div className="min-h-screen">
      <AppContent/>
    </div>
  );
}

export default App;
