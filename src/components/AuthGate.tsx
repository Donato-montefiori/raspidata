import React from "react";
import { useAuth } from "../hooks/useAuth";
import LoginScreen from "./LoginScreen";
import Game from "./Game";

export default function AuthGate() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="auth-loading">
        <div className="auth-spinner" />
      </div>
    );
  }

  if (!user) {
    return <LoginScreen />;
  }

  return <Game uid={user.uid} />;
}