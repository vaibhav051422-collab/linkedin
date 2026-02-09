import React from "react";
import { useRouter } from "next/router";

export function NavBarComponent() {
  const router = useRouter();

  const navContainerStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "44px",
    backgroundColor: "rgba(22, 22, 23, 0.8)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
    display: "flex",
    alignItems: "center",
    zIndex: 9999,
  };

  const innerNavStyle = {
    maxWidth: "1024px",
    width: "87.5%",
    margin: "0 auto",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  };

  const brandStyle = {
    fontSize: "14px",
    fontWeight: "600",
    color: "#F5F5F7",
    cursor: "pointer",
    margin: 0,
    letterSpacing: "-0.01em",
  };

  const buttonJoinStyle = {
    backgroundColor: "rgba(42, 42, 45, 0.72)",
    padding: "4px 12px",
    borderRadius: "28px",
    cursor: "pointer",
    transition: "background 0.3s ease",
  };

  const buttonTextStyle = {
    fontSize: "12px",
    fontWeight: "600",
    color: "rgba(255, 255, 255, 0.8)",
    margin: 0,
  };

  return (
    <div style={navContainerStyle}>
      <nav style={innerNavStyle}>
        <h1
          style={brandStyle}
          onClick={() => {
            router.push("/");
          }}
        >
          Pro Connect
        </h1>

        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            style={buttonJoinStyle}
            className="nav-btn-hover"
            onClick={() => {
              router.push("/login");
            }}
          >
            <p style={buttonTextStyle}>Be a Part</p>
          </div>
        </div>
      </nav>

      <style jsx>{`
        .nav-btn-hover:hover {
          background: rgba(66, 66, 69, 0.72) !important;
        }
        .nav-btn-hover:hover p {
          color: #ffffff !important;
        }
      `}</style>
    </div>
  );
}

export default NavBarComponent;
