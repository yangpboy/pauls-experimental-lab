import { useEffect, useRef, useState } from 'react';

type HeadAction = () => void;

type LowPerformanceHeadProps = {
  theme?: 'dark' | 'light';
  onModelEnter?: (label: string) => void;
  onModelLeave?: HeadAction;
  onModelClick?: HeadAction;
  onAboutClick?: HeadAction;
};

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

export default function LowPerformanceHead({
  theme = 'light',
  onModelEnter,
  onModelLeave,
  onModelClick,
  onAboutClick,
}: LowPerformanceHeadProps) {
  const navigationTimeoutRef = useRef<number | null>(null);
  const resetTimeoutRef = useRef<number | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  useEffect(() => {
    return () => {
      if (navigationTimeoutRef.current) window.clearTimeout(navigationTimeoutRef.current);
      if (resetTimeoutRef.current) window.clearTimeout(resetTimeoutRef.current);
      document.body.style.cursor = 'auto';
    };
  }, []);

  const handlePointerMove = (event: React.PointerEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;

    setTilt({ x: clamp(x, -1, 1), y: clamp(y, -1, 1) });
  };

  const handlePointerEnter = () => {
    setIsHovered(true);
    document.body.style.cursor = 'pointer';
    onModelEnter?.('About');
  };

  const handlePointerLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
    document.body.style.cursor = 'auto';
    onModelLeave?.();
  };

  const handleClick = () => {
    if (isClicked || navigationTimeoutRef.current) return;

    setIsClicked(true);
    document.body.style.cursor = 'progress';

    navigationTimeoutRef.current = window.setTimeout(() => {
      navigationTimeoutRef.current = null;
      (onAboutClick ?? onModelClick)?.();

      resetTimeoutRef.current = window.setTimeout(() => {
        resetTimeoutRef.current = null;
        setIsClicked(false);
        document.body.style.cursor = 'auto';
      }, 350);
    }, 1000);
  };

  const aboutMeIcon = theme === 'dark' ? '/icons/ABOUT ME_w.png' : '/icons/ABOUT ME_b.png';

  return (
    <div className="relative h-full w-full">
      {isHovered && (
        <div className="pointer-events-none absolute left-[66%] top-[66%] z-30 md:left-[78%] md:top-[68%]">
          <img
            src={aboutMeIcon}
            alt="About me"
            className="w-[min(52vw,280px)] max-w-none drop-shadow-[8px_8px_0_rgba(43,43,43,0.18)]"
          />
        </div>
      )}

      <button
        type="button"
        aria-label="About Paul"
        className="absolute left-1/2 top-1/2 w-[min(150vw,760px)] touch-none border-0 bg-transparent p-0 outline-none md:w-[min(58vw,860px)]"
        style={{ transform: 'translate(-51%, -70%)' }}
        onClick={handleClick}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        onPointerMove={handlePointerMove}
      >
        <img
          src="/icons/svg/low-performance-head.svg"
          alt=""
          draggable={false}
          className={`h-auto w-full select-none transition duration-300 ${
            isClicked ? 'brightness-125 drop-shadow-[0_0_30px_rgba(219,95,75,0.7)]' : ''
          }`}
          style={{
            transform: `perspective(900px) rotateX(${-tilt.y * 5}deg) rotateY(${tilt.x * 7}deg) scale(${isClicked ? 1.045 : isHovered ? 1.015 : 1})`,
            transition: isHovered ? 'transform 90ms linear' : 'transform 420ms ease',
          }}
        />
      </button>
    </div>
  );
}
