import { useContext, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPath";

export const useUserAuth = () => {
    const { user, updateUser, clearUser } = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        if(user) return; // User already present


        let isMounted = true;
        const fetchUserInfo = async () => {
            try {
                const response = await axiosInstance.get(API_PATHS.AUTH.GET_USER_INFO);
                console.log("response in new" ,response);
                
                if (isMounted && response.data) {
                    updateUser(response.data);
                }
            } catch (error) {
                console.error("Failed to fetch user info ", error);
                if (isMounted) {
                    clearUser();
                    navigate("/login");
                }
            }
        };
        fetchUserInfo();
        return () => {
            isMounted = false;
        };
    }, [updateUser, clearUser, navigate]);
};