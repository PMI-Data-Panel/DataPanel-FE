import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// import 컴포넌트
import LoginPage from './pages/LoginPage/LoginPage';
import AttendanceDashboard from './pages/AttendanceDashboard/AttendanceDashboard';
import Layout from './components/Layout/Layout';

// import 스타일
import './styles/globals.css';

function App() {
  return (
    <Router>
      <Routes>

        { /* 로그인 페이지 */}
        <Route path="/" element={<LoginPage />} />

        { /* 대시보드 페이지 */ }
        <Route
          path="/dashboard"
          element={
            <Layout>
              <AttendanceDashboard />
            </Layout>
          }
        />

      </Routes>
    </Router>
  );
}

export default App;