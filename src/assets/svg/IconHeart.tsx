import { IIcon } from '@interfaces/index';

const IconHeart = ({
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
    viewBox="0 0 25 26">
    <path d="M13 24L11.1875 22.3121C4.75 16.3404 0.5 12.3891 0.5 7.56825C0.5 3.61695 3.525 0.535202 7.375 0.535202C9.55 0.535202 11.6375 1.57098 13 3.19497C14.3625 1.57098 16.45 0.535202 18.625 0.535202C22.475 0.535202 25.5 3.61695 25.5 7.56825C25.5 12.3891 21.25 16.3404 14.8125 22.3121L13 24Z" />
  </svg>
);

export default IconHeart;
