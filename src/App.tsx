import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';

const Presentation = lazy(() => import('./pages/Presentation'));
const Travail = lazy(() => import('./pages/Travail'));

export default function App(): JSX.Element {
  return (
    <Layout>
      <Suspense fallback={<div className="min-h-[50vh] flex items-center justify-center text-muted">Loading…</div>}>
        <Routes>
          <Route path="/" element={<Presentation />} />
          <Route path="/workspace" element={<Travail />} />
        </Routes>
      </Suspense>
    </Layout>
  );
}
