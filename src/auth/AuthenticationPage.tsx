import { SignedIn, SignedOut } from "@clerk/clerk-react"
import { Navigate, Outlet } from "react-router-dom"

export const AuthenticationPage = () => {
  return (
    <>
      <SignedIn>
        <Outlet />
      </SignedIn>
      <SignedOut>
        <Navigate to="/login" replace />
      </SignedOut>
    </>
  );
};