import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import CenterDetail from './pages/CenterDetail';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ManageCenter from './pages/ManageCenter';
import DashboardCenter from './pages/DashboardCenter';
import EditCenter from './pages/EditCenter';
import RoomDetail from './pages/RoomDetail';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-slate-50 font-sans text-slate-800 selection:bg-indigo-100 selection:text-indigo-900">
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/center/:id" element={<CenterDetail />} />
              <Route path="/room/:id" element={<RoomDetail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/dashboard/center/new" element={<ManageCenter />} />
              <Route path="/dashboard/center/:id/manage" element={<DashboardCenter />} />
              <Route path="/dashboard/center/:id/edit" element={<EditCenter />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
