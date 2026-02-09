import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function SinglePalmFrond({
  id,
  flip,
  className,
  paths,
}: {
  id: string;
  flip: boolean;
  className: string;
  paths: string[];
}): JSX.Element {
  const gradId = `palmGrad-${id}`;
  return (
    <div className={`pointer-events-none select-none ${className}`}>
      <svg
        viewBox="0 0 180 900"
        preserveAspectRatio="xMinYMid meet"
        className="h-full w-full"
        style={{ transform: flip ? 'scaleX(-1)' : undefined }}
      >
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#14532d" />
            <stop offset="50%" stopColor="#166534" />
            <stop offset="100%" stopColor="#22c55e" />
          </linearGradient>
        </defs>
        {paths.map((d, i) => (
          <path key={i} d={d} fill={`url(#${gradId})`} opacity={0.75 + (i % 3) * 0.05} />
        ))}
      </svg>
    </div>
  );
}

const frondPaths = [
  'M90 80 Q0 200 -10 400 Q-5 600 40 750 Q90 650 90 500 L90 80',
  'M90 180 Q5 280 0 480 Q10 680 50 820 Q90 720 90 580 L90 180',
  'M90 300 Q170 380 175 560 Q180 740 130 860 Q90 760 90 620 L90 300',
  'M90 420 Q10 500 5 660 Q0 820 45 900 Q90 820 90 700 L90 420',
  'M90 540 Q175 620 178 780 Q181 900 125 900 Q90 850 90 750 L90 540',
];

function PalmsChaos(): JSX.Element {
  return (
    <>
      <SinglePalmFrond id="a" flip={false} paths={frondPaths} className="absolute -left-8 sm:-left-16 top-[5%] h-[45%] sm:h-[55%] w-20 sm:w-40 opacity-70 sm:opacity-90 -rotate-12 scale-90 sm:scale-110" />
      <SinglePalmFrond id="b" flip={true} paths={frondPaths} className="absolute -left-4 sm:-left-8 top-[32%] sm:top-[35%] h-[40%] sm:h-[50%] w-16 sm:w-36 opacity-60 sm:opacity-80 rotate-6 scale-75 sm:scale-95 hidden sm:block" />
      <SinglePalmFrond id="c" flip={false} paths={frondPaths} className="absolute left-0 top-[58%] sm:top-[60%] h-[38%] sm:h-[45%] w-14 sm:w-32 opacity-65 sm:opacity-85 -rotate-3 hidden md:block" />
      <SinglePalmFrond id="d" flip={true} paths={frondPaths} className="absolute -right-10 sm:-right-20 top-[8%] sm:top-[10%] h-[50%] sm:h-[60%] w-24 sm:w-44 opacity-70 sm:opacity-90 rotate-[14deg] scale-90 sm:scale-105" />
      <SinglePalmFrond id="e" flip={false} paths={frondPaths} className="absolute right-0 top-[38%] sm:top-[40%] h-[40%] sm:h-[48%] w-20 sm:w-38 opacity-60 sm:opacity-80 -rotate-8 scale-75 sm:scale-95 hidden sm:block" />
      <SinglePalmFrond id="f" flip={true} paths={frondPaths} className="absolute -right-6 sm:-right-12 top-[62%] sm:top-[65%] h-[35%] sm:h-[42%] w-16 sm:w-34 opacity-55 sm:opacity-75 rotate-2 scale-90 sm:scale-110 hidden md:block" />
    </>
  );
}

