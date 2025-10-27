import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux';
import { Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../features/useAuth';
import { setAuth, setLoading } from '../redux/slices/authlSlice';
import App from '../App';
import Login from '../pages/login';

const AuthProtected = () => {
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
        } else {
            dispatch(setLoading(false));
        }
    }, [dispatch]);

    useEffect(() => {
        if (!isAuthenticated){
            navigate('/login')
        };
    }, [])

    return (
        <App/>
    )
}

export default AuthProtected