import React from 'react';
import { Link, Outlet } from 'react-router-dom';

export default function AdminLayout() {
  return (
    <div className="container is-fluid">
      <header className="navbar mb-4">
        <div className="navbar-brand">
          <Link to="/admin-panel/clinics" className="navbar-item">
            Админ‑панель
          </Link>
        </div>
        <div className="navbar-end">
          {/* Кнопка «Выйти» */}
        </div>
      </header>

      <section className="section">
        <Outlet />
      </section>
    </div>
  );
}
