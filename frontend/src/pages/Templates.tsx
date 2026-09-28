import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { LayoutTemplate, Plus, Trash2, Wand2 } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { Input, Select, Textarea } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { useTemplates } from '@/context/TemplatesContext'
import { TONES, toOptions } from '@/data/options'
import type { Tone } from '@/types'

export default function Templates() {
  const { templates, createTemplate, deleteTemplate } = useTemplates()
  const navigate = useNavigate()
  const [createOpen, setCreateOpen] = useState(false)

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [structure, setStructure] = useState('')
  const [tone, setTone] = useState<Tone>('Professional')
  const [hashtagsInput, setHashtagsInput] = useState('')

  function resetForm() {
    setName('')
    setDescription('')
    setStructure('')
    setTone('Professional')
    setHashtagsInput('')
  }

  function handleCreate(e: FormEvent) {
    e.preventDefault()
    if (!name.trim() || !structure.trim()) return
    createTemplate({
      name,
      description,
      example: structure,
      contentType: 'Educational',
      tone,
      defaultHashtags: hashtagsInput
        .split(',')
        .map((t) => t.trim().replace(/^#/, ''))
        .filter(Boolean),
    })
    resetForm()
    setCreateOpen(false)
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-ink-900 dark:text-white">Templates</h1>
          <p className="text-sm text-ink-500 dark:text-ink-400">Reusable starting points for your next post</p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="h-4 w-4" /> Create template
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {templates.map((template) => (
          <Card key={template.id} className="flex flex-col p-5">
            <div className="mb-2 flex items-start justify-between gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-50 text-accent-600 dark:bg-accent-500/10 dark:text-accent-400">
                <LayoutTemplate className="h-4.5 w-4.5" />
              </div>
              {template.isCustom && (
                <button
                  onClick={() => deleteTemplate(template.id)}
                  className="rounded-lg p-1.5 text-ink-400 hover:bg-danger-50 hover:text-danger-500 dark:hover:bg-danger-500/10"
                  aria-label={`Delete ${template.name}`}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
            <h3 className="text-sm font-semibold text-ink-900 dark:text-white">{template.name}</h3>
            <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">{template.description}</p>
            <p className="mt-3 line-clamp-3 rounded-lg bg-ink-50 p-3 text-xs text-ink-500 dark:bg-ink-800 dark:text-ink-400">
              {template.example}
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              <Badge variant="outline">{template.tone}</Badge>
              {template.defaultHashtags.slice(0, 2).map((tag) => (
                <Badge key={tag} variant="accent">
                  #{tag}
                </Badge>
              ))}
            </div>
            <Button
              variant="outline"
              className="mt-4 w-full"
              onClick={() => navigate('/create', { state: { template } })}
            >
              <Wand2 className="h-4 w-4" /> Use template
            </Button>
          </Card>
        ))}
      </div>

      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Create template"
        description="Save a reusable structure you can start new posts from."
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <Input label="Template name" value={name} onChange={(e) => setName(e.target.value)} required />
          <Input
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What kind of post is this template for?"
          />
          <Textarea
            label="Content structure"
            rows={5}
            value={structure}
            onChange={(e) => setStructure(e.target.value)}
            placeholder="Write the example structure a post based on this template should follow."
            required
          />
          <Select label="Tone" value={tone} onChange={(e) => setTone(e.target.value as Tone)} options={toOptions(TONES)} />
          <Input
            label="Default hashtags"
            value={hashtagsInput}
            onChange={(e) => setHashtagsInput(e.target.value)}
            placeholder="ReactJS, JavaScript, WebDevelopment"
            hint="Comma-separated"
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setCreateOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Save template</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
