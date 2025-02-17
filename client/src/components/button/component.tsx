import cx from 'classnames';

const COMMON_CLASSNAMES =
  'inline-flex items-center justify-center font-medium rounded-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500';

const THEME = {
  primary: 'border-transparent shadow-sm text-white bg-green-700 hover:bg-green-800',
  secondary: 'border-gray-300 shadow-sm text-gray-700 bg-white hover:bg-gray-50',
};

const SIZE = {
  xs: 'text-xs px-2.5 py-1.5',
  base: 'text-sm px-4 py-2',
  xl: 'text-base px-6 py-3',
};

export type AnchorButtonProps = {
  theme?: 'primary' | 'secondary';
  size?: 'xs' | 'base' | 'xl';
};

// Button props
export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & AnchorButtonProps;

// Anchor props
export type AnchorProps = React.AnchorHTMLAttributes<HTMLAnchorElement> &
  AnchorButtonProps & {
    disabled?: boolean;
  };

// Input/output options
type Overload = {
  (props: ButtonProps): JSX.Element;
  (props: AnchorProps): JSX.Element;
};

// Guard to check if href exists in props
const hasHref = (props: ButtonProps | AnchorProps): props is AnchorProps => 'href' in props;

function buildClassName({ className, disabled, size = 'base', theme = 'primary' }: AnchorProps) {
  return cx(COMMON_CLASSNAMES, THEME[theme], SIZE[size], {
    [className]: !!className,
    'opacity-50 pointer-events-none': disabled,
  });
}

export const Anchor: React.FC<AnchorProps> = ({
  children,
  theme = 'primary',
  size = 'base',
  className,
  disabled,
  href,
  ...restProps
}: AnchorProps) => {
  // Anchor element doesn't support disabled attribute
  // https://www.w3.org/TR/2014/REC-html5-20141028/disabled-elements.html
  if (disabled) {
    return <span {...restProps}>{children}</span>;
  }
  return (
    <a
      href={href}
      className={buildClassName({
        className,
        disabled,
        size,
        theme,
      } as AnchorProps)}
      {...restProps}
    >
      {children}
    </a>
  );
};

export const Button: React.FC<ButtonProps> = ({
  children,
  theme = 'primary',
  size = 'base',
  className,
  disabled,
  ...restProps
}: ButtonProps) => (
  <button
    type="button"
    className={buildClassName({
      className,
      disabled,
      size,
      theme,
    } as AnchorProps)}
    disabled={disabled}
    {...restProps}
  >
    {children}
  </button>
);

export const LinkButton: Overload = (props: AnchorProps | ButtonProps) => {
  // We consider a link button when href attribute exits
  if (hasHref(props)) {
    return <Anchor {...props} />;
  }
  return <Button {...props} />;
};

export default LinkButton;
