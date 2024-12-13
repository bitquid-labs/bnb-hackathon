import { IconType } from 'react-icons';
import React from 'react';
import { cn } from 'lib/utils';

export const InputVariant = ['primary'] as const;
export const InputSize = ['sm', 'base'] as const;
export const InputRound = ['full', 'base'] as const;

type IconProps = React.ComponentType<React.SVGProps<SVGSVGElement>>;

type InputProps = {
  className?: string;
  label?: string;
  description?: string;
  disabled?: boolean;
  variant?: (typeof InputVariant)[number];
  size?: (typeof InputSize)[number];
  rounded?: (typeof InputRound)[number];
  leftIcon?: IconType | IconProps | React.ReactNode;
  rightIcon?: IconType | IconProps | React.ReactNode;
  classNames?: {
    leftIcon?: string;
    rightIcon?: string;
    input?: string;
  };
} & React.ComponentPropsWithRef<'input'>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      description,
      disabled = false,
      variant = 'primary',
      size = 'base',
      rounded = 'full',
      leftIcon: LeftIcon,
      rightIcon: RightIcon,
      classNames,
      ...rest
    },
    ref
  ) => {
    const renderIcon = (
      icon: InputProps['leftIcon'] | InputProps['rightIcon'],
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
      <div className='flex w-full flex-col gap-1'>
        {label && (
          <div className='font-primary text-light text-base'>{label}</div>
        )}
        {description && <p className='font-primary text-sm'>{description}</p>}
        <div
          className={cn(
            'relative flex items-center',
            [
              size === 'base' && ['px-3 py-2', 'whitespace-nowrap text-base'],
              size === 'sm' && ['px-2 py-1', 'whitespace-nowrap text-sm'],
            ],
            [
              rounded === 'base' && ['rounded-lg'],
              rounded === 'full' && ['rounded-full'],
            ],
            [variant === 'primary' && ['bg-background-100 text-light']],
            className
          )}
        >
          {LeftIcon &&
            renderIcon(
              LeftIcon,
              size === 'base' ? 'mr-16' : 'mr-8',
              classNames?.leftIcon
            )}
          <input
            ref={ref}
            disabled={disabled}
            className={cn(
              'placeholder:text-light/50 min-w-0 flex-auto border-none bg-transparent p-0 focus:border-none focus:outline-none focus:outline-offset-0 focus:ring-0',
              classNames?.input
            )}
            {...rest}
          />
          {RightIcon &&
            renderIcon(
              RightIcon,
              size === 'base' ? 'ml-4' : 'ml-2',
              classNames?.rightIcon
            )}
        </div>
      </div>
    );
  }
);

export default Input;
