import { IIcon } from '@interfaces/index';

const IconArrowRight = ({
  width = 24,
  height = 24,
  style,
  className = ''
}: IIcon) => (
  <svg
    className={className}
    fill="none"
    style={style}
    height={height}
    width={width}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg">
    <g
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2">
      <path d="m16.4 7 5.1 5-5.1 5" data-name="Right" />
      <path d="M2.5 12h16.7" />
    </g>
  </svg>
);

export default IconArrowRight;
