import * as React from 'react';
import { IconType } from 'react-icons';
import { ImSpinner2 } from 'react-icons/im';
import { cn } from 'lib/utils';

export const ButtonVariant = [
  'primary',
  'gradient-outline',
  'gradient',
  'default',
  'outline',
] as const;
export const ButtonSize = ['xs', 'sm', 'base', 'lg', 'xl'] as const;

type IconProps = React.ComponentType<React.SVGProps<SVGSVGElement>>;

type ButtonProps = {
  isLoading?: boolean;
  variant?: (typeof ButtonVariant)[number];
  size?: (typeof ButtonSize)[number];
  leftIcon?: IconType | IconProps | React.ReactNode;
  rightIcon?: IconType | IconProps | React.ReactNode;
  classNames?: {
    leftIcon?: string;
    rightIcon?: string;
  };
  wrapperClassName?: string;
} & React.ComponentPropsWithRef<'button'>;

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className,
      disabled: buttonDisabled,
      isLoading,
      variant = 'default',
      size = 'base',
      leftIcon: LeftIcon,
      rightIcon: RightIcon,
      classNames,
      wrapperClassName,
      ...rest
    },
    ref
  ) => {
    const disabled = isLoading || buttonDisabled;

    const renderIcon = (
      icon: ButtonProps['leftIcon'] | ButtonProps['rightIcon'],
      size: string,
      className?: string
    ) => {
      if (React.isValidElement(icon)) {
        return <span className={cn(size, className)}>{icon}</span>;
      }

      if (typeof icon === 'function') {
        const IconComponent = icon as React.ComponentType<
          React.SVGProps<SVGSVGElement>
        >;
        return <IconComponent className={cn(size, className)} />;
      }

      return null;
    };

    return (
      <div
        className={cn(
          'relative flex',
          'transition-all',
          'active:scale-100',
          variant === 'gradient-outline' && 'overflow-hidden rounded p-[1px]',
          wrapperClassName
        )}
      >
        {variant === 'gradient-outline' && (
          <div className='from-primary-200 to-primary-200 absolute inset-0 bg-gradient-to-t'></div>
        )}
        <button
          ref={ref}
          type='button'
          disabled={disabled}
          className={cn(
            'box-border flex items-center',
            'focus-visible:ring-primary-100 focus:outline-none focus-visible:ring',
            'transition-all',
            'justify-center text-center',
            'rounded',
            [
              size === 'xl' && [
                'px-8 py-5',
                'text-[20px] leading-[25px]',
                'font-semibold',
              ],
              size === 'lg' && [
                'px-28 py-12',
                'text-[18px] leading-[22px]',
                'font-semibold',
              ],
              size === 'base' && [
                'px-3 py-2',
                'text-base leading-4 md:text-sm',
              ],
              size === 'xs' && ['px-3 py-1.5', 'text-xs'],
            ],
            [
              variant === 'primary' && [
                'text-light from-gray-200 to-gray-100 bg-gradient-to-t',
              ],
              variant === 'gradient-outline' && ['bg-dark relative z-10'],
              variant === 'gradient' && [
                'from-primary-200 to-primary-300 relative z-10 bg-gradient-to-r',
              ],
              variant === 'default' && [
                'text-light bg-background-100 border border-transparent',
              ],
              variant === 'outline' && [
                'border-border-100 text-light hover:bg-background-100 border',
              ],
            ],
            'disabled:cursor-not-allowed',
            isLoading &&
            'relative opacity-[0.7] transition-none disabled:cursor-wait',
            className
          )}
          {...rest}
        >
          {LeftIcon &&
            renderIcon(
              LeftIcon,
              size === 'base' ? 'mr-2' : 'mr-1.5',
              classNames?.leftIcon
            )}
          {variant === 'gradient-outline' ? (
            <div className='from-primary-200 to-primary-200 bg-gradient-to-t bg-clip-text text-transparent'>
              {children}
            </div>
          ) : (
            children
          )}
          {RightIcon &&
            renderIcon(
              RightIcon,
              size === 'base' ? 'ml-2' : 'ml-1.5',
              classNames?.rightIcon
            )}
          {isLoading && (
            <div
              className={cn(
                // 'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2',
                'pl-[4px]',
                {
                  'text-white': ['primary', 'dark'].includes(variant),
                  'text-black': ['light'].includes(variant),
                }
              )}
            >
              <ImSpinner2 className='animate-spin' />
            </div>
          )}
        </button>
      </div>
    );
  }
);

export default Button;
