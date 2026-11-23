import type { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  asLink?: boolean
  className?: string
  title?: string
}

function Card({ children, asLink = false, className = '', title }: CardProps) {
  return (
    <div
      className={`ts-card bg-surface border border-white/5 rounded-[var(--radius-md)] p-6 ${asLink ? 'ts-card-link cursor-pointer' : ''} ${className}`}
    >
      {title && (
        <h3 className="text-[20px] leading-[1.4] font-[500] text-ink mb-2"
            style={{ fontFamily: 'var(--font-display)' }}>
          {title}
        </h3>
      )}
      {children}
    </div>
  )
}

export default Card
