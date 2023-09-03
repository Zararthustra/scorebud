import { IIcon } from '@interfaces/index';

const IconHome = ({
  width = 24,
  height = 24,
  className = '',
  onClick,
  color,
  style
}: IIcon) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    onClick={onClick}
    className={className}
    style={style}
    fill="none"
    stroke={color ? color : 'currentColor'}
    viewBox="0 0 24 24">
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <path d="M9 22V12h6v10" />
  </svg>
);

export default IconHome;
