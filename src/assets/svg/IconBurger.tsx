import { IIcon } from '@interfaces/index';

const IconBurger = ({ size = 24, className = '', onClick }: IIcon) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    className={className}
    onClick={onClick}
    fill="none"
    viewBox="0 0 24 24">
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeWidth="2"
      d="M4 18h16M4 12h16M4 6h16"
    />
  </svg>
);

export default IconBurger;
