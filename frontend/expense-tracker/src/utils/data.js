import{
    LuLayoutDashboard,
    LuHandCoins,
    LuWalletMinimal,
    LuMessagesSquare,
    LuSparkles,
    LuLogOut,
    LuUser
} from "react-icons/lu";

export const SIDE_MENU_DATA =[
    {
        id: "00",
        label:"Dashboad",
        icon: LuLayoutDashboard,
        path:"/dashboard",
    },
    {
        id: "01",
        label:"Income",
        icon: LuWalletMinimal,
        path:"/income",
    },
    {
        id: "02",
        label:"Expenses",
        icon: LuHandCoins,
        path:"/expenses",
    },

    {
        id: "03",
        label:"Insights",
        icon: LuSparkles,
        path:"/insights"
    },

    {
        id: "04",
        label:"ChatBot",
        icon: LuMessagesSquare ,
        path:"/chatbot"
    },
    {
        id: "05",
        label: "Profile",
        icon: LuUser, // Replace with a user icon if available
        path: "/profile",
    },
    {
        id: "06",
        label:"Logout",
        icon: LuLogOut,
        path:"logout"
    }
];