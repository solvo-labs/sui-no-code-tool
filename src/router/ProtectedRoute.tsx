import React, { useState } from 'react'
import { Navigate, Outlet } from "react-router-dom";
import TopBar from '../components/TopBar';

const ProtectedRoute: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [connected, setConnected] = useState<boolean>(true);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          width: "50vw",
        }}
      >
        Loading
      </div>
    );
  }

  return connected ? (
    <div className='min-h-screen relative'>
      <TopBar />
      <div className='h-[calc(100vh-96px)]'>
        <Outlet />
      </div>
    </div>
  ) : (
    <Navigate to="/login" />
  );
}

export default ProtectedRoute