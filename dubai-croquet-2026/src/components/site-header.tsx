'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'

type SiteHeaderProps = {
  title?: string
  isTitleVisible?: boolean
  logo?: {
    src?: string
    alt?: string
  }
  links?: Array<{
    label?: string
    url?: string
  }>
}

export function SiteHeader({ title, isTitleVisible, logo, links = [] }: SiteHeaderProps) {
  const [open, setOpen] = useState(false)
  const navLinks = links.filter((link) => link.label && link.url)

  return (
    <header className="border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-content items-center justify-between gap-6 px-4 py-4 md:px-6">
        <Link
          href="/"
          className="flex items-center gap-3 text-foreground transition-opacity hover:opacity-80"
        >
          {logo?.src ? (
            <Image
              src={logo.src}
              alt={logo.alt ?? title ?? 'Dubai Croquet Club'}
              width={48}
              height={48}
              className="h-12 w-auto object-contain"
              priority
            />
          ) : null}
          {isTitleVisible ? (
            <span className="font-display text-xl leading-none tracking-[0.12em] uppercase md:text-2xl">
              {title}
            </span>
          ) : null}
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={`${link.url}-${link.label}`}
              href={link.url!}
              className="text-sm font-semibold uppercase tracking-[0.18em] text-foreground transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                className="rounded-none border border-border md:hidden"
                aria-label="Open navigation menu"
              />
            }
          >
            <>
              <Menu className="size-5" />
            </>
          </SheetTrigger>
          <SheetContent side="right" className="w-[20rem] border-l border-border bg-background px-6">
            <div className="border-b border-border pb-4">
              <SheetTitle className="font-display text-lg uppercase tracking-[0.14em] text-foreground">
                Menu
              </SheetTitle>
            </div>
            <nav className="mt-6 flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={`${link.url}-${link.label}`}
                  href={link.url!}
                  onClick={() => setOpen(false)}
                  className={cn(
                    'border-b border-border py-3 text-sm font-semibold uppercase tracking-[0.18em] text-foreground transition-colors hover:text-primary',
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
