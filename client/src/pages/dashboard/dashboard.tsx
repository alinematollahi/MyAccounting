import React from "react";
import { useAppSelector } from '../../redux/hooks';
import { Navigate } from "react-router";
import Layout from "./components/layout";

function DashboardPage() {

  const isLoggedIn = useAppSelector(reduxStore => reduxStore.logIn.isLoggedIn)

  if (!isLoggedIn) {
    return <Navigate to="/auth" />
  }
  
  return (
    <Layout />
  );
}

export default DashboardPage;