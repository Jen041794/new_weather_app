import React from "react";
import ReactDOM from "react-dom/client"; // 注意這裡多了一個 /client
import App from "./App";

// 建立一個 Root 節點
const root = ReactDOM.createRoot(document.getElementById("root"));

// 使用新的 render 方法
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);