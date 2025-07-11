import React from "react";
import Navbar from "./Components/Navbar";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import ForgatPassword from "./pages/ForgatPassword";
import UpdatePassword from "./pages/UpdatePassword";
import CreateDocument from "./pages/CreateDocument";
import Dashboard from "./pages/Dashboard";
import DocumentView from "./pages/DocumentView";
import DocumentEditor from "./pages/DocumentEditor";

const App = () => {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgatPassword />} />
        <Route path="/reset-password/:id" element={<UpdatePassword />} />
        <Route path="/document" element={<Dashboard />} />
        <Route path="/document/create" element={<CreateDocument />} />
        <Route path="/edit/:id" element={<DocumentEditor />} />
        <Route path="/documents/:id" element={<DocumentView />} />
      </Routes>
    </div>
  );
};

export default App;
