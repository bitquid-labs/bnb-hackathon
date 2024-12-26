import { lazy } from "react";

import IconDashboard from "../assets/icons/IconDashboard";
import IconStrategyManager from "../assets/icons/IconStrategyManager";
import IconMyAssets from "../assets/icons/IconMyAssets";
import IconCovers from "assets/icons/IconCovers";
import CoverDetailPage from "pages/CoverDetailPage";
import IconDeposits from "assets/icons/IconDeposits";

const DashboardPage = lazy(() => import("../pages/DashboardPage"));
const StrategyManagerPage = lazy(() => import("../pages/StrategyManagerPage"));
const MyAssetsPage = lazy(() => import("../pages/MyAssetsPage"));
const CoversPage = lazy(() => import("../pages/CoversPage"));
const MyCoversPage = lazy(() => import("../pages/MyCoversPage"));
const DepositPage = lazy(() => import("../pages/DepositPage"));

enum AppRoutes {
  Dashboard = "/dashboard",
  MyAssetsPage = "/myassets",
  CoversPage = "/covers",
  CoverDetailPage = "/coverdetail/:id",
  SubMyCovers = "/myassets/mycovers",
  DepositPage = "/deposits",
  DepositDetailPage = "/deposit/:id",
  SubDeposits = "/myassets/deposit",
}

export const appRoutes = [
  { key: "Dashboard", path: AppRoutes.Dashboard, element: DashboardPage },
  {
    key: "MyAssetsPage",
    path: AppRoutes.MyAssetsPage,
    element: MyAssetsPage,
  },
  { key: "covers", path: AppRoutes.CoversPage, element: CoversPage },
  {
    key: "coverdetail",
    path: AppRoutes.CoverDetailPage,
    element: CoverDetailPage,
  },
  { key: "mycovers", path: AppRoutes.SubMyCovers, element: MyCoversPage },
  { key: "mydeposits", path: AppRoutes.SubDeposits, element: MyAssetsPage },
  { key: "deposit", path: AppRoutes.DepositPage, element: DepositPage },
  {
    key: "depositdetail",
    path: AppRoutes.DepositDetailPage,
    element: DepositPage,
  },
];

export const headerLinks = [
  { name: "Home", url: AppRoutes.Dashboard, icon: IconDashboard },
  { name: "Covers", url: AppRoutes.CoversPage, icon: IconCovers },
  // {name: 'strategymanager', url: AppRoutes.StrategyManger, icon: IconStrategyManager},
  {
    name: "Deposits",
    url: AppRoutes.DepositPage,
    icon: IconDeposits,
  },
  {
    name: "My Assets",
    url: AppRoutes.MyAssetsPage,
    icon: IconMyAssets,
    subMenus: [
      {
        name: "My Covers",
        url: AppRoutes.SubMyCovers,
      },
      {
        name: "Deposits",
        url: AppRoutes.SubDeposits,
      },
    ],
  },
];
