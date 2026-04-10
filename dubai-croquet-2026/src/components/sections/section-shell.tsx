import { cn } from '@/lib/utils'

type SectionShellProps = {
  colors?: string
  width?: string
  className?: string
  children: React.ReactNode
}

export function SectionShell({ colors = 'colors-h', width = 'wide', className, children }: SectionShellProps) {
  return (
    <section className={cn(colors, className)}>
      <div className={cn(width === 'narrow' ? 'content-width-narrow' : 'content-width', 'px-4 py-16 md:px-6 md:py-24')}>
        {children}
      </div>
    </section>
  )
}
