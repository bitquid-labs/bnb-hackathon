import React, { Suspense } from "react";
import {
  Navigate,
  Route,
  Routes,
  BrowserRouter as Router,
} from "react-router-dom";
import "./App.css";
import MainLayout from "./views/MainLayout";
import { appRoutes } from "./constants/routes";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          {appRoutes.map((item) => (
            <Route
              key={item.key}
              path={item.path}
              element={
                <Suspense fallback={null}>
                  {item.element && <item.element />}
                </Suspense>
              }
            />
          ))}
          <Route path="/" element={<Navigate to={"/dashboard"} />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;
