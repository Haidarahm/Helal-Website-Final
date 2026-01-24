import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  Menu,
  X,
  Languages,
  User as UserIcon,
  BookOpen,
  LogOut as LogOutIcon,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../context/LanguageContext";
import { useAuthStore } from "../store";
import { Dropdown } from "antd";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  const { currentLanguage, toggleLanguage, isRTL } = useLanguage();
  const navigate = useNavigate();
  const { user, token, logout } = useAuthStore();
  const isLoggedIn = Boolean(token);
  const toggle = () => setOpen((v) => !v);
  const close = () => setOpen(false);

  const userMenuItems = [
    {
      key: "profile",
      label: t("nav.menu.profile"),
      icon: <UserIcon size={16} />,
    },
    {
      key: "courses",
      label: t("nav.menu.my_courses"),
      icon: <BookOpen size={16} />,
    },
    { type: "divider" },
    {
      key: "logout",
      label: t("nav.menu.logout"),
      icon: <LogOutIcon size={16} />,
      danger: true,
    },
  ];

  const onUserMenuClick = ({ key }) => {
    if (key === "profile") {
      navigate("/profile");
      return;
    }
    if (key === "courses") {
      navigate("/my-courses");
      return;
    }
    if (key === "logout") {
      logout();
      navigate("/");
      return;
    }
  };
  return (
    <header className="fixed inset-x-0 top-0 z-50 backdrop-blur supports-backdrop-filter:bg-secondary/80 bg-secondary/90 text-accent shadow-md border-b border-secondary-light">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <NavLink
          to="/"
          className="text-xl font-semibold text-primary hover:text-primary-light transition-colors"
        >
          Helal Aljaberi
        </NavLink>
        {/* Desktop nav */}
        <nav className={`hidden md:flex items-center gap-1`}>
          <div className={`nav-items flex ${isRTL ? "flex-row-reverse" : ""}`}>
            <NavItem to="/">{t("nav.home")}</NavItem>
            {/* <NavItem to="/programs">{t("nav.programs")}</NavItem> */}
            <NavItem to="/courses">{t("nav.courses")}</NavItem>
            <NavItem to="/broadcasts">{t("broadcast.page_title") || "Broadcasts"}</NavItem>
            <NavItem to="/news">News</NavItem>
            <NavItem to="/contact">{t("nav.contact")}</NavItem>
          </div>

          {/* Divider */}
          <div className="h-6 w-px bg-secondary-light mx-2"></div>

          {/* Auth/User Group */}
          {isLoggedIn ? (
            <Dropdown
              menu={{ items: userMenuItems, onClick: onUserMenuClick }}
              trigger={["click"]}
              placement="bottomRight"
            >
              <button
                type="button"
                className="flex items-center  gap-3 ml-1 px-2 py-1 rounded-md hover:bg-secondary-light transition-colors"
                aria-label={`${t("nav.menu.profile", "Account")} menu`}
              >
                <div className="h-9 w-9 rounded-full bg-primary/90 text-white flex items-center justify-center overflow-hidden">
                  {user?.avatar ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={user.avatar}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : user?.name || user?.email ? (
                    <span className="text-sm font-semibold">
                      {getInitials(user?.name || user?.email)}
                    </span>
                  ) : (
                    <UserIcon size={18} aria-hidden />
                  )}
                </div>
                <span className="text-sm font-medium text-accent max-w-[180px] truncate">
                  {user?.name || user?.username || user?.email || "Account"}
                </span>
              </button>
            </Dropdown>
          ) : (
            <div className="flex items-center gap-2 ml-1">
              <NavLink
                to="/auth"
                state={{ initialForm: "signin" }}
                className="px-4 py-2 text-sm font-medium text-accent hover:text-primary rounded-md hover:bg-secondary-light transition-all duration-200"
              >
                {t("auth.sign_in")}
              </NavLink>
              <NavLink
                to="/auth"
                state={{ initialForm: "signup" }}
                className="relative inline-block px-5 py-2 text-sm font-semibold bg-linear-to-r from-primary to-primary-dark text-white rounded-lg hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 hover:scale-105"
              >
                {t("auth.sign_up")}
                <span className="absolute inset-0 rounded-lg bg-white/20 opacity-0 hover:opacity-100 transition-opacity duration-300" aria-hidden />
              </NavLink>
            </div>
          )}

          {/* Language Toggle Button */}
          <div className="h-6 w-px bg-secondary-light mx-2"></div>
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-secondary-light focus:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-colors"
            title={t("language.toggle")}
            aria-label={t("language.toggle")}
          >
            <Languages size={18} />
            <span className="text-sm font-medium">
              {t("language.switch_to")}
            </span>
          </button>
        </nav>
        {/* Mobile toggle */}
        <button
          className="md:hidden inline-flex items-center justify-center p-2 rounded-lg hover:bg-secondary-light focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          onClick={toggle}
          aria-label="Toggle Menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      {/* Mobile menu panel */}
      <div
        className={[
          "md:hidden transition-all  duration-300 overflow-hidden border-t border-secondary-light",
          open ? "max-h-96 opacity-100" : "max-h-0 opacity-0",
        ].join(" ")}
      >
        <div className="px-4 py-3 flex flex-col gap-1 bg-secondary/95">
          <MobileNavItem to="/" onClick={close}>
            {t("nav.home")}
          </MobileNavItem>
          <MobileNavItem to="/programs" onClick={close}>
            {t("nav.programs")}
          </MobileNavItem>
          <MobileNavItem to="/courses" onClick={close}>
            {t("nav.courses")}
          </MobileNavItem>
          <MobileNavItem to="/broadcasts" onClick={close}>
            {t("broadcast.page_title") || "Broadcasts"}
          </MobileNavItem>
          <MobileNavItem to="/news" onClick={close}>
            News
          </MobileNavItem>
          <MobileNavItem to="/contact" onClick={close}>
            {t("nav.contact")}
          </MobileNavItem>

          {/* Divider */}
          <div className="h-px bg-secondary-light my-3"></div>

          {/* Mobile Auth/User */}
          {isLoggedIn ? (
            <Dropdown
              menu={{
                items: userMenuItems,
                onClick: (info) => {
                  onUserMenuClick(info);
                  close();
                },
              }}
              trigger={["click"]}
              placement="bottomRight"
            >
              <button
                type="button"
                className="flex items-center gap-3 py-1 px-2 rounded-md hover:bg-secondary-light transition-colors"
                aria-label={`${t("nav.menu.profile", "Account")} menu`}
              >
                <div className="h-10 w-10 rounded-full bg-primary/90 text-white flex items-center justify-center overflow-hidden">
                  {user?.avatar ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={user.avatar}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : user?.name || user?.email ? (
                    <span className="text-sm font-semibold">
                      {getInitials(user?.name || user?.email)}
                    </span>
                  ) : (
                    <UserIcon size={18} aria-hidden />
                  )}
                </div>
                <div className="min-w-0">
                  <div className="text-base font-semibold text-accent truncate">
                    {user?.name || user?.username || user?.email || "Account"}
                  </div>
                </div>
              </button>
            </Dropdown>
          ) : (
            <div className="flex flex-col gap-2">
              <NavLink
                to="/auth"
                state={{ initialForm: "signin" }}
                onClick={close}
                className="w-full px-4 py-2.5 text-base font-medium text-accent rounded-lg hover:bg-secondary-light border border-secondary-light hover:border-primary/30 transition-all duration-200 text-center"
              >
                {t("auth.sign_in")}
              </NavLink>
              <NavLink
                to="/auth"
                state={{ initialForm: "signup" }}
                onClick={close}
                className="w-full px-4 py-2.5 text-base font-semibold bg-linear-to-r from-primary to-primary-dark text-white rounded-lg hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 hover:scale-[1.02] text-center"
              >
                {t("auth.sign_up")}
              </NavLink>
            </div>
          )}

          {/* Divider */}
          <div className="h-px bg-secondary-light my-3"></div>

          {/* Mobile Language Toggle */}
          <button
            onClick={() => {
              toggleLanguage();
              close();
            }}
            className="px-3 py-2.5 rounded-lg hover:bg-secondary-light focus:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-colors flex items-center gap-2"
            aria-label={t("language.toggle")}
          >
            <Languages size={18} />
            <span className="text-base font-medium">
              {t("language.switch_to")}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}

