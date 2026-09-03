import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes, useParams } from 'react-router-dom'
import { backgroundMusicPath } from '../config/audio'
import { LandingPage } from '../features/landing/LandingPage'
import { PwaControls } from '../features/pwa/PwaControls'
import { normalizeLocale } from '../shared/language'

const ClassicPage = lazy(() =>
  import('../features/classic/ClassicPage').then((module) => ({
    default: module.ClassicPage,
  })),
)

const AdventurePage = lazy(() =>
  import('../features/adventure/AdventurePage').then((module) => ({
    default: module.AdventurePage,
  })),
)

const AudioControls = backgroundMusicPath
  ? lazy(() => import('../features/audio/AudioControls').then((module) => ({
      default: module.AudioControls,
    })))
  : null

export function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/:locale/classic"
          element={
            <Suspense fallback={<RouteLoader />}>
              <ClassicPage />
            </Suspense>
          }
        />
        <Route
          path="/:locale/adventure"
          element={
            <Suspense fallback={<RouteLoader />}>
              <AdventurePage />
            </Suspense>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <PwaControls />
      {AudioControls && (
        <Suspense fallback={null}>
          <AudioControls />
        </Suspense>
      )}
    </>
  )
}

function RouteLoader() {
  const params = useParams()
  const locale = normalizeLocale(params.locale)
  return (
    <main className="route-loader" aria-live="polite">
      <span className="pixel-spinner" aria-hidden="true" />
      <p>{locale === 'fr' ? 'Chargement…' : 'Loading…'}</p>
    </main>
  )
}
