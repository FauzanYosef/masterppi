'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useEffect } from 'react'

type Props = {
  content: string
  onChange: (value: string) => void
}

export default function Editor({ content, onChange }: Props) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: content || '',

    // 🔥 FIX SSR HYDRATION ISSUE
    immediatelyRender: false,

    onUpdate({ editor }) {
      onChange(editor.getHTML())
    },
  })

  // sync external content (edit mode safe)
  useEffect(() => {
    if (!editor) return

    const isSame = editor.getHTML() === content
    if (!isSame) {
      editor.commands.setContent(content || '')
    }
  }, [content, editor])

  if (!editor) return null

  return (
    <div className="border rounded-xl p-3 bg-white min-h-[250px]">
      <EditorContent editor={editor} />
    </div>
  )
}