function NavItem({ to, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          "px-3 py-2 rounded-md text-sm font-medium tracking-wide transition-colors",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary focus-visible:ring-offset-secondary",
          "hover:bg-secondary-light hover:text-primary-light",
          isActive ? "text-primary" : "text-accent",
        ].join(" ")
      }
      end={to === "/"}
    >
      {children}
    </NavLink>
  );
}

function CTAItem({ to, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          "relative inline-flex items-center justify-center px-4 py-2 rounded-xl text-sm font-semibold tracking-wide",
          "transition-all duration-300",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary focus-visible:ring-offset-secondary",
          "bg-primary text-accent",
          "hover:bg-primary-dark",
          "after:absolute after:inset-0 after:rounded-xl after:opacity-0 after:transition-opacity after:bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.25),rgba(255,255,255,0))] hover:after:opacity-100",
          isActive ? "ring-1 ring-primary-light" : "",
        ].join(" ")
      }
    >
      {children}
      <span className="ml-2 inline-block h-2 w-2 rounded-full bg-accent animate-pulse"></span>
    </NavLink>
  );
}

function MobileNavItem({ to, onClick, children }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        [
          "px-3 py-2 rounded-md text-base font-medium tracking-wide transition-colors",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
          "hover:bg-secondary-light hover:text-primary-light",
          isActive ? "text-primary" : "text-accent",
        ].join(" ")
      }
      end={to === "/"}
    >
      {children}
    </NavLink>
  );
}

function MobileCTA({ to, onClick, children }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className="mt-1 inline-flex items-center justify-center px-4 py-2 rounded-xl text-base font-semibold bg-primary text-accent hover:bg-primary-dark transition-colors"
    >
      {children}
    </NavLink>
  );
}

function getInitials(name) {
  if (!name) return "U";
  const parts = String(name).trim().split(/\s+/);
  const initials = parts
    .slice(0, 2)
    .map((p) => (p?.[0] || "").toUpperCase())
    .join("");
  return initials || (String(name)?.[0] || "U").toUpperCase();
}
