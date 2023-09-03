import { IconLoader } from '@assets/index';

import './Button.scss';

interface IButtonProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  primary?: boolean;
  style?: object;
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset' | undefined;
  loading?: boolean;
  onClick?: any;
}

const Button = ({
  primary,
  loading,
  style,
  disabled,
  type = 'button',
  className = '',
  onClick,
  children
}: IButtonProps) => (
  <button
    disabled={disabled}
    type={type}
    style={style}
    className={`
      button${primary ? '--primary' : '--secondary'}
      ${className} flex justify-center align-center gap-1
      `}
    onClick={onClick}>
    {loading ? <IconLoader color={primary ? 'white' : ''} /> : children}
  </button>
);

export default Button;
