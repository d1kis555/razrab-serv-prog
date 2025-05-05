import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function AdminDashboard() {
  const [admin, setAdmin] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin/login");
      return;
    }

    axios.get("http://localhost:8000/protected/admin", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => setAdmin(res.data))
      .catch(() => navigate("/admin/login"));
  }, [navigate]);

  if (!admin) return <p className="text-center mt-20">Загрузка...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Админ-панель</h1>
      <p>{admin.message}</p>
    </div>
  );
}
