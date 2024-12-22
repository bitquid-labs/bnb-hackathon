import React, { Dispatch, useEffect, useRef, useState } from "react";

type Props = {
  options: string[];
  value: number;
  handleSwitch?: Dispatch<number>;
};

const SwitchComponent = ({ options, value = 0, handleSwitch }: Props) => {
  const [left, setLeft] = useState<number>(0);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const handleArrowClick = (direct: number): void => {
    const moveStep = 50;
    let newLeft = left + moveStep * direct;
    const wrapperWidth = wrapperRef.current?.offsetWidth || 0;
    if (options.length * 320 < wrapperWidth) return;

    if (newLeft > 0) {
      newLeft = 0;
    } else if (newLeft < (options.length * 320 - wrapperWidth) * -1) {
      newLeft = (options.length * 320 - wrapperWidth) * -1;
    }

    setLeft(newLeft);
  };

  useEffect(() => {
    if (!wrapperRef.current) return;
    const itemWidth = 320;
    const currentLeft = parseInt(wrapperRef.current.style.left) || 0;
    // console.log('current left:', currentLeft)
    wrapperRef.current.style.left = `${-itemWidth * value}px`;
  }, [options, value, wrapperRef.current]);

  return (
    <>
      <div className="bg-[#222] flex w-full cursor-pointer items-center rounded-[10px] p-1 overflow-hidden mt-70">
        <div
          className="wrap relative flex cursor-pointer flex-col items-center rounded-lg md:flex-row md:gap-0"
          style={{
            transform: `translateX(${left}px)`,
          }}
          ref={wrapperRef}
        >
          {options.map((opt, index) => (
            <div
              key={index}
              className={`z-10 w-[320px] py-12 text-center text-16 capitalize transition-all ${value === index ? "text-[#000]" : "text-[#FFF]"}`}
              onClick={() => handleSwitch && handleSwitch(index)}
            >
              {opt}
            </div>
          ))}
          <div
            className={`absolute inset-y-0 hidden rounded-lg bg-white transition-all md:block`}
            style={{
              width: "320px",
              transform: `translateX(${value * 100}%)`,
            }}
          />
          <div
            className={`absolute inset-x-0 rounded-lg bg-white transition-all md:hidden`}
            style={{
              height: `${100 / options.length}%`,
              transform: `translateY(${value * 100}%)`,
            }}
          />
        </div>
      </div>
    </>
  );
};

export default SwitchComponent;