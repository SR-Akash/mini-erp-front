// import React from "react";
// import { Link } from "react-router-dom";
// import "./topNav.css";
// import { LoginOutlined } from "@ant-design/icons";
// import logo from '../../assets/images/mgm-logo.svg'
// const TopAuthNaviation = () => {
//   return (
//     <div>
//         <div
//         style={{
//             position: sticky;
//             width: 100%;
//             top: 0;
//             padding: 0px 15px;
//             z-index: 999;
//             border-bottom: 1px solid var(--divider);
//             background: var(--white);
//             overflow-x: hidden;
//         }}
//         >
//         <div className="top-navigation">
//       <div className="logo-wrapper">
//         <div className="logo-img">
//           <Link to="/">
//             <img src={logo} style={{height:"35px",width:"36px"}} alt="Managarium" />
//             <span>Managerium</span>
//           </Link>
//         </div>
//       </div>

//       <div className="sing-in">
//         <LoginOutlined />
//         <Link to="/login">Sign In</Link>
//       </div>
//     </div>
//     </div>
//     </div>
//   );
// };

// export default TopAuthNaviation;

// components/Header.tsx

import React from "react";
import { Layout, Menu, Button } from "antd";
import { LoginOutlined } from "@ant-design/icons";
import logo from "../../assets/images/mgm-logo.svg";

const AppHeader: React.FC = () => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: "1px solid #e0e0e0",
        width: "100%",
        padding: "10px 15px",
        backgroundColor: "#fff"
      }}
    >
      <div
        style={{ display: "flex",justifyContent:"start", alignItems: "center", paddingLeft: "156px" ,backgroundColor:"#fff"}}
      >
        <img src={logo} alt="Mgm Logo" width={40} height={36} />
        <p style={{ fontSize: "24px", color: "#036369",backgroundColor:"#fff",fontWeight:"600"}}>
          MANAGERIUM
        </p>
      </div>
      <div style={{ paddingRight: "156px", color: "#000" ,backgroundColor:"#fff"}}>
        <Button
          type="link"
          icon={<LoginOutlined />}
          style={{ fontSize: 16, color: "#000",backgroundColor:"#fff" }}
        >
          Sign In
        </Button>
      </div>
    </div>
  );
};

export default AppHeader;
