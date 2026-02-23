import{
    LuLayoutDashboard,
    LuHandCoins,
    LuWalletMinimal,
    LuMessagesSquare,
    LuSparkles,
    LuLogOut,
} from "react-icons/lu";

export const SIDE_MENU_DATA =[
    {
        id: "01",
        label:"Dashboad",
        icon: LuLayoutDashboard,
        path:"/dashboard",
    },
    {
        id: "02",
        label:"Income",
        icon: LuWalletMinimal,
        path:"/income",
    },
    {
        id: "03",
        label:"Expenses",
        icon: LuHandCoins,
        path:"/expenses",
    },

    {
        id: "04",
        label:"Insights",
        icon: LuSparkles,
        path:"/insights"
    },

    {
        id: "05",
        label:"ChatBot",
        icon: LuMessagesSquare ,
        path:"/chatbot"
    },

    {
        id: "06",
        label:"Logout",
        icon: LuLogOut,
        path:"logout"
    }
];