function CausticsLayer(): JSX.Element {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <svg className="absolute inset-0 w-full h-full opacity-[0.14]" viewBox="0 0 200 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="causticBlur">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <g fill="rgba(255,255,255,0.5)" filter="url(#causticBlur)">
          <ellipse cx="30" cy="70" rx="56" ry="12" opacity="0.6" />
          <ellipse cx="170" cy="60" rx="44" ry="10" opacity="0.5" />
          <path d="M0 50 Q25 30 50 50 T100 45 T150 55 T200 50 V100 H0 Z" opacity="0.4" />
          <ellipse cx="100" cy="85" rx="80" ry="8" opacity="0.5" />
          <ellipse cx="140" cy="25" rx="30" ry="18" opacity="0.45" />
          <ellipse cx="50" cy="35" rx="40" ry="14" opacity="0.45" />
          <path d="M30 0 Q50 20 30 40 Q10 20 30 0" opacity="0.35" transform="translate(40, 15) scale(4)" />
          <path d="M0 0 Q40 30 0 60 Q-20 30 0 0" opacity="0.35" transform="translate(150, 55) scale(3)" />
        </g>
      </svg>
      <svg className="absolute inset-0 w-full h-full opacity-[0.08]" xmlns="http://www.w3.org/2000/svg">
        <g fill="rgba(200,240,255,0.6)">
          <ellipse cx="90%" cy="75%" rx="25%" ry="15%" />
          <ellipse cx="10%" cy="55%" rx="20%" ry="18%" />
          <ellipse cx="60%" cy="90%" rx="35%" ry="10%" />
        </g>
      </svg>
    </div>
  );
}

