import { forwardRef } from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
}

const sizeMap = {
  sm: '!h-10 !px-5 !text-sm',
  md: '!h-11 !px-6 !text-base',
  lg: '!h-12 !px-7 !text-base',
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', className = '', children, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      className={`ts-btn ${variant === 'primary' ? 'ts-btn-primary' : 'ts-btn-secondary'} ${sizeMap[size]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  )
})

export default Button
