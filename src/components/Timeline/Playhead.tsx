type PlayheadProps = {
  position: number;
  hidden: boolean;
};

export const Playhead = ({ position, hidden }: PlayheadProps) => {
  return (
    <div
      className="absolute left-[316px] h-full border-l-2 border-solid border-yellow-600 z-10"
      data-testid="playhead"
      style={{ transform: `translateX(calc(${position}px - 50%))` }}
      hidden={hidden}
    >
      <div className="absolute border-solid border-[5px] border-transparent border-t-yellow-600 -translate-x-1.5" />
    </div>
  );
};
