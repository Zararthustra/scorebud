import { IIcon } from '@interfaces/index';

const IconDiamond = ({
  width = 24,
  height = 24,
  className = '',
  style,
  color,
  onClick
}: IIcon) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    onClick={onClick}
    className={className}
    style={style}
    fill={color ?? 'currentColor'}
    viewBox="0 0 18 25">
    <path d="M17.5 12.5L8.75 25L0 12.5L8.75 0" />
  </svg>
);

export default IconDiamond;
