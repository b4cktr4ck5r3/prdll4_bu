import { FC, useMemo } from "react";

export type IconProps = {
  className?: string;
  hidden?: boolean;
  onClick?: () => void;
  size?: number | { width: number; height: number };
};

type BaseIconProps = IconProps & {
  viewBox: string;
  defaultSize: number | { width: number; height: number };
  fill?: string;
};

export const BaseIcon: FC<BaseIconProps> = ({
  children,
  className,
  defaultSize,
  fill = "none",
  hidden,
  onClick,
  size,
  viewBox,
}) => {
  const [height, width] = useMemo(() => {
    const sizeValue = size || defaultSize;
    return typeof sizeValue === "number"
      ? [sizeValue, sizeValue]
      : [sizeValue?.height, sizeValue?.width];
  }, [defaultSize, size]);
  return (
    <svg
      className={className}
      visibility={hidden ? "hidden" : "visible"}
      onClick={onClick}
      width={width.toString()}
      height={height.toString()}
      viewBox={viewBox}
      fill={fill}
      xmlns="http://www.w3.org/2000/svg"
    >
      {children}
    </svg>
  );
};
