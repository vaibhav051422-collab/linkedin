import Head from "next/head";
import { useRouter } from "next/router";
import UserLayout from "@/layout/UserLayout";
import { useEffect, useState } from "react";

export default function Home() {
  const router = useRouter();
  const [videoUrl, setVideoUrl] = useState("");

  // Video pool from your JSON instructions
  const videoPool = [
    "https://customer-cbeadsgr09pnsezs.cloudflarestream.com/90bb1b34646b81b3b63e5a854ea00da3/manifest/video.m3u8",
    "https://customer-cbeadsgr09pnsezs.cloudflarestream.com/df176a2fb2ea2b64bd21ae1c10d3af6a/manifest/video.m3u8",
    "https://customer-cbeadsgr09pnsezs.cloudflarestream.com/12a9780eeb1ea015801a5f55cf2e9d3d/manifest/video.m3u8",
    "https://customer-cbeadsgr09pnsezs.cloudflarestream.com/964cb3eddff1a67e3772aac9a7aceea2/manifest/video.m3u8",
    "https://customer-cbeadsgr09pnsezs.cloudflarestream.com/dd17599dfa77f41517133fa7a4967535/manifest/video.m3u8"
  ];

  useEffect(() => {
    // Logic to randomly select a video from the pool on mount
    const randomVideo = videoPool[Math.floor(Math.random() * videoPool.length)];
    setVideoUrl(randomVideo);
  }, []);

  // Internal styles to match JSON "Hero Section" and "Typography" specs
  const containerStyle = {
    backgroundColor: "#000000",
    minHeight: "100vh",
    color: "#F5F5F7",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0 6.25%", // 87.5% content width
    overflow: "hidden"
  };

  const mainContainerStyle = {
    maxWidth: "1680px",
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "80px", // content_gap_large
  };

  const textContainerStyle = {
    flex: "1",
    maxWidth: "420px", // constrained_width
    zIndex: 10
  };

  const headlineStyle = {
    fontSize: "80px", // hero_display size
    fontWeight: "600",
    lineHeight: "1.05",
    marginBottom: "20px",
    letterSpacing: "-0.015em"
  };

  const subheadlineStyle = {
    fontSize: "22px", // body_large size
    fontWeight: "600",
    color: "rgba(255, 255, 255, 0.8)", // secondary white
    marginBottom: "48px"
  };

  const buttonStyle = {
    display: "inline-block",
    backgroundColor: "rgba(42, 42, 45, 0.72)",
    backdropFilter: "blur(20px)",
    padding: "18px 32px",
    borderRadius: "28px",
    cursor: "pointer",
    fontSize: "18px",
    fontWeight: "600",
    transition: "background 0.3s ease"
  };

  const videoWrapperStyle = {
    flex: "1.5",
    height: "656px",
    borderRadius: "28px",
    overflow: "hidden",
    position: "relative",
    backgroundColor: "#161617"
  };

  return (
    <UserLayout>
      <div style={containerStyle}>
        <div style={mainContainerStyle}>
          {/* Left Side: Clean Typography */}
          <div style={textContainerStyle}>
            <h1 style={headlineStyle}>
              Connect without <br /> Exaggeration.
            </h1>
            <p style={subheadlineStyle}>
              A True Social Media Platform. <br />
              Stories, no bluffs.
            </p>

            <div
              style={buttonStyle}
              className="btn-hover"
              onClick={() => router.push("/login")}
            >
              Join Now
            </div>
          </div>

          {/* Right Side: Mandatory Video Implementation */}
          <div style={videoWrapperStyle}>
            {videoUrl && (
              <video
                autoPlay
                loop
                muted
                playsInline
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover"
                }}
              >
                <source src={videoUrl} type="application/x-mpegURL" />
                {/* Fallback for standard browsers */}
                <source src={videoUrl.replace('/manifest/video.m3u8', '/thumbnails/thumbnail.jpg')} type="video/mp4" />
              </video>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .btn-hover:hover {
          background: rgba(66, 66, 69, 0.72) !important;
        }
        @media (max-width: 1068px) {
          div[style*="flexDirection: row"] {
            flex-direction: column !important;
            text-align: center;
            padding-top: 120px;
          }
          h1 { font-size: 48px !important; }
        }
      `}</style>
    </UserLayout>
  );
}