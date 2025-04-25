import {BrowserRouter as Router, Route, Routes, useLocation} from "react-router-dom";
import {lazy, Suspense, useCallback, useContext, useEffect} from "react";
import {adminAxios, baseAxios} from "./config/axiosConfig.jsx";
import {ThemeContext, ThemeProvider} from "./context/ThemeContext";
import {SidebarProvider} from "./context/SidebarContext";
import {DARK_THEME} from "./constants/themeConstants";
import {Box, CircularProgress} from "@mui/material";
import UnauthorizedDialog from "./components/shared/UnauthorizedDialog";

const Signup = lazy(() => import("./components/signup/signup.jsx"));
const Login = lazy(() => import("./components/login/login.jsx"));
const Profile = lazy(() => import("./components/profile/profile.jsx"));
const ProfileShow = lazy(() => import("./components/profileshow/profileshow.jsx"));
const Search = lazy(() => import("./components/search/search.jsx"));
const Suggestions = lazy(() => import("./components/suggestions/suggestions.jsx"));
const Like = lazy(() => import("./components/like/like.jsx"));
const Home = lazy(() => import("./components/home/home.jsx"));
const Visit = lazy(() => import("./components/visit/visit.jsx"));
const ForgotPassword = lazy(() => import("./components/forgotpassword/forgotpassword.jsx"));
const Chat = lazy(() => import("./components/chat/chat.jsx"));
const EditProfile = lazy(() => import("./components/signup/edit-profile.jsx"));
const PaymentSuccess = lazy(() => import("./components/shared/paymentsuccess.jsx"));
const BaseLayout = lazy(() => import("./layout/BaseLayout.jsx"));
const MainLayout = lazy(() => import("./layout/MainLayout.jsx"));
const OtherLayout = lazy(() => import("./layout/OtherLayout.jsx"));
const Dashboard = lazy(() => import("./screens/dashboard/DashboardScreen.jsx"));
const PageNotFound = lazy(() => import("./screens/error/PageNotFound.jsx"));
const User = lazy(() => import("./components/admin/user/user.jsx"));
const Interest = lazy(() => import("./components/admin/interest/interest.jsx"));
const InterestQuestion = lazy(() => import("./components/admin/interestquestion/interestquestion.jsx"));
const AdminLogin = lazy(() => import("./components/admin/login/login.jsx"));
const LoadingFallback = () => (
    <Box
        sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            background: 'rgba(255, 255, 255, 0.7)'
        }}
    >
        <CircularProgress color="secondary"/>
    </Box>
);

function App() {
    return (
        <ThemeProvider>
            <SidebarProvider>
                <Router>
                    <AppRoutes/>
                </Router>
            </SidebarProvider>
        </ThemeProvider>
    );
}

const hideNavRoutes = ["/editProfile"];
const hideNavRoutes2 = ["/", "/profile", "/chat", "/suggestion", "/visits", "/search", "/likes"];
const hideNavRoutes3 = ["/admin/questioninterest", "/admin/interest", "/admin/user", "/admin"];

