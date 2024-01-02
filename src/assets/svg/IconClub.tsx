import { IIcon } from '@interfaces/index';

const IconClub = ({
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
    viewBox="0 0 22 26">
    <path d="M11.75 0C14.625 0 17.125 2.5 17.125 5.25C17.1095 6.2194 16.8405 7.16786 16.345 8.00115C15.8494 8.83444 15.1444 9.52354 14.3 10C15.55 9.375 17.375 9.375 17.375 9.375C20.5 9.375 23 11.625 23 14.75C23 17.875 20.5 20 17.375 20C17.375 20 15.5 20 13 18.75C13 18.75 12.625 21.25 15.5 25H8C10.875 21.25 10.5 18.75 10.5 18.75C8 20 6.125 20 6.125 20C3 20 0.5 17.875 0.5 14.75C0.5 11.625 3 9.375 6.125 9.375C6.125 9.375 7.95 9.375 9.2 10C8.825 9.7875 6.4875 8.4625 6.375 5.25C6.375 2.5 8.875 0 11.75 0Z" />
  </svg>
);

export default IconClub;
