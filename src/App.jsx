import { useState, useCallback } from 'react';
import { useWebcam } from './hooks/useWebcam';
import { useProctoringEngine } from './hooks/useProctoringEngine';
import { useSessionTimer } from './hooks/useSessionTimer';
import LandingPage from './components/LandingPage/LandingPage';
import WebcamPanel from './components/WebcamPanel/WebcamPanel';
import StatusPanel from './components/StatusPanel/StatusPanel';
import AlertPanel from './components/AlertPanel/AlertPanel';
import SessionSummary from './components/SessionSummary/SessionSummary';
import EventLog from './components/EventLog/EventLog';
import { MONITORING_STATUS, CAMERA_STATUS } from './utils/constants';

export default function App() {
  const [page, setPage] = useState('landing'); // 'landing' | 'monitor'

  const { videoRef, cameraStatus, startCamera, stopCamera } = useWebcam();
  const {
    monitoringStatus,
    faceStatus,
    gazeStatus,
    lookAwayTimer,
    faceCount,
    events,
    activeAlerts,
    overlayData,
    summary,
    startMonitoring,
    stopMonitoring,
  } = useProctoringEngine(videoRef, cameraStatus);
  const sessionTimer = useSessionTimer();

  const isIdle = monitoringStatus === MONITORING_STATUS.IDLE;
  const isLoading = monitoringStatus === MONITORING_STATUS.LOADING_MODELS;
  const isActive = !isIdle && !isLoading;

  const handleStart = useCallback(async () => {
    const cameraOk = await startCamera();
    if (!cameraOk) return;

    const modelsOk = await startMonitoring();
    if (modelsOk) {
      sessionTimer.start();
    }
  }, [startCamera, startMonitoring, sessionTimer]);

  const handleStop = useCallback(() => {
    stopMonitoring();
    stopCamera();
    sessionTimer.stop();
  }, [stopMonitoring, stopCamera, sessionTimer]);

  const handleGoToMonitor = useCallback(() => {
    setPage('monitor');
  }, []);

  const handleGoBack = useCallback(() => {
    if (isActive) {
      handleStop();
    }
    setPage('landing');
  }, [isActive, handleStop]);

  // --- Landing Page ---
  if (page === 'landing') {
    return <LandingPage onNavigateToMonitor={handleGoToMonitor} />;
  }

  // --- Monitor Page ---
  return (
    <div className="monitor-page">
      {/* Header */}
      <header className="app-header">
        <div className="app-header__brand">
          <button className="app-header__back" onClick={handleGoBack}>
            ← Back
          </button>
          <div className="app-header__logo">EP</div>
          <div>
            <div className="app-header__title">Edge Proctor</div>
            <div className="app-header__subtitle">Monitoring Dashboard</div>
          </div>
        </div>
        <div className="app-header__controls">
          {isActive && (
            <div className="live-badge">
              <div className="pulse-dot" />
              Live — {sessionTimer.elapsedFormatted}
            </div>
          )}
          {isIdle ? (
            <button className="btn btn--primary" onClick={handleStart} disabled={isLoading}>
              ▶ Start Monitoring
            </button>
          ) : (
            <button className="btn btn--danger" onClick={handleStop}>
              ■ Stop
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="app-main">
        {/* Left: Webcam */}
        <div style={{ position: 'relative' }}>
          {/* WebcamPanel is always mounted so videoRef is available when startCamera() runs */}
          <WebcamPanel
            videoRef={videoRef}
            cameraStatus={cameraStatus}
            monitoringStatus={monitoringStatus}
            faceStatus={faceStatus}
            gazeStatus={gazeStatus}
            faceCount={faceCount}
            overlayData={overlayData}
          />

          {/* Loading overlay */}
          {isLoading && (
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 10,
                background: 'rgba(9, 9, 11, 0.92)',
                borderRadius: 16,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div className="loading-overlay">
                <div className="spinner" />
                <div className="loading-overlay__text">
                  Initializing MediaPipe models…<br />
                  <span style={{ fontSize: '0.78rem', opacity: 0.6 }}>
                    First load downloads the model (~5 MB). Subsequent loads use cache.
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right: Status Panels */}
        <div className="side-panel">
          <StatusPanel
            cameraStatus={cameraStatus}
            faceStatus={faceStatus}
            gazeStatus={gazeStatus}
            monitoringStatus={monitoringStatus}
            lookAwayTimer={lookAwayTimer}
          />
          <AlertPanel activeAlerts={activeAlerts} />
          <SessionSummary
            monitoringStatus={monitoringStatus}
            elapsedFormatted={sessionTimer.elapsedFormatted}
            faceCount={faceCount}
            summary={summary}
          />
          <EventLog events={events} />
        </div>
      </main>
    </div>
  );
}
