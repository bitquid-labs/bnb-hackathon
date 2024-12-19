import {lazy} from 'react';

import IconDashboard from '../assets/icons/IconDashboard';
import IconStrategyManager from '../assets/icons/IconStrategyManager';
import IconMyAssets from '../assets/icons/IconMyAssets';
import IconCovers from 'assets/icons/IconCovers';
import CoverDetailPage from 'pages/CoverDetailPage';

const DashboardPage = lazy(() => import('../pages/DashboardPage'));
const StrategyManagerPage = lazy(() => import ('../pages/StrategyManagerPage'));
const MyAssetsPage = lazy(() => import ('../pages/MyAssetsPage'));
const CoversPage = lazy(() => import ('../pages/CoversPage'));
const MyCoversPage = lazy(() => import ('../pages/MyCoversPage'));
const DepositPage = lazy(() => import ('../pages/DepositPage'))

enum AppRoutes {
  Dashboard = '/dashboard',
  MyAssetsPage = '/myassets',
  CoversPage = '/covers',
  CoverDetailPage = '/coverdetail/:id',
  MyCoversPage = '/mycovers',
  DepositPage = '/deposit',
  DepositDetailPage = '/deposit/:id',
}

export const appRoutes = [
  {key: 'Dashboard', path: AppRoutes.Dashboard, element: DashboardPage},
  {key: 'MyAssetsPage', path: AppRoutes.MyAssetsPage, element: MyAssetsPage},
  {key: 'covers', path: AppRoutes.CoversPage, element: CoversPage},
  {key: 'coverdetail', path: AppRoutes.CoverDetailPage, element: CoverDetailPage},
  {key: 'mycovers', path: AppRoutes.MyCoversPage, element: MyCoversPage},
  {key: 'deposit', path: AppRoutes.DepositPage, element: DepositPage},
  {key: 'depositdetail', path: AppRoutes.DepositDetailPage, element: DepositPage},
];

export const headerLinks = [
  {name: 'dashboard', url: AppRoutes.Dashboard, icon: IconDashboard},
  {name: 'Covers', url: AppRoutes.CoversPage, icon: IconCovers},
  // {name: 'strategymanager', url: AppRoutes.StrategyManger, icon: IconStrategyManager},
  {name: 'myassets', url: AppRoutes.MyAssetsPage, icon: IconMyAssets},
  {name: 'mycovers', url: AppRoutes.MyCoversPage, icon: IconMyAssets},
  {name: 'deposit', url: AppRoutes.DepositPage, icon: IconMyAssets},
];
