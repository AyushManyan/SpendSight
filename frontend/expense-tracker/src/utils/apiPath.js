export const BASE_URL = "http://localhost:8000/";
// export const BASE_URL = "https://spensight.vercel.app/";


//  utils/apiPath.js

export const API_PATHS = {
    AUTH:{
        LOGIN: "api/v1/auth/login",
        REGISTER: "api/v1/auth/register",
        GET_USER_INFO: "api/v1/auth/getUser"
    },
    DASHBOARD:{
        GET_DATA: "api/v1/dashboard" 
    },
    INCOME:{
        ADD_INCOME: "api/v1/income/add",
        GET_ALL_INCOME: "api/v1/income/get",
        DELETE_INCOME: (id) => `api/v1/income/${id}`,
        DOWNLOAD_INCOME: "api/v1/income/downloadexcel"
    },
    EXPENSE:{
        ADD_EXPENSE: "api/v1/expense/add",
        GET_ALL_EXPENSE: "api/v1/expense/get",
        DELETE_EXPENSE:(expenseId) => `api/v1/expense/${expenseId}`,
        DOWNLOAD_EXPENSE: "api/v1/expense/downloadexcel",
        SCAN_EXPENSE_BILL: "api/v1/bill/scan"
    },
    IMAGE:{
        UPLOAD_IMAGE: "api/v1/auth/upload-image"
    },

    OTP:{
        SEND_OTP: "api/v1/opt/send-otp",
        VERIFY_OTP: "api/v1/opt/verify-otp"
    },

    INSIGHTS:{
        GET_INSIGHTS: "api/v1/insight"
    }
};