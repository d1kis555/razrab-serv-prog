import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ClinicsPage from './ClinicsPage';
import DoctorsPage from './DoctorsPage';
import MedicationsPage from './MedicationsPage';
import SchedulePage from './SchedulePage';

export default function AdminRouter() {
  return (
    <Routes>
      <Route index element={<Navigate to="clinics" replace />} />
      <Route path="clinics" element={<ClinicsPage />} />
      <Route path="clinics/:clinicId/doctors" element={<DoctorsPage />} />
      <Route path="clinics/:clinicId/medications" element={<MedicationsPage />} />
      <Route path="doctors/:doctorId/schedule" element={<SchedulePage />} />
    </Routes>
  );
}
