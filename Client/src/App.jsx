import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-blue-500 text-white">
        <h1 className="text-4xl font-bold">Hello, Vite + Tailwind!</h1>
      </div>
    </>
  );
}

export default App;
