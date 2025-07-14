import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import UserLanding from "./pages/Landing";
import { Toaster } from "./components/ui/toaster";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<UserLanding />} />
        </Routes>
      </Router>
      <Toaster />
    </>
  );
}

export default App;
