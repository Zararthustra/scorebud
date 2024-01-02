import { IIcon } from '@interfaces/index';

const IconSpade = ({
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
    viewBox="0 0 20 25">
    <path d="M10 0C6.25 6.25 0 8.75 0 15C0 17.5 2.5 20 5 20C6.25 20 7.5 20 8.75 18.75C8.75 18.75 9.15 21.25 6.25 25H13.75C11.25 21.25 11.25 18.75 11.25 18.75C12.5 20 13.75 20 15 20C17.5 20 20 17.5 20 15C20 8.75 13.75 6.25 10 0Z" />
  </svg>
);

export default IconSpade;
