import React from "react";
import Header from './components/Header' ;
import Footer from './components/Footer';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import './styles/Dashboard.css'; 
import "./styles/Header.css"; 
import "./styles/Footer.css"; 
import "./styles/Home.css";
import "./styles/About.css";
import Home from "./pages/home";
import About from "./pages/About";
import Admin from "./pages/Admin";
import Landing from "./pages/Landing";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import "./styles/Admin.css";
import "./styles/Landing.css";
import "./styles/Login.css";
import "./styles/SignUp.css";
// import CreateTicket from "./pages/CreateTicket";
// import MyTickets from "./pages/MyTickets";

function App() {
  return (
    <Router>
     
       <main style={{ padding: "20px", minHeight: "80vh" }}>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/about" element={<About />} />
           <Route path="/admin" element={<Admin />} />
           <Route path="/landing" element={<Landing />} />
            <Route path="/login" element={<Login />} />
             <Route path="/" element={<SignUp />} />
       {/* <Route path="/create" element={<CreateTicket />} />
        <Route path="/tickets" element={<MyTickets />} /> */}
      </Routes>
      </main>
      
    </Router>
  );
}

export default App;
