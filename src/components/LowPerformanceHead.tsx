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
    const localX = (event.clientX - rect.left) / rect.width;
    const localY = (event.clientY - rect.top) / rect.height;
    const x = (localX - 0.5) * 2;
    const y = (localY - 0.5) * 2;

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

  const rotateX = -tilt.y * 7;
  const rotateY = tilt.x * 10;
  const parallaxX = tilt.x * 22;
  const parallaxY = tilt.y * 14;
  const aboutMeIcon = theme === 'dark' ? '/icons/ABOUT ME_w.png' : '/icons/ABOUT ME_b.png';

  return (
    <div className="relative flex h-full w-full items-center justify-center">
      {isHovered && (
        <div className="pointer-events-none absolute left-[54%] top-[56%] z-30 md:left-[58%] md:top-[58%]">
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
        className="relative h-[min(78vw,610px)] w-[min(94vw,780px)] touch-none outline-none"
        onClick={handleClick}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        onPointerMove={handlePointerMove}
        style={{
          transform: `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${isClicked ? 1.045 : 1})`,
          transition: isHovered ? 'transform 80ms linear' : 'transform 420ms ease',
        }}
      >
        <div
          className="absolute left-1/2 top-[62%] h-[11%] w-[34%] -translate-x-1/2 rounded-full bg-black/12 blur-xl"
          style={{ transform: `translate(calc(-50% + ${parallaxX * 0.18}px), ${parallaxY * 0.08}px)` }}
        />
        <div
          className={`absolute left-1/2 top-[27%] h-[29%] w-[76%] -translate-x-1/2 rounded-[50%] bg-[#DE5D4E] shadow-[inset_-34px_-24px_35px_rgba(121,37,29,0.16),inset_28px_20px_40px_rgba(255,255,255,0.18),0_18px_26px_rgba(43,43,43,0.12)] transition ${
            isClicked ? 'brightness-125 drop-shadow-[0_0_32px_rgba(222,93,78,0.72)]' : ''
          }`}
          style={{
            transform: `translate(calc(-50% + ${parallaxX}px), ${parallaxY * 0.45}px) rotate(${tilt.x * 1.5}deg)`,
          }}
        >
          <div className="absolute right-[16%] top-[22%] h-[18%] w-[32%] rounded-full bg-white/52 blur-md" />
          <div className="absolute left-[8%] bottom-[10%] h-[26%] w-[42%] rounded-full bg-black/10 blur-lg" />
        </div>
        <div
          className={`absolute left-1/2 top-[42%] h-[30%] w-[22%] -translate-x-1/2 rounded-[48%_48%_44%_44%] bg-[#DE5D4E] shadow-[inset_-18px_-14px_24px_rgba(121,37,29,0.18),inset_15px_12px_20px_rgba(255,255,255,0.12)] transition ${
            isClicked ? 'brightness-125 drop-shadow-[0_0_28px_rgba(222,93,78,0.7)]' : ''
          }`}
          style={{ transform: `translate(calc(-50% + ${parallaxX * 0.45}px), ${parallaxY * 0.25}px)` }}
        >
          <div className="absolute left-1/2 top-[47%] h-[20%] w-[14%] -translate-x-1/2 rounded-full bg-[#B94A3F]/45" />
          <div className="absolute left-[29%] top-[64%] h-[5%] w-[42%] rounded-full bg-[#8E332D]/35" />
          <div className="absolute left-[32%] top-[55%] h-[4%] w-[12%] rounded-full bg-white/20" />
          <div className="absolute right-[32%] top-[55%] h-[4%] w-[12%] rounded-full bg-white/20" />
        </div>
        <div
          className="absolute left-1/2 top-[38%] h-[13%] w-[28%] -translate-x-1/2"
          style={{ transform: `translate(calc(-50% + ${parallaxX * 0.6}px), ${parallaxY * 0.25}px)` }}
        >
          <div className="absolute left-[12%] top-[16%] h-[42%] w-[28%] [clip-path:polygon(50%_0,62%_35%,100%_50%,62%_65%,50%_100%,38%_65%,0_50%,38%_35%)] bg-[#C85246] shadow-[0_0_9px_rgba(255,255,255,0.28)]" />
          <div className="absolute right-[12%] top-[16%] h-[42%] w-[28%] [clip-path:polygon(50%_0,62%_35%,100%_50%,62%_65%,50%_100%,38%_65%,0_50%,38%_35%)] bg-[#C85246] shadow-[0_0_9px_rgba(255,255,255,0.28)]" />
          <div className="absolute left-[39%] top-[34%] h-[8%] w-[22%] rounded-full bg-[#B8473D]" />
        </div>
        <div
          className={`absolute left-1/2 top-[66%] h-[24%] w-[30%] -translate-x-1/2 rounded-[45%_45%_18%_18%] bg-[#DE5D4E] shadow-[inset_-22px_-18px_24px_rgba(121,37,29,0.16),inset_20px_14px_22px_rgba(255,255,255,0.12)] transition ${
            isClicked ? 'brightness-125 drop-shadow-[0_0_24px_rgba(222,93,78,0.62)]' : ''
          }`}
          style={{ transform: `translate(calc(-50% + ${parallaxX * 0.3}px), ${parallaxY * 0.12}px)` }}
        >
          <div className="absolute left-[8%] top-[20%] h-[58%] w-[28%] rotate-[-18deg] rounded-full border-l-[12px] border-[#B94A3F]/45" />
          <div className="absolute right-[8%] top-[20%] h-[58%] w-[28%] rotate-[18deg] rounded-full border-r-[12px] border-[#B94A3F]/45" />
          <div className="absolute left-[24%] top-[70%] h-[10%] w-[52%] rounded-full bg-[#B94A3F]/38" />
        </div>
      </button>
    </div>
  );
}
