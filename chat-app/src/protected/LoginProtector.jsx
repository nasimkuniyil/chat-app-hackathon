import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setAuth, setLoading } from '../redux/slices/authlSlice';
import Login from '../pages/login';
import { useAuth } from '../features/useAuth';

const LoginProtector = () => {
     const dispatch = useDispatch();

    const { isAuthenticated, loading } = useAuth();
    const navigate = useNavigate();

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
            navigate('/')
        } else {
            dispatch(setLoading(false));
        }
    }, [dispatch]);

  return (
    <div><Login/></div>
  )
}

export default LoginProtector