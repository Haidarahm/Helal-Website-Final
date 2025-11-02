import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import { ConfigProvider } from "antd";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "antd/dist/reset.css";
import "./index.css";
import App from "./App.jsx";
import "./assets/locales/i18n";
import { LanguageProvider } from "./context/LanguageContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <LanguageProvider>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#f9943c",
            colorLink: "#f9943c",
            colorLinkHover: "#ae4607",
            colorLinkActive: "#ae4607",
            borderRadius: 8,
          },
          components: {
            Button: {
              colorPrimary: "#f9943c",
              colorPrimaryHover: "#ae4607",
              colorPrimaryActive: "#ae4607",
              borderRadius: 8,
            },
            Input: {
              activeBorderColor: "#f9943c",
              hoverBorderColor: "#f9943c",
              borderRadius: 8,
            },
            Card: {
              borderRadiusLG: 12,
            },
          },
        }}
      >
        <BrowserRouter basename="/Helal-Aljaberi/">
          <App />
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </BrowserRouter>
      </ConfigProvider>
    </LanguageProvider>
  </StrictMode>
);

// Initialize AOS globally once
try {
  AOS.init({ duration: 700, easing: "ease-out-quart", once: true, offset: 0 });
} catch {}
