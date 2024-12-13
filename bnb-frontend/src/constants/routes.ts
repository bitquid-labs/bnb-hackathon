import {lazy} from 'react';

import IconDashboard from '../assets/icons/IconDashboard';
import IconStrategyManager from '../assets/icons/IconStrategyManager';
import IconMyAssets from '../assets/icons/IconMyAssets';
import IconCovers from 'assets/icons/IconCovers';

const DashboardPage = lazy(() => import('../pages/DashboardPage'));
const StrategyManagerPage = lazy(() => import ('../pages/StrategyManagerPage'));
const MyAssetsPage = lazy(() => import ('../pages/MyAssetsPage'));
const CoversPage = lazy(() => import ('../pages/CoversPage'));

enum AppRoutes {
  Dashboard = '/dashboard',
  StrategyManger = '/strategymanager',
  MyAssetsPage = '/myassets',
  CoversPage = '/covers',
}

export const appRoutes = [
  {key: 'Dashboard', path: AppRoutes.Dashboard, element: DashboardPage},
  {key: 'StrategyManger', path: AppRoutes.StrategyManger, element: StrategyManagerPage},
  {key: 'MyAssetsPage', path: AppRoutes.MyAssetsPage, element: MyAssetsPage},
  {key: 'covers', path: AppRoutes.CoversPage, element: CoversPage},
];

export const headerLinks = [
  {name: 'dashboard', url: AppRoutes.Dashboard, icon: IconDashboard},
  {name: 'Covers', url: AppRoutes.CoversPage, icon: IconCovers},
  {name: 'strategymanager', url: AppRoutes.StrategyManger, icon: IconStrategyManager},
  {name: 'myassets', url: AppRoutes.MyAssetsPage, icon: IconMyAssets},
];
