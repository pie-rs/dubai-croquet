'use client'

import { startTransition, useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Markdown } from '@/components/markdown'
import { SectionShell } from '@/components/sections/section-shell'
import { cn } from '@/lib/utils'
import type { ContactSectionData } from '@/components/sections/types'

type FormField =
  | {
      kind: 'text'
      name: string
      label: string
      placeholder?: string
      width?: 'full' | 'half'
      required?: boolean
      autoComplete?: string
    }
  | {
      kind: 'email'
      name: string
      label: string
      placeholder?: string
      width?: 'full' | 'half'
      required?: boolean
      autoComplete?: string
    }
  | {
      kind: 'textarea'
      name: string
      label: string
      placeholder?: string
      width?: 'full' | 'half'
      required?: boolean
    }
  | {
      kind: 'select'
      name: string
      label: string
      options: string[]
      placeholder?: string
      width?: 'full' | 'half'
      required?: boolean
    }
  | {
      kind: 'checkbox'
      name: string
      label: string
      width?: 'full' | 'half'
    }

type FormDefinition = {
  submitLabel: string
  description?: string
  endpoint: string
  successMessage: string
  fields: FormField[]
}

const formDefinitions: Record<NonNullable<ContactSectionData['formKey']>, FormDefinition> = {
  contact: {
    submitLabel: 'Send Message',
    endpoint: '/api/contact',
    successMessage: 'Your message has been sent.',
    fields: [
      { kind: 'text', name: 'name', label: 'Name', placeholder: 'Your name', required: true, width: 'half' },
      { kind: 'email', name: 'email', label: 'Email', placeholder: 'Your email', required: true, width: 'half' },
      { kind: 'textarea', name: 'message', label: 'Message', placeholder: 'Your Message', required: true, width: 'full' },
      { kind: 'checkbox', name: 'updates', label: 'Sign me up to receive updates', width: 'full' },
    ],
  },
  newsletter: {
    submitLabel: 'Sign Up',
    endpoint: '/api/newsletter',
    successMessage: 'You have been added to the newsletter list.',
    fields: [
      { kind: 'email', name: 'email', label: 'Email', placeholder: 'Your email', required: true, width: 'full' },
    ],
  },
  registration: {
    submitLabel: 'Submit Registration',
    endpoint: '/api/registration',
    successMessage: 'Your registration has been submitted.',
    fields: [
      { kind: 'text', name: 'name', label: 'Name', placeholder: 'Fighting Name', required: true, width: 'half' },
      { kind: 'email', name: 'email', label: 'Email', placeholder: 'Your email', width: 'half' },
      {
        kind: 'select',
        name: 'identity',
        label: 'Identity',
        placeholder: 'Please choose...',
        required: true,
        width: 'half',
        options: ['Wannabe Captain', 'Player Baby', 'Lost in my own pronouns'],
      },
      { kind: 'text', name: 'phoneNumber', label: 'Phone Number', placeholder: '+971xx', required: true, width: 'half' },
      { kind: 'text', name: 'teamName', label: 'Team Name', placeholder: 'Team Name', width: 'half' },
      {
        kind: 'text',
        name: 'teamSize',
        label: 'Number of Players in your Team',
        placeholder: 'Total number of players in your team',
        width: 'half',
      },
      {
        kind: 'select',
        name: 'status',
        label: 'Status',
        placeholder: 'Please choose...',
        width: 'half',
        options: ['Married', 'Single', 'Dubai Single'],
      },
      {
        kind: 'checkbox',
        name: 'clubhouseAttendance',
        label: 'Will you be attending for tea and cakes at the clubhouse after the battle?',
        width: 'full',
      },
      {
        kind: 'textarea',
        name: 'croquetCareer',
        label: 'Croquet Career',
        placeholder: 'A short essay describing your croquet career and sponsorship',
        width: 'full',
      },
      { kind: 'checkbox', name: 'updates', label: 'Sign me up to receive updates', width: 'full' },
    ],
  },
}

function getFormDefinition(formKey?: ContactSectionData['formKey']) {
  return formDefinitions[formKey ?? 'contact'] ?? formDefinitions.contact
}

function FieldShell({
  id,
  label,
  width = 'full',
  children,
}: {
  id: string
  label: string
  width?: 'full' | 'half'
  children: React.ReactNode
}) {
  return (
    <div className={cn('space-y-2', width === 'full' ? 'sm:col-span-2' : 'sm:col-span-1')}>
      <Label className="text-sm uppercase tracking-[0.16em]" htmlFor={id}>
        {label}
      </Label>
      {children}
    </div>
  )
}

