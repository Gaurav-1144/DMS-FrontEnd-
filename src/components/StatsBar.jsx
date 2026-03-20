import React from 'react'
import { formatFileSize } from '../utils/helpers'

export default function StatsBar({ documents }) {
  const total    = documents.length
  const pdfs     = documents.filter((d) => d.fileType === 'application/pdf').length
  const docxs    = documents.filter((d) => d.fileType?.includes('word') || d.fileType?.includes('document')).length
  const images   = documents.filter((d) => d.fileType?.startsWith('image/')).length
  const totalSize= documents.reduce((sum, d) => sum + (d.fileSize || 0), 0)

  const stats = [
    { label: 'Total',  value: total,                                             accent: 'text-white'         },
    { label: 'PDFs',   value: pdfs,                                              accent: 'text-ruby-light'    },
    { label: 'DOCX',   value: docxs,                                             accent: 'text-cobalt-light'  },
    { label: 'Images', value: images,                                            accent: 'text-jade-light'    },
    { label: 'Size',   value: total > 0 ? formatFileSize(totalSize) : '—',      accent: 'text-gold-DEFAULT'  },
  ]

  return (
    <div className="grid grid-cols-5 bg-ink-800 border border-ink-700 rounded-2xl p-1 gap-px">
      {stats.map((s) => (
        <div key={s.label} className="flex flex-col items-center py-3 px-2 rounded-xl hover:bg-ink-700/50 transition-colors">
          <span className={`font-display font-bold text-xl tabular-nums ${s.accent}`}>{s.value}</span>
          <span className="text-ink-500 font-mono text-xs mt-0.5">{s.label}</span>
        </div>
      ))}
    </div>
  )
}
