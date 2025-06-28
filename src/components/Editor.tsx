'use client'

import React, { useCallback, useMemo } from 'react'
import { 
  createEditor, 
  Descendant, 
  Editor as SlateEditor,
  Transforms,
  Element as SlateElement,
  Node as SlateNode,
  BaseEditor
} from 'slate'
import { 
  Slate, 
  Editable, 
  withReact, 
  RenderElementProps,
  RenderLeafProps,
  ReactEditor
} from 'slate-react'
import { withHistory, HistoryEditor } from 'slate-history'

// 커스텀 타입 정의
type CustomElement = {
  type: 'paragraph' | 'heading-one' | 'heading-two' | 'heading-three' | 'bulleted-list' | 'numbered-list' | 'list-item'
  children: CustomText[]
}

type FormattedText = { text: string } & Partial<Record<'bold' | 'italic' | 'underline', boolean>>
type CustomText = FormattedText

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor & HistoryEditor
    Element: CustomElement
    Text: CustomText
  }
}

// 초기 값
const initialValue: Descendant[] = [
  {
    type: 'paragraph',
    children: [{ text: '여기에 노트를 작성하세요...' }],
  },
]

// Element 렌더링 함수
const Element = ({ attributes, children, element }: RenderElementProps) => {
  switch (element.type) {
    case 'heading-one':
      return <h1 {...attributes} className="text-3xl font-bold mb-4">{children}</h1>
    case 'heading-two':
      return <h2 {...attributes} className="text-2xl font-bold mb-3">{children}</h2>
    case 'heading-three':
      return <h3 {...attributes} className="text-xl font-bold mb-2">{children}</h3>
    case 'bulleted-list':
      return <ul {...attributes} className="list-disc list-inside mb-4">{children}</ul>
    case 'numbered-list':
      return <ol {...attributes} className="list-decimal list-inside mb-4">{children}</ol>
    case 'list-item':
      return <li {...attributes}>{children}</li>
    default:
      return <p {...attributes} className="mb-3">{children}</p>
  }
}

// Leaf 렌더링 함수
const Leaf = ({ attributes, children, leaf }: RenderLeafProps) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>
  }

  if (leaf.italic) {
    children = <em>{children}</em>
  }

  if (leaf.underline) {
    children = <u>{children}</u>
  }

  return <span {...attributes}>{children}</span>
}

// Props 타입 정의
interface EditorProps {
  placeholder?: string
  value: Descendant[]
  onChange: (value: Descendant[]) => void
  readOnly?: boolean
}

// 편집기 컴포넌트
export default function Editor({ 
  placeholder = '여기에 노트를 작성하세요...', 
  value,
  onChange,
  readOnly = false
}: EditorProps) {
  const editor = useMemo(() => withHistory(withReact(createEditor())), [])
  const renderElement = useCallback((props: RenderElementProps) => <Element {...props} />, [])
  const renderLeaf = useCallback((props: RenderLeafProps) => <Leaf {...props} />, [])

  // 텍스트 포맷팅 함수들
  const toggleBold = () => {
    const isActive = isMarkActive(editor, 'bold')
    if (isActive) {
      SlateEditor.removeMark(editor, 'bold')
    } else {
      SlateEditor.addMark(editor, 'bold', true)
    }
  }

  const toggleItalic = () => {
    const isActive = isMarkActive(editor, 'italic')
    if (isActive) {
      SlateEditor.removeMark(editor, 'italic')
    } else {
      SlateEditor.addMark(editor, 'italic', true)
    }
  }

  const toggleUnderline = () => {
    const isActive = isMarkActive(editor, 'underline')
    if (isActive) {
      SlateEditor.removeMark(editor, 'underline')
    } else {
      SlateEditor.addMark(editor, 'underline', true)
    }
  }

  // 블록 타입 변경
  const toggleBlock = (format: CustomElement['type']) => {
    const isActive = isBlockActive(editor, format)
    const isList = ['numbered-list', 'bulleted-list'].includes(format)

    Transforms.unwrapNodes(editor, {
      match: n => 
        !SlateEditor.isEditor(n) &&
        SlateElement.isElement(n) &&
        ['numbered-list', 'bulleted-list'].includes(n.type),
      split: true,
    })

    const newProperties: Partial<SlateElement> = {
      type: isActive ? 'paragraph' : isList ? 'list-item' : format,
    }
    Transforms.setNodes(editor, newProperties)

    if (!isActive && isList) {
      const block = { type: format, children: [] }
      Transforms.wrapNodes(editor, block)
    }
  }

  return (
    <div className="w-full mx-auto">
      {/* 툴바 */}
      {!readOnly && (
        <div className="border-b border-gray-200 pb-4 mb-4">
          <div className="flex items-center space-x-2">
            {/* 텍스트 포맷팅 버튼 */}
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault()
                toggleBold()
              }}
              className={`px-3 py-1 rounded ${
                isMarkActive(editor, 'bold') 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'hover:bg-gray-100'
              }`}
            >
              <strong>B</strong>
            </button>
            
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault()
                toggleItalic()
              }}
              className={`px-3 py-1 rounded ${
                isMarkActive(editor, 'italic') 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'hover:bg-gray-100'
              }`}
            >
              <em>I</em>
            </button>
            
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault()
                toggleUnderline()
              }}
              className={`px-3 py-1 rounded ${
                isMarkActive(editor, 'underline') 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'hover:bg-gray-100'
              }`}
            >
              <u>U</u>
            </button>

            <div className="h-6 w-px bg-gray-200 mx-2" />

            {/* 블록 포맷팅 버튼 */}
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault()
                toggleBlock('heading-one')
              }}
              className={`px-3 py-1 rounded ${
                isBlockActive(editor, 'heading-one') 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'hover:bg-gray-100'
              }`}
            >
              H1
            </button>
            
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault()
                toggleBlock('heading-two')
              }}
              className={`px-3 py-1 rounded ${
                isBlockActive(editor, 'heading-two') 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'hover:bg-gray-100'
              }`}
            >
              H2
            </button>

            <div className="h-6 w-px bg-gray-200 mx-2" />

            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault()
                toggleBlock('bulleted-list')
              }}
              className={`px-3 py-1 rounded ${
                isBlockActive(editor, 'bulleted-list') 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'hover:bg-gray-100'
              }`}
            >
              • List
            </button>
            
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault()
                toggleBlock('numbered-list')
              }}
              className={`px-3 py-1 rounded ${
                isBlockActive(editor, 'numbered-list') 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'hover:bg-gray-100'
              }`}
            >
              1. List
            </button>
          </div>
        </div>
      )}

      {/* 에디터 */}
      <Slate 
        editor={editor} 
        initialValue={value}
        onChange={onChange}
      >
        <Editable
          readOnly={readOnly}
          placeholder={placeholder}
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          className="min-h-[200px] focus:outline-none"
        />
      </Slate>
    </div>
  )
}

// 마크가 활성화되어 있는지 확인
const isMarkActive = (editor: SlateEditor, format: keyof Omit<FormattedText, 'text'>) => {
  const marks = SlateEditor.marks(editor)
  return marks ? marks[format] === true : false
}

// 블록이 활성화되어 있는지 확인
const isBlockActive = (editor: SlateEditor, format: CustomElement['type']) => {
  const { selection } = editor
  if (!selection) return false

  const [match] = Array.from(
    SlateEditor.nodes(editor, {
      at: SlateEditor.unhangRange(editor, selection),
      match: n =>
        !SlateEditor.isEditor(n) && SlateElement.isElement(n) && n.type === format,
    })
  )

  return !!match
} 