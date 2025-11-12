import { Routes, Route } from "react-router-dom";
import { Suspense, lazy, useEffect } from "react";

// Lazy imports for better performance
const Contact = lazy(() => import("./pages/Contact.jsx"));
const Programs = lazy(() => import("./pages/Programs.jsx"));
const Courses = lazy(() => import("./pages/courses/Courses.jsx"));
const OnlineCourses = lazy(() => import("./pages/courses/OnlineCourses.jsx"));
const OfflineCourses = lazy(() => import("./pages/courses/OfflineCourses.jsx"));
const PrivateCourses = lazy(() => import("./pages/courses/PrivateCourses.jsx"));
const CourseSuccess = lazy(() => import("./pages/courses/CourseSuccess.jsx"));
const MyCourses = lazy(() => import("./pages/mycourses/MyCourses.jsx"));
const MyOfflineCourses = lazy(() =>
  import("./pages/mycourses/MyOfflineCourses.jsx")
);
const MyOnlineCourses = lazy(() =>
  import("./pages/mycourses/MyOnlineCourses.jsx")
);
const Consultation = lazy(() =>
  import("./pages/consultation/Consultation.jsx")
);
const ConsultationSuccess = lazy(() =>
  import("./pages/consultation/ConsultationSuccess.jsx")
);
const Calculator = lazy(() =>
  import("./pages/Calculator.jsx").then((module) => ({
    default: module.Calculator,
  }))
);
const Auth = lazy(() =>
  import("./pages/auth/Auth.jsx").then((module) => ({ default: module.Auth }))
);
const OtpEmail = lazy(() =>
  import("./pages/auth/OtpEmail.jsx").then((module) => ({
    default: module.OtpEmail,
  }))
);
const VerifyOtp = lazy(() =>
  import("./pages/auth/VerifyOtp.jsx").then((module) => ({
    default: module.VerifyOtp,
  }))
);
const ResetPassword = lazy(() =>
  import("./pages/auth/ResetPassword.jsx").then((module) => ({
    default: module.ResetPassword,
  }))
);
const Layout = lazy(() => import("./components/Layout.jsx"));
const Home = lazy(() => import("./pages/home/Home.jsx"));
const News = lazy(() => import("./pages/News.jsx"));
const NewsDetails = lazy(() => import("./pages/NewsDetails.jsx"));
const Profile = lazy(() => import("./pages/home/Profile.jsx"));
const Videos = lazy(() => import("./pages/videos/Videos.jsx"));
const VideoContainer = lazy(() => import("./pages/videos/VideoContainer.jsx"));
const Meet = lazy(() => import("./pages/Meet.jsx"));

// Simple Loader Component
function Loader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary">
      <div className="flex flex-col items-center gap-4">
        {/* Spinning loader */}
        <div className="w-12 h-12 border-4 border-accent border-t-primary rounded-full animate-spin"></div>

        {/* Loading text */}
        <div className="text-accent text-lg">Loading...</div>

        {/* Loading dots animation */}
        <div className="flex gap-1">
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
          <div
            className="w-2 h-2 bg-primary rounded-full animate-bounce"
            style={{ animationDelay: "0.1s" }}
          ></div>
          <div
            className="w-2 h-2 bg-primary rounded-full animate-bounce"
            style={{ animationDelay: "0.2s" }}
          ></div>
        </div>
      </div>
    </div>
  );
}

function App() {
  useEffect(() => {
    // Warm common routes after initial mount
    const preloads = [
      import("./pages/Programs.jsx"),
      import("./pages/Contact.jsx"),
      import("./pages/News.jsx"),
      import("./pages/courses/Courses.jsx"),
    ];
    // no-op to silence unused var
    void preloads;
  }, []);

  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/programs" element={<Programs />} />
          <Route path="/courses" element={<Courses />}>
            <Route path="online-courses" element={<OnlineCourses />} />
            <Route path="offline-courses" element={<OfflineCourses />} />
            <Route path="private-courses" element={<PrivateCourses />} />
            <Route index element={<OnlineCourses />} />
          </Route>
          <Route path="/my-courses" element={<MyCourses />}>
            <Route path="offline" element={<MyOfflineCourses />} />
            <Route path="online" element={<MyOnlineCourses />} />
            <Route index element={<MyOfflineCourses />} />
          </Route>
          <Route path="/calculator" element={<Calculator />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/news" element={<News />} />
          <Route path="/news/:id" element={<NewsDetails />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/my-courses/:id" element={<Videos />} />
          <Route
            path="/my-courses/:id/videos/:videoId"
            element={<VideoContainer />}
          />
          <Route path="/consultation" element={<Consultation />} />
          <Route path="/meet/:url" element={<Meet />} />
        </Route>
        {/* Course Success */}
        <Route path="/course-success" element={<CourseSuccess />} />
        {/* Consultation Success */}
        <Route path="/consultation-success" element={<ConsultationSuccess />} />
        {/* Payment pages removed */}
        {/* Auth pages without layout */}
        <Route path="/auth" element={<Auth />} />
        <Route path="/otp-email" element={<OtpEmail />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
    </Suspense>
  );
}

export default App;
