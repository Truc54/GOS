import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { DashboardPage } from './pages/DashboardPage';
import { ReportsPage } from './pages/ReportsPage';
import { SearchScoresPage } from './pages/SearchScoresPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="search" element={<SearchScoresPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="*" element={<Navigate to="/search" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
