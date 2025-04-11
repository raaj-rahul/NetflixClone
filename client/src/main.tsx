import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Add polyfills and global styles
import "tailwindcss/tailwind.css";

// Create a style element to hide scrollbar
const styleElement = document.createElement('style');
styleElement.textContent = `
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
  
  body {
    overflow-x: hidden;
    background-color: #141414;
    color: white;
    font-family: 'Inter', sans-serif;
  }
`;
document.head.appendChild(styleElement);

createRoot(document.getElementById("root")!).render(<App />);
