import { useState } from 'react'
import { ImagePlus, RefreshCw, Trash2, Wand2 } from 'lucide-react'
import type { AspectRatio, GeneratedImage, ImageStyle } from '@/types'
import { Button } from '@/components/ui/Button'
import { Input, Select } from '@/components/ui/Input'
import { Skeleton } from '@/components/ui/Skeleton'
import * as mockAI from '@/services/mockAI'
import { useToast } from '@/context/ToastContext'

const STYLES: ImageStyle[] = ['Modern', 'Minimal', 'Professional', '3D', 'Illustration', 'Technology', 'Abstract']
const RATIOS: AspectRatio[] = ['1:1', '4:5', '16:9']

const ASPECT_CLASS: Record<AspectRatio, string> = {
  '1:1': 'aspect-square',
  '4:5': 'aspect-[4/5]',
  '16:9': 'aspect-video',
}

interface ImageGeneratorProps {
  value?: GeneratedImage
  onChange: (image: GeneratedImage | undefined) => void
  seedText: string
  defaultStyle?: ImageStyle
}

export function ImageGenerator({ value, onChange, seedText, defaultStyle = 'Modern' }: ImageGeneratorProps) {
  const [style, setStyle] = useState<ImageStyle>(value?.style || defaultStyle)
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>(value?.aspectRatio || '1:1')
  const [prompt, setPrompt] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const { showToast } = useToast()

  async function generate() {
    setStatus('loading')
    try {
      const image = await mockAI.generateImage(prompt || seedText, style, aspectRatio)
      onChange(image)
      setStatus('idle')
      showToast('success', 'Image generated successfully.')
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <Select
          label="Image style"
          value={style}
          onChange={(e) => setStyle(e.target.value as ImageStyle)}
          options={STYLES.map((s) => ({ label: s, value: s }))}
        />
        <Select
          label="Aspect ratio"
          value={aspectRatio}
          onChange={(e) => setAspectRatio(e.target.value as AspectRatio)}
          options={RATIOS.map((r) => ({ label: r, value: r }))}
        />
      </div>
      <Input
        label="Image prompt (optional)"
        placeholder="e.g. a clean illustration of a developer at a laptop"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />

      {status === 'loading' && (
        <div className="space-y-2">
          <Skeleton className={`w-full ${ASPECT_CLASS[aspectRatio]}`} />
          <p className="text-center text-xs text-ink-400">Generating image\u2026</p>
        </div>
      )}

      {status === 'error' && (
        <div className="rounded-lg border border-danger-200 bg-danger-50 p-3 text-center text-sm text-danger-600 dark:border-danger-500/20 dark:bg-danger-500/5">
          Image generation failed.{' '}
          <button onClick={generate} className="font-medium underline">
            Try again
          </button>
        </div>
      )}

      {status === 'idle' && value && (
        <div className="space-y-2">
          <div className={`w-full overflow-hidden rounded-lg border border-ink-200 dark:border-ink-700 ${ASPECT_CLASS[value.aspectRatio]}`}>
            <img src={value.url} alt="" className="h-full w-full object-cover" />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={generate}>
              <RefreshCw className="h-3.5 w-3.5" /> Regenerate
            </Button>
            <Button variant="outline" size="sm" onClick={generate}>
              <ImagePlus className="h-3.5 w-3.5" /> Replace
            </Button>
            <Button variant="outline" size="sm" onClick={() => onChange(undefined)}>
              <Trash2 className="h-3.5 w-3.5" /> Remove
            </Button>
          </div>
        </div>
      )}

      {status === 'idle' && !value && (
        <Button variant="outline" className="w-full" onClick={generate}>
          <Wand2 className="h-4 w-4" /> Generate image
        </Button>
      )}
    </div>
  )
}
