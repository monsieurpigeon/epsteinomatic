import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Presentation from './pages/Presentation';
import Travail from './pages/Travail';

export default function App(): JSX.Element {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Presentation />} />
        <Route path="/workspace" element={<Travail />} />
      </Routes>
    </Layout>
  );
}
