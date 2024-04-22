import React from "react";

export interface NavItem {
  name: string;
  path: string;
  children: NavItem[];
  icon?: React.ReactNode;
  footer: boolean;
}

export const navItems: NavItem[] = [
  {
    name: "Pokemon",
    path: "/",
    children: [],
    footer: false,
  },
  {
    name: "Your Pokemon",
    path: "/trainer/:trainerId/collection",
    children: [],
    footer: false,
  },
];
