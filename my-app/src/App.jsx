import React from "react";
import Header from './components/Header' ;
import Footer from './components/Footer';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import './styles/Dashboard.css'; 
import "./styles/Header.css"; 
import "./styles/Footer.css"; 
// import CreateTicket from "./pages/CreateTicket";
// import MyTickets from "./pages/MyTickets";

function App() {
  return (
    <Router>
       <Header />
      <Routes>
        <Route path="/" element={<Dashboard />} />
       {/* <Route path="/create" element={<CreateTicket />} />
        <Route path="/tickets" element={<MyTickets />} /> */}
      </Routes>
      <Footer/>
    </Router>
  );
}

export default App;
