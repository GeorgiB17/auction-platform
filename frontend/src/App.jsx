import './App.css'
import Login from './components/Login.tsx'
import { Routes, Route } from "react-router-dom";
import Home from './components/Home.tsx';
import Dashboard from './components/admin/Dashboard.tsx';
import AuctionDetail from './components/auctions/AuctionDetail.tsx';
import ProtectedRoute from './components/ProtectedRoute.tsx';
import MainLayout from './components/layout/MainLayout.tsx';
import MyBids from './components/auctions/MyBids.tsx';
import { Auctions } from './components/admin/Auctions.tsx';
import EditAuction from './components/admin/EditAuction.tsx';

function App() {
  return (
    <Routes>
      {/* ROUTES WITH LAYOUT */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />

        <Route
          path="/auctiondetails/:id"
          element={<AuctionDetail />}
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute roles={"MITARBEITER"}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/mybids" element={ <MyBids></MyBids>}> </Route>
        <Route
          path="/dashboard/auctions"
          element={
            <ProtectedRoute roles={"MITARBEITER"}>
              <Auctions />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/auctions/:id/edit"
          element={
            <ProtectedRoute roles={"MITARBEITER"}>
              <EditAuction />
            </ProtectedRoute>
          }
        />
      </Route>
      

      {/* ROUTES WITHOUT LAYOUT */}
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}

export default App;