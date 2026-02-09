import UserLayout from "@/layout/UserLayout";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import styles from "./style.module.css";
import { registerUser, loginUser } from "@/config/redux/action/authAction";
import { reset } from "@/config/redux/reducer/authReducer/index"; 

function LoginComponent() {
  const authState = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();

  const [userLoginMethod, setUserLoginMethod] = useState(false);
  const [email, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");


  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [videoUrl, setVideoUrl] = useState("");

  const videoPool = [
    "https://customer-cbeadsgr09pnsezs.cloudflarestream.com/90bb1b34646b81b3b63e5a854ea00da3/manifest/video.m3u8",
    "https://customer-cbeadsgr09pnsezs.cloudflarestream.com/df176a2fb2ea2b64bd21ae1c10d3af6a/manifest/video.m3u8"
  ];

  useEffect(() => {
    setVideoUrl(videoPool[Math.floor(Math.random() * videoPool.length)]);
    
    const handleMouseMove = (e) => {
      
      setMousePos({ 
        x: (e.clientX - window.innerWidth / 2) / 40, 
        y: (e.clientY - window.innerHeight / 2) / 40 
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);


  useEffect(() => {
    if (authState.isSuccess) {
      setUserLoginMethod(true); 
      dispatch(reset()); 
    }
  }, [authState.isSuccess, dispatch]);

  useEffect(() => {
    if (authState.loggedIn || localStorage.getItem("token")) {
      router.push("/dashboard");
    }
  }, [authState.loggedIn, router]);

  const handleRegister = () => {
    dispatch(registerUser({ username, password, email, name }));
  };

  const handleLogin = () => {
    dispatch(loginUser({ email, password }));
  };

  
  return (
    <UserLayout>
      <div className={styles.container}>
        <div className={styles.cardContainer}>
          
    
          <div className={styles.cardContainer_left}>
            <div 
              className={styles.emojiContainer} 
              style={{ transform: `translate(${mousePos.x}px, ${mousePos.y}px)` }}
            >
                <div className={`${styles.character} ${styles.orange}`}></div>
                <div className={`${styles.character} ${styles.purple}`}></div>
                <div className={`${styles.character} ${styles.black}`}></div>
                <div className={`${styles.character} ${styles.yellow}`}></div>
            </div>
          </div>

          <div className={styles.cardContainer_right}>
            <h1 className={styles.welcomeText}>Welcome back!</h1>
            <p className={styles.subText}>Please enter your details</p>

            {authState.message && (
              <p style={{ color: authState.isError ? "#FF453A" : "#32D74B", fontSize: '12px', marginBottom: '15px', fontWeight: 'bold' }}>
                {authState.message}
              </p>
            )}

            <div className={styles.inputContainer}>
              {!userLoginMethod && (
                <>
                  <div className={styles.inputWrapper}>
                    <label className={styles.inputLabel}>Username</label>
                    <input onChange={(e) => setUsername(e.target.value)} value={username} className={styles.inputField} type="text" />
                  </div>
                  <div className={styles.inputWrapper}>
                    <label className={styles.inputLabel}>Name</label>
                    <input onChange={(e) => setName(e.target.value)} value={name} className={styles.inputField} type="text" />
                  </div>
                </>
              )}

              <div className={styles.inputWrapper}>
                <label className={styles.inputLabel}>Email</label>
                <input onChange={(e) => setEmailAddress(e.target.value)} value={email} className={styles.inputField} type="email" />
              </div>

              <div className={styles.inputWrapper}>
                <label className={styles.inputLabel}>Password</label>
                <input onChange={(e) => setPassword(e.target.value)} value={password} className={styles.inputField} type="password" />
              </div>

              <div onClick={() => userLoginMethod ? handleLogin() : handleRegister()} className={styles.mainButton}>
                {authState.isLoading ? "Processing..." : (userLoginMethod ? "Log In" : "Sign Up")}
              </div>
            </div>

            <p className={styles.footerText}>
                {userLoginMethod ? "Don't have an account?" : "Already have an account?"}
                <span className={styles.footerLink} onClick={() => { setUserLoginMethod(!userLoginMethod); dispatch(reset()); }}>
                    {userLoginMethod ? "Sign Up" : "Log In"}
                </span>
            </p>

            
            <div className={styles.videoBackground}>
                <video autoPlay loop muted playsInline>
                  <source src={videoUrl} type="application/x-mpegURL" />
                </video>
            </div>
          </div>

        </div>
      </div>
    </UserLayout>
  );
}

export default LoginComponent; 




// import UserLayout from "@/layout/UserLayout";
// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useRouter } from "next/router";
// import styles from "./style.module.css";
// import { registerUser, loginUser } from "@/config/redux/action/authAction";

// import { reset } from "@/config/redux/reducer/authReducer/index"; 

// function LoginComponent() {
//   const authState = useSelector((state) => state.auth);
//   const dispatch = useDispatch();
//   const router = useRouter();

//   const [userLoginMethod, setUserLoginMethod] = useState(false);
//   const [email, setEmailAddress] = useState("");
//   const [password, setPassword] = useState("");
//   const [username, setUsername] = useState("");
//   const [name, setName] = useState("");

//   useEffect(() => {
//     if (authState.isSuccess) {
//       setUserLoginMethod(true); 
//       dispatch(reset()); // Clean state so we don't loop
//     }
//   }, [authState.isSuccess, dispatch]);


//   useEffect(() => {
//     if (authState.loggedIn || localStorage.getItem("token")) {
//       router.push("/dashboard");
//     }
//   }, [authState.loggedIn, router]);

//   const handleRegister = () => {
//     dispatch(registerUser({ username, password, email, name }));
//   };

//   const handleLogin = () => {
//     dispatch(loginUser({ email, password }));
//   };

//   return (
//     <UserLayout>
//       <div className={styles.container}>
//         <div className={styles.cardContainer}>
//           <div className={styles.cardContainer_left}>
//             <p className={styles.cardleft_heading}>
//               {userLoginMethod ? "Sign In" : "Sign Up"}
//             </p>

//             {authState.message && (
//               <p style={{ color: authState.isError ? "red" : "green", fontWeight: "bold" }}>
//                 {authState.message}
//               </p>
//             )}

//             <div className={styles.inputContainer}>
//               {!userLoginMethod && (
//                 <div className={styles.inputRow}>
//                   <input onChange={(e) => setUsername(e.target.value)} className={styles.inputField} type="text" placeholder="Username" />
//                   <input onChange={(e) => setName(e.target.value)} className={styles.inputField} type="text" placeholder="Name" />
//                 </div>
//               )}

//               <input onChange={(e) => setEmailAddress(e.target.value)} className={styles.inputField} type="email" placeholder="Email" />
//               <input onChange={(e) => setPassword(e.target.value)} className={styles.inputField} type="password" placeholder="Password" />

//               <div 
//                 onClick={() => userLoginMethod ? handleLogin() : handleRegister()} 
//                 className={styles.buttonWithOutline}
//               >
//                 <p>{authState.isLoading ? "Processing..." : (userLoginMethod ? "Sign In" : "Sign Up")}</p>
//               </div>
//             </div>
//           </div>

//           <div className={styles.cardContainer_right}>
//             <div>
//               <p>{userLoginMethod ? "Don't have an account?" : "Already have an account?"}</p>
//               <div 
//                 onClick={() => {
//                   setUserLoginMethod(!userLoginMethod);
//                   dispatch(reset()); 
//                 }} 
//                 className={styles.buttonWithOutline}
//               >
//                 <p>{userLoginMethod ? "Sign Up" : "Sign In"}</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </UserLayout>
//   );
// }

// export default LoginComponent;