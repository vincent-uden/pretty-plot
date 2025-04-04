// src/routes/h5viewer.jsx
import { lazy, Suspense } from "solid-js";

// Lazy load the client component
const H5Viewer = lazy(() => import("../components/H5Viewer.client"));

export default function H5ViewerPage() {
  return (
    <main>
      <Suspense fallback={<p>Loading viewer...</p>}>
        <H5Viewer />
      </Suspense>
    </main>
  );
}
