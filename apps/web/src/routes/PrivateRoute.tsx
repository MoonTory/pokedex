import React from "react";
import { Navigate, RoutesProps } from "react-router-dom";

import { useAuth } from "@/context/auth";

export const PrivateRoute: React.FC<React.PropsWithChildren<RoutesProps>> = ({
  location,
  children,
}): React.ReactNode => {
  const { isAuthenticated } = useAuth();

  return isAuthenticated()
    ? children
    : ((<Navigate to="/login" state={{ referer: location }} />) as any);
};
