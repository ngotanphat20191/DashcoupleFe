import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useContext, useCallback, lazy, Suspense } from "react";
import { baseAxios, adminAxios } from "./config/axiosConfig.jsx";
import { ThemeContext, ThemeProvider } from "./context/ThemeContext";
import { SidebarProvider } from "./context/SidebarContext";
import { DARK_THEME } from "./constants/themeConstants";
import { CircularProgress, Box } from "@mui/material";

// Lazy load components for better performance
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

// Loading component for suspense fallback
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
    <CircularProgress color="secondary" />
  </Box>
);

function App() {
    return (
        <ThemeProvider>
            <SidebarProvider>
                <Router>
                    <AppRoutes />
                </Router>
            </SidebarProvider>
        </ThemeProvider>
    );
}

function AppRoutes() {
    const { theme } = useContext(ThemeContext);
    const location = useLocation();

    const hideNavRoutes = ["/editProfile"];
    const hideNavRoutes2 = ["/", "/profile", "/chat", "/suggestion", "/visits", "/search", "/likes"];
    const hideNavRoutes3 = ["/admin/questioninterest", "/admin/interest", "/admin/user", "/admin"];

    // Set background based on route
    useEffect(() => {
        const root = document.getElementById("root");
        if (hideNavRoutes.includes(location.pathname)) {
            root.style.background = 'url("/stardot.jpg")';
        } else {
            root.style.background = 'url("/sakura.jpg") no-repeat center center / cover';
        }
    }, [location.pathname, hideNavRoutes]);

    // Memoize token check functions to prevent unnecessary recreations
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
                    console.error("Token check error:", err.response.data);
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
                    console.error("Admin token check error:", err.response.data);
                }
            });
    }, []);

    // Check tokens based on route
    useEffect(() => {
        if (hideNavRoutes2.includes(location.pathname)) {
            checkToken();
        }
        if (hideNavRoutes3.includes(location.pathname)) {
            checkAdminToken();
        }
    }, [location.pathname, hideNavRoutes2, hideNavRoutes3, checkToken, checkAdminToken]);

    // Toggle dark mode
    useEffect(() => {
        document.body.classList.toggle("dark-mode", theme === DARK_THEME);
    }, [theme]);

    return (
        <Suspense fallback={<LoadingFallback />}>
            <Routes>
                <Route element={
                    <Suspense fallback={<LoadingFallback />}>
                        <BaseLayout />
                    </Suspense>
                }>
                    <Route path="/admin" element={
                        <Suspense fallback={<LoadingFallback />}>
                            <Dashboard />
                        </Suspense>
                    } />
                    <Route path="/admin/user" element={
                        <Suspense fallback={<LoadingFallback />}>
                            <User />
                        </Suspense>
                    } />
                    <Route path="/admin/interest" element={
                        <Suspense fallback={<LoadingFallback />}>
                            <Interest />
                        </Suspense>
                    } />
                    <Route path="/admin/questioninterest" element={
                        <Suspense fallback={<LoadingFallback />}>
                            <InterestQuestion />
                        </Suspense>
                    } />
                </Route>

                <Route element={
                    <Suspense fallback={<LoadingFallback />}>
                        <MainLayout />
                    </Suspense>
                }>
                    <Route path="/" element={
                        <Suspense fallback={<LoadingFallback />}>
                            <Home />
                        </Suspense>
                    } />
                    <Route path="/signup" element={
                        <Suspense fallback={<LoadingFallback />}>
                            <Signup />
                        </Suspense>
                    } />
                    <Route path="/login/admin" element={
                        <Suspense fallback={<LoadingFallback />}>
                            <AdminLogin />
                        </Suspense>
                    } />
                    <Route path="/login" element={
                        <Suspense fallback={<LoadingFallback />}>
                            <Login />
                        </Suspense>
                    } />
                    <Route path="/forgotpassword" element={
                        <Suspense fallback={<LoadingFallback />}>
                            <ForgotPassword />
                        </Suspense>
                    } />
                    <Route path="/search" element={
                        <Suspense fallback={<LoadingFallback />}>
                            <Search />
                        </Suspense>
                    } />
                    <Route path="/suggestions" element={
                        <Suspense fallback={<LoadingFallback />}>
                            <Suggestions />
                        </Suspense>
                    } />
                    <Route path="/profile/:username" element={
                        <Suspense fallback={<LoadingFallback />}>
                            <ProfileShow />
                        </Suspense>
                    } />
                    <Route path="/profile" element={
                        <Suspense fallback={<LoadingFallback />}>
                            <Profile />
                        </Suspense>
                    } />
                    <Route path="/likes" element={
                        <Suspense fallback={<LoadingFallback />}>
                            <Like />
                        </Suspense>
                    } />
                    <Route path="/visits" element={
                        <Suspense fallback={<LoadingFallback />}>
                            <Visit />
                        </Suspense>
                    } />
                    <Route path="/chat" element={
                        <Suspense fallback={<LoadingFallback />}>
                            <Chat />
                        </Suspense>
                    } />
                    <Route path="/editProfile" element={
                        <Suspense fallback={<LoadingFallback />}>
                            <EditProfile />
                        </Suspense>
                    } />
                </Route>

                <Route element={
                    <Suspense fallback={<LoadingFallback />}>
                        <OtherLayout />
                    </Suspense>
                }>
                    <Route path="/payment/success" element={
                        <Suspense fallback={<LoadingFallback />}>
                            <PaymentSuccess />
                        </Suspense>
                    } />
                </Route>

                <Route path="*" element={
                    <Suspense fallback={<LoadingFallback />}>
                        <PageNotFound />
                    </Suspense>
                } />
            </Routes>
        </Suspense>
    );
}

export default App;