export function ContactSection({ colors, width, title, subtitle, text, formKey, variant, media }: ContactSectionData) {
  const form = getFormDefinition(formKey)
  const centeredLayout = variant === 'variant-b' && !media?.src
  const [values, setValues] = useState<Record<string, string | boolean>>({})
  const [submitState, setSubmitState] = useState<{
    status: 'idle' | 'submitting' | 'success' | 'error'
    message?: string
  }>({ status: 'idle' })

  function setFieldValue(name: string, value: string | boolean) {
    setValues((current) => ({ ...current, [name]: value }))
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitState({ status: 'submitting' })

    const payload = Object.fromEntries(
      form.fields.map((field) => [field.name, values[field.name] ?? (field.kind === 'checkbox' ? false : '')]),
    )

    try {
      const response = await fetch(form.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const body = (await response.json().catch(() => ({}))) as { error?: string; message?: string }

      if (!response.ok) {
        throw new Error(body.error ?? 'Unable to submit the form right now.')
      }

      startTransition(() => {
        setSubmitState({ status: 'success', message: body.message ?? form.successMessage })
        setValues({})
      })
    } catch (error) {
      setSubmitState({
        status: 'error',
        message: error instanceof Error ? error.message : 'Unable to submit the form right now.',
      })
    }
  }

  return (
    <SectionShell colors={colors} width={width}>
      <div
        className={cn(
          'grid items-start gap-10',
          media?.src ? 'lg:grid-cols-[minmax(0,1fr)_minmax(18rem,26rem)]' : 'mx-auto max-w-5xl',
          centeredLayout && 'justify-items-center text-center',
        )}
      >
        <div className={cn('space-y-6', centeredLayout ? 'max-w-2xl' : '')}>
          {title ? <h2 className="font-display text-4xl md:text-5xl">{title}</h2> : null}
          {subtitle ? <p className="text-lg leading-8 text-muted-foreground md:text-xl">{subtitle}</p> : null}
          <Markdown content={text} />
        </div>

        <div className={cn('space-y-6', centeredLayout ? 'mx-auto w-full max-w-lg' : '')}>
          <Card className="rounded-none border-border/80 bg-transparent shadow-none">
            <CardHeader className="space-y-2 border-b border-border px-5 py-4">
              <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">{form.submitLabel}</p>
              {form.description ? <p className="text-sm text-muted-foreground">{form.description}</p> : null}
            </CardHeader>
            <CardContent className="px-5 py-5">
              <form className="grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit}>
                {form.fields.map((field) => {
                  if (field.kind === 'checkbox') {
                    const checked = values[field.name] === true

                    return (
                      <div key={field.name} className="sm:col-span-2">
                        <div className="flex items-start gap-3">
                          <Checkbox
                            id={field.name}
                            name={field.name}
                            className="mt-1"
                            checked={checked}
                            onCheckedChange={(checked) => setFieldValue(field.name, checked === true)}
                          />
                          <Label htmlFor={field.name} className="text-sm leading-6 font-normal">
                            {field.label}
                          </Label>
                        </div>
                      </div>
                    )
                  }

                  if (field.kind === 'select') {
                    const currentValue = values[field.name]

                    return (
                      <div
                        key={field.name}
                        className={cn(field.width === 'full' ? 'sm:col-span-2' : 'sm:col-span-1', 'space-y-2')}
                      >
                        <Label className="text-sm uppercase tracking-[0.16em]" htmlFor={field.name}>
                          {field.label}
                        </Label>
                        <Select
                          name={field.name}
                          required={field.required}
                          value={typeof currentValue === 'string' ? currentValue : ''}
                          onValueChange={(value) => setFieldValue(field.name, value ?? '')}
                        >
                          <SelectTrigger id={field.name} className="w-full">
                            <SelectValue placeholder={field.placeholder ?? field.label} />
                          </SelectTrigger>
                          <SelectContent>
                            {field.options.map((option) => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )
                  }

                  if (field.kind === 'textarea') {
                    const currentValue = values[field.name]

                    return (
                      <FieldShell key={field.name} id={field.name} label={field.label} width={field.width}>
                        <Textarea
                          id={field.name}
                          name={field.name}
                          required={field.required}
                          placeholder={field.placeholder}
                          className="min-h-32"
                          value={typeof currentValue === 'string' ? currentValue : ''}
                          onChange={(event) => setFieldValue(field.name, event.target.value)}
                        />
                      </FieldShell>
                    )
                  }

                  const currentValue = values[field.name]

                  return (
                    <FieldShell key={field.name} id={field.name} label={field.label} width={field.width}>
                      <Input
                        id={field.name}
                        name={field.name}
                        type={field.kind === 'email' ? 'email' : 'text'}
                        required={field.required}
                        placeholder={field.placeholder}
                        autoComplete={field.autoComplete}
                        value={typeof currentValue === 'string' ? currentValue : ''}
                        onChange={(event) => setFieldValue(field.name, event.target.value)}
                      />
                    </FieldShell>
                  )
                })}

                {submitState.message ? (
                  <div
                    className={cn(
                      'sm:col-span-2 text-sm',
                      submitState.status === 'error' ? 'text-destructive' : 'text-muted-foreground',
                    )}
                  >
                    {submitState.message}
                  </div>
                ) : null}

                <div className="sm:col-span-2 pt-2">
                  <Button
                    className="w-full rounded-none uppercase tracking-[0.16em]"
                    type="submit"
                    disabled={submitState.status === 'submitting'}
                  >
                    {submitState.status === 'submitting' ? 'Sending...' : form.submitLabel}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {media?.src ? (
          <div className="space-y-3">
            <Image
              src={media.src}
              alt={media.alt ?? title ?? 'Dubai Croquet Club'}
              width={960}
              height={720}
              className="h-auto w-full border border-border object-cover"
            />
            {media.caption ? <p className="text-sm text-muted-foreground">{media.caption}</p> : null}
          </div>
        ) : null}
      </div>
    </SectionShell>
  )
}