export default function Presentation(): JSX.Element {
  const [offline, setOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const onOnline = () => setOffline(false);
    const onOffline = () => setOffline(true);
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
    return () => {
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
    };
  }, []);

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      <main className="flex-1 relative pt-6 pb-16 sm:pt-12 sm:pb-24 px-4 sm:px-6 md:px-8 overflow-visible min-h-[380px] sm:min-h-[500px] bg-gradient-to-b from-ocean-deep from-10% via-ocean-blue via-40% to-ocean to-90%">
        <CausticsLayer />
        <PalmsChaos />

        <div className="relative z-10 max-w-[720px] mx-auto text-center w-full min-w-0">
          <h1
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-3 sm:mb-4 text-white break-words"
            style={{ textShadow: '0 2px 12px rgba(0,0,0,0.6), 0 0 32px rgba(0,0,0,0.35)' }}
          >
            epstein-👁️-matic
          </h1>
          <p
            className="text-lg sm:text-xl md:text-2xl font-medium mb-8 sm:mb-14 text-[#fefce8] px-1"
            style={{ textShadow: '0 2px 8px rgba(0,0,0,0.5), 0 1px 3px rgba(0,0,0,0.4)' }}
          >
            Turn your memories into crimes
          </p>

          <p
            className="text-base sm:text-lg mb-8 sm:mb-10 max-w-xl mx-auto text-white px-1"
            style={{ textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}
          >
            Detect people in your photos, click to hide whoever you want, download the image.
            All in the browser. No data sent anywhere.
          </p>

          <section className="mb-8 sm:mb-12 text-center">
            <h2
              className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-white"
              style={{ textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}
            >
              Before / After
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6 max-w-2xl mx-auto min-w-0">
              <div className="rounded-box overflow-hidden border-2 border-white/30 shadow-xl bg-ocean-dark/50 min-w-0">
                <img
                  src="/photo.jpg"
                  alt="Original photo"
                  className="w-full h-auto block object-contain sm:object-cover aspect-auto"
                />
                <p className="py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-sand-light bg-ocean-dark/80" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.4)' }}>
                  Before
                </p>
              </div>
              <div className="rounded-box overflow-hidden border-2 border-white/30 shadow-xl bg-ocean-dark/50 min-w-0">
                <img
                  src="/epsteined_photo.png"
                  alt="Processed photo with masked people"
                  className="w-full h-auto block object-contain sm:object-cover aspect-auto"
                />
                <p className="py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-sand-light bg-ocean-dark/80" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.4)' }}>
                  After
                </p>
              </div>
            </div>
          </section>

          <section className="grid gap-3 sm:gap-5 mb-8 sm:mb-12 text-left">
            <div
              className="rounded-box p-4 sm:p-6 flex gap-3 sm:gap-4 items-start border border-white/25 shadow-xl border-l-4 border-l-palm-light bg-ocean-dark/70 backdrop-blur-sm"
              style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.25)' }}
            >
              <span className="text-2xl sm:text-3xl shrink-0" aria-hidden>🔒</span>
              <div className="min-w-0">
                <h2 className="text-base sm:text-lg font-semibold mb-1 sm:mb-1.5 text-white" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.4)' }}>100% offline</h2>
                <p className="text-sm sm:text-[0.95rem] text-white/95 leading-snug" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}>
                  After the first load, everything works without a connection. No image is ever sent to a server.
                </p>
              </div>
            </div>
            <div
              className="rounded-box p-4 sm:p-6 flex gap-3 sm:gap-4 items-start border border-white/25 shadow-xl border-l-4 border-l-tropical bg-ocean-dark/70 backdrop-blur-sm"
              style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.25)' }}
            >
              <span className="text-2xl sm:text-3xl shrink-0" aria-hidden>👁️</span>
              <div className="min-w-0">
                <h2 className="text-base sm:text-lg font-semibold mb-1 sm:mb-1.5 text-white" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.4)' }}>Clickable frames</h2>
                <p className="text-sm sm:text-[0.95rem] text-white/95 leading-snug" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}>
                  People are detected automatically. A frame appears around each; click to hide or show them, then download the result.
                </p>
              </div>
            </div>
            <div
              className="rounded-box p-4 sm:p-6 flex gap-3 sm:gap-4 items-start border border-white/25 shadow-xl border-l-4 border-l-coral bg-ocean-dark/70 backdrop-blur-sm"
              style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.25)' }}
            >
              <span className="text-2xl sm:text-3xl shrink-0" aria-hidden>⬇️</span>
              <div className="min-w-0">
                <h2 className="text-base sm:text-lg font-semibold mb-1 sm:mb-1.5 text-white" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.4)' }}>One-click download</h2>
                <p className="text-sm sm:text-[0.95rem] text-white/95 leading-snug" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}>
                  Preview your epsteined photo and download it in one click.
                </p>
              </div>
            </div>
          </section>

          <Link
            to="/workspace"
            className="inline-block w-full sm:w-auto bg-sand text-ocean-dark px-6 sm:px-8 py-3.5 sm:py-4 rounded-box font-bold text-base sm:text-lg transition-all hover:bg-sand-light hover:text-ocean-deep shadow-lg hover:shadow-xl border-2 border-sand-dark/50 text-center min-h-[48px] flex items-center justify-center"
            style={{ textShadow: '0 1px 2px rgba(255,255,255,0.3)' }}
          >
            Get started →
          </Link>

          {offline && (
            <p className="mt-6 sm:mt-8 text-xs sm:text-sm text-white/90 px-2" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.4)' }}>
              Offline mode active. The tool is still usable.
            </p>
          )}
        </div>
      </main>

      <footer className="relative mt-auto">
        <div className="relative w-full overflow-hidden">
          <svg
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            className="relative w-full h-10 sm:h-12 md:h-16 fill-sand-dark"
          >
            <path d="M0,64 C300,120 600,0 900,64 C1050,96 1150,80 1200,64 L1200,120 L0,120 Z" className="opacity-90" />
            <path d="M0,80 C250,40 550,100 900,80 C1050,72 1150,88 1200,80 L1200,120 L0,120 Z" className="opacity-70" />
          </svg>
        </div>
        <div className="bg-gradient-to-b from-sand-dark to-sand min-h-[5rem] sm:min-h-[6rem] md:min-h-[8rem] pt-6 pb-6 sm:pt-8 sm:pb-8 flex items-center justify-center px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
          <p className="text-sand-ink text-xs sm:text-sm font-semibold text-center break-words">
            epstein-👁️-matic · paradise edition ·{' '}
            <a
              href="https://github.com/monsieurpigeon/epsteinomatic"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-sand-ink/80 transition-colors"
            >
              GitHub
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
