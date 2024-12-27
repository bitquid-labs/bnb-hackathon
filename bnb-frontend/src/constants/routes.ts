import { lazy } from "react";

import IconDashboard from '../assets/icons/IconDashboard';
import IconStrategyManager from '../assets/icons/IconStrategyManager';
import IconMyAssets from '../assets/icons/IconMyAssets';
import IconCovers from 'assets/icons/IconCovers';
import CoverDetailPage from 'pages/CoverDetailPage';
import RiskEnginePage from 'pages/RiskEnginePage';
import AnalyseRisk from 'pages/AnalyseRisk';
import IconDeposits from 'assets/icons/IconDeposits';
import IconRiskEngine from 'assets/icons/IconRiskEngine';
import IconHome from "assets/icons/IconHome";

const DashboardPage = lazy(() => import("../pages/DashboardPage"));
const StrategyManagerPage = lazy(() => import("../pages/StrategyManagerPage"));
const MyAssetsPage = lazy(() => import("../pages/MyAssetsPage"));
const CoversPage = lazy(() => import("../pages/CoversPage"));
const MyCoversPage = lazy(() => import("../pages/MyCoversPage"));
const DepositPage = lazy(() => import("../pages/DepositPage"));

enum AppRoutes {
  Dashboard = '/dashboard',
  MyAssetsPage = '/myassets',
  CoversPage = '/covers',
  CoverDetailPage = '/coverdetail/:id',
  SubMyCovers = "/myassets/mycovers",
  DepositPage = '/deposits',
  DepositDetailPage = '/deposit/:id',
  SubDeposits = "/myassets/deposit",
  RiskEnginePage = '/riskengine',
  AnalyseRisk = '/riskengine/analyserisks',
}

export const appRoutes = [
  {key: 'Dashboard', path: AppRoutes.Dashboard, element: DashboardPage},
  {key: 'MyAssetsPage', path: AppRoutes.MyAssetsPage, element: MyAssetsPage},
  {key: 'covers', path: AppRoutes.CoversPage, element: CoversPage},
  {key: 'coverdetail', path: AppRoutes.CoverDetailPage, element: CoverDetailPage},
  {key: 'mycovers', path: AppRoutes.SubMyCovers, element: MyCoversPage},
  { key: "mydeposits", path: AppRoutes.SubDeposits, element: MyAssetsPage },
  {key: 'deposit', path: AppRoutes.DepositPage, element: DepositPage},
  {key: 'depositdetail', path: AppRoutes.DepositDetailPage, element: DepositPage},
  {key: 'riskengine', path: AppRoutes.RiskEnginePage, element: RiskEnginePage},
  {key: 'analyserisks', path: AppRoutes.AnalyseRisk, element: AnalyseRisk},
];

export const headerLinks = [
  { name: "Home", url: AppRoutes.Dashboard, icon: IconHome },
  { name: "Covers", url: AppRoutes.CoversPage, icon: IconCovers },
  // {name: 'strategymanager', url: AppRoutes.StrategyManger, icon: IconStrategyManager},
  {
    name: "Deposits",
    url: AppRoutes.DepositPage,
    icon: IconDeposits,
    subMenus: [
      {
        name: "Pools",
        url: AppRoutes.DepositPage + "?type=0",
      },
      {
        name: "Strategies",
        url: AppRoutes.DepositPage + "?type=1",
      },
    ],
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
  {name: 'Risk Engine', url: AppRoutes.RiskEnginePage, icon: IconRiskEngine},
];