function AppRoutes() {
    const {theme} = useContext(ThemeContext);
    const location = useLocation();

    useEffect(() => {
        const root = document.getElementById("root");
        if (hideNavRoutes.includes(location.pathname)) {
            root.style.background = 'url("/stardot.jpg")';
        } else if (location.pathname === "/login/admin") {
            root.style.background = 'rgb(64,60,84)';
        }
    }, [location.pathname]);

    const checkToken = useCallback(() => {
        baseAxios
            .get("/checkToken")
            .then((res) => {
                if (res.data !== "Token Expired") {
                    localStorage.setItem("token", res.data);
                }
            })
            .catch((err) => {
                if (err.response?.status === 400) {
                    console.log(err.respone.data);
                }
            });
    }, []);

    const checkAdminToken = useCallback(() => {
        adminAxios
            .get("/checkToken")
            .then((res) => {
                if (res.data !== "Token Expired") {
                    localStorage.setItem("token", res.data);
                }
            })
            .catch((err) => {
                if (err.response?.status === 400) {
                    console.log(err.respone.data);
                }
            });
    }, []);

    useEffect(() => {
        if (hideNavRoutes2.includes(location.pathname)) {
            checkToken();
        }
        if (hideNavRoutes3.includes(location.pathname)) {
            checkAdminToken();
        }
    }, [location.pathname, checkToken, checkAdminToken]);

    useEffect(() => {
        document.body.classList.toggle("dark-mode", theme === DARK_THEME);
    }, [theme]);

    return (
        <Suspense fallback={<LoadingFallback/>}>
            {/*<UnauthorizedDialog />*/}

            <Routes>
                <Route element={
                    <Suspense fallback={<LoadingFallback/>}>
                        <BaseLayout />
                    </Suspense>
                }>
                    <Route path="/admin" element={
                        <Suspense fallback={<LoadingFallback/>}>
                            <Dashboard />
                        </Suspense>
                    }/>
                    <Route path="/admin/user" element={
                        <Suspense fallback={<LoadingFallback/>}>
                            <User/>
                        </Suspense>
                    }/>
                    <Route path="/admin/interest" element={
                        <Suspense fallback={<LoadingFallback/>}>
                            <Interest/>
                        </Suspense>
                    }/>
                    <Route path="/admin/questioninterest" element={
                        <Suspense fallback={<LoadingFallback/>}>
                            <InterestQuestion/>
                        </Suspense>
                    }/>
                </Route>

                <Route element={
                    <Suspense fallback={<LoadingFallback/>}>
                        <MainLayout/>
                    </Suspense>
                }>
                    <Route path="/" element={
                        <Suspense fallback={<LoadingFallback/>}>
                            <Home/>
                        </Suspense>
                    }/>
                    <Route path="/signup" element={
                        <Suspense fallback={<LoadingFallback/>}>
                            <Signup/>
                        </Suspense>
                    }/>
                    <Route path="/login" element={
                        <Suspense fallback={<LoadingFallback/>}>
                            <Login/>
                        </Suspense>
                    }/>
                    <Route path="/forgotpassword" element={
                        <Suspense fallback={<LoadingFallback/>}>
                            <ForgotPassword/>
                        </Suspense>
                    }/>
                    <Route path="/search" element={
                        <Suspense fallback={<LoadingFallback/>}>
                            <Search/>
                        </Suspense>
                    }/>
                    <Route path="/suggestions" element={
                        <Suspense fallback={<LoadingFallback/>}>
                            <Suggestions/>
                        </Suspense>
                    }/>
                    <Route path="/profile/:username" element={
                        <Suspense fallback={<LoadingFallback/>}>
                            <ProfileShow/>
                        </Suspense>
                    }/>
                    <Route path="/profile" element={
                        <Suspense fallback={<LoadingFallback/>}>
                            <Profile/>
                        </Suspense>
                    }/>
                    <Route path="/likes" element={
                        <Suspense fallback={<LoadingFallback/>}>
                            <Like/>
                        </Suspense>
                    }/>
                    <Route path="/visits" element={
                        <Suspense fallback={<LoadingFallback/>}>
                            <Visit/>
                        </Suspense>
                    }/>
                    <Route path="/chat" element={
                        <Suspense fallback={<LoadingFallback/>}>
                            <Chat/>
                        </Suspense>
                    }/>
                    <Route path="/editProfile" element={
                        <Suspense fallback={<LoadingFallback/>}>
                            <EditProfile/>
                        </Suspense>
                    }/>
                </Route>

                <Route element={
                    <Suspense fallback={<LoadingFallback/>}>
                        <OtherLayout/>
                    </Suspense>
                }>
                    <Route path="/login/admin" element={
                        <Suspense fallback={<LoadingFallback/>}>
                            <AdminLogin/>
                        </Suspense>
                    }/>
                    <Route path="/payment/success" element={
                        <Suspense fallback={<LoadingFallback/>}>
                            <PaymentSuccess/>
                        </Suspense>
                    }/>
                </Route>

                <Route path="*" element={
                    <Suspense fallback={<LoadingFallback/>}>
                        <PageNotFound/>
                    </Suspense>
                }/>
            </Routes>
        </Suspense>
    );
}

export default App;
