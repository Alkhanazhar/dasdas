import { useState } from "react";
import "./App.css";
import { Button } from "./components/ui/button";
import Questions from "./Questions";
import axios from "axios";

function App() {
  const [started, setStarted] = useState(false);
  axios.defaults.baseURL = "http://192.168.1.49:8000";

  return (
    <div className="flex justify-center items-center min-h-screen">
      {started ? (
        <Questions />
      ) : (
        <Button onClick={() => setStarted(true)}>Start</Button>
      )}
    </div>
  );
}

export default App;
