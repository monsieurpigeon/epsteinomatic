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
      <SinglePalmFrond id="a" flip={false} paths={frondPaths} className="absolute -left-16 top-[5%] h-[55%] w-40 opacity-90 -rotate-12 scale-110" />
      <SinglePalmFrond id="b" flip={true} paths={frondPaths} className="absolute -left-8 top-[35%] h-[50%] w-36 opacity-80 rotate-6 scale-95" />
      <SinglePalmFrond id="c" flip={false} paths={frondPaths} className="absolute left-0 top-[60%] h-[45%] w-32 opacity-85 -rotate-3 scale-100" />
      <SinglePalmFrond id="d" flip={true} paths={frondPaths} className="absolute -right-20 top-[10%] h-[60%] w-44 opacity-90 rotate-[14deg] scale-105" />
      <SinglePalmFrond id="e" flip={false} paths={frondPaths} className="absolute right-0 top-[40%] h-[48%] w-38 opacity-80 -rotate-8 scale-95" />
      <SinglePalmFrond id="f" flip={true} paths={frondPaths} className="absolute -right-12 top-[65%] h-[42%] w-34 opacity-75 rotate-2 scale-110" />
    </>
  );
}

function CausticsLayer(): JSX.Element {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <svg className="absolute inset-0 w-full h-full opacity-[0.14]" xmlns="http://www.w3.org/2000/svg">
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
          <ellipse cx="15%" cy="70%" rx="28%" ry="12%" opacity="0.6" />
          <ellipse cx="85%" cy="60%" rx="22%" ry="10%" opacity="0.5" />
          <path d="M0 50 Q25 30 50 50 T100 45 T150 55 T200 50 V100 H0 Z" opacity="0.4" />
          <ellipse cx="50%" cy="85%" rx="40%" ry="8%" opacity="0.5" />
          <ellipse cx="70%" cy="25%" rx="15%" ry="18%" opacity="0.45" />
          <ellipse cx="25%" cy="35%" rx="20%" ry="14%" opacity="0.45" />
          <path d="M30 0 Q50 20 30 40 Q10 20 30 0" opacity="0.35" transform="translate(20%, 15%) scale(4)" />
          <path d="M0 0 Q40 30 0 60 Q-20 30 0 0" opacity="0.35" transform="translate(75%, 55%) scale(3)" />
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
      <main className="flex-1 relative pt-12 pb-24 px-6 overflow-visible min-h-[500px] bg-gradient-to-b from-ocean-deep from-10% via-ocean-blue via-40% to-ocean to-90%">
        {/* Caustics overlay */}
        <CausticsLayer />

        {/* Chaotic palms - can overflow */}
        <PalmsChaos />

        <div className="relative z-10 max-w-[720px] mx-auto text-center">
          <h1
            className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-4 text-white"
            style={{ textShadow: '0 2px 12px rgba(0,0,0,0.6), 0 0 32px rgba(0,0,0,0.35)' }}
          >
            epstein-👁️-matic
          </h1>
          <p
            className="text-xl sm:text-2xl font-medium mb-14 text-[#fefce8]"
            style={{ textShadow: '0 2px 8px rgba(0,0,0,0.5), 0 1px 3px rgba(0,0,0,0.4)' }}
          >
            Turn your memories into crimes
          </p>

          <p
            className="text-lg mb-10 max-w-xl mx-auto text-white"
            style={{ textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}
          >
            Detect people in your photos, click to hide whoever you want, download the image.
            All in the browser. No data sent anywhere.
          </p>

          {/* Before / After */}
          <section className="mb-12 text-center">
            <h2
              className="text-xl font-semibold mb-4 text-white"
              style={{ textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}
            >
              Before / After
            </h2>
            <div className="grid grid-cols-2 gap-3 sm:gap-6 max-w-2xl mx-auto">
              <div className="rounded-box overflow-hidden border-2 border-white/30 shadow-xl bg-ocean-dark/50">
                <img
                  src="/photo.jpg"
                  alt="Original photo"
                  className="w-full h-auto block object-cover aspect-[3/4] sm:aspect-auto"
                />
                <p className="py-2 text-sm font-medium text-sand-light bg-ocean-dark/80" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.4)' }}>
                  Before
                </p>
              </div>
              <div className="rounded-box overflow-hidden border-2 border-white/30 shadow-xl bg-ocean-dark/50">
                <img
                  src="/epsteined_photo.png"
                  alt="Processed photo with masked people"
                  className="w-full h-auto block object-cover aspect-[3/4] sm:aspect-auto"
                />
                <p className="py-2 text-sm font-medium text-sand-light bg-ocean-dark/80" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.4)' }}>
                  After
                </p>
              </div>
            </div>
          </section>

          <section className="grid gap-5 mb-12 text-left">
            <div
              className="rounded-box p-6 flex gap-4 items-start border border-white/25 shadow-xl border-l-4 border-l-palm-light bg-ocean-dark/70 backdrop-blur-sm"
              style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.25)' }}
            >
              <span className="text-3xl shrink-0" aria-hidden>🔒</span>
              <div>
                <h2 className="text-lg font-semibold mb-1.5 text-white" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.4)' }}>100% offline</h2>
                <p className="text-[0.95rem] text-white/95" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}>
                  After the first load, everything works without a connection. No image is ever sent to a server.
                </p>
              </div>
            </div>
            <div
              className="rounded-box p-6 flex gap-4 items-start border border-white/25 shadow-xl border-l-4 border-l-tropical bg-ocean-dark/70 backdrop-blur-sm"
              style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.25)' }}
            >
              <span className="text-3xl shrink-0" aria-hidden>👁️</span>
              <div>
                <h2 className="text-lg font-semibold mb-1.5 text-white" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.4)' }}>Clickable frames</h2>
                <p className="text-[0.95rem] text-white/95" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}>
                  People are detected automatically. A frame appears around each; click to hide or show them, then download the result.
                </p>
              </div>
            </div>
            <div
              className="rounded-box p-6 flex gap-4 items-start border border-white/25 shadow-xl border-l-4 border-l-coral bg-ocean-dark/70 backdrop-blur-sm"
              style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.25)' }}
            >
              <span className="text-3xl shrink-0" aria-hidden>⬇️</span>
              <div>
                <h2 className="text-lg font-semibold mb-1.5 text-white" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.4)' }}>One-click download</h2>
                <p className="text-[0.95rem] text-white/95" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}>
                  Preview your epsteined photo and download it in one click.
                </p>
              </div>
            </div>
          </section>

          <Link
            to="/workspace"
            className="inline-block bg-sand text-ocean-dark px-8 py-4 rounded-box font-bold text-lg transition-all hover:bg-sand-light hover:text-ocean-deep shadow-lg hover:shadow-xl border-2 border-sand-dark/50"
            style={{ textShadow: '0 1px 2px rgba(255,255,255,0.3)' }}
          >
            Get started →
          </Link>

          {offline && (
            <p className="mt-8 text-sm text-white/90" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.4)' }}>
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
            className="relative w-full h-12 sm:h-16 fill-sand-dark"
          >
            <path d="M0,64 C300,120 600,0 900,64 C1050,96 1150,80 1200,64 L1200,120 L0,120 Z" className="opacity-90" />
            <path d="M0,80 C250,40 550,100 900,80 C1050,72 1150,88 1200,80 L1200,120 L0,120 Z" className="opacity-70" />
          </svg>
        </div>
        <div className="bg-gradient-to-b from-sand-dark to-sand h-24 sm:h-32 flex items-center justify-center">
          <p className="text-sand-ink text-sm font-semibold">
            epstein-👁️-matic · paradise edition
          </p>
        </div>
      </footer>
    </div>
  );
}
