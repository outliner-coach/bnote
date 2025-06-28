'use client';

import React, { useCallback, useMemo } from 'react';
import {
  createEditor,
  Descendant,
  Element as SlateElement,
  BaseEditor,
  Operation
} from 'slate';
import {
  Slate,
  Editable,
  withReact,
  ReactEditor,
  RenderElementProps,
  RenderLeafProps
} from 'slate-react';
import { HistoryEditor, withHistory } from 'slate-history';

// 타입 정의 (Editor.tsx와 일치)
type FormattedText = { text: string } & Partial<Record<'bold' | 'italic' | 'underline', boolean>>
type CustomText = FormattedText

type CustomElement = {
  type: 'paragraph' | 'heading-one' | 'heading-two' | 'heading-three' | 'bulleted-list' | 'numbered-list' | 'list-item'
  children: CustomText[]
}

interface NoteEditorProps {
  initialContent: Descendant[];
  onChange: (content: Descendant[]) => void;
  readOnly?: boolean;
}

const initialValue: CustomElement[] = [
  {
    type: 'paragraph',
    children: [{ text: '' }],
  },
];

export function NoteEditor({
  initialContent = initialValue,
  onChange,
  readOnly = false,
}: NoteEditorProps) {
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);

  const renderElement = useCallback((props: RenderElementProps) => {
    const { attributes, children, element } = props;
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
      case 'paragraph':
      default:
        return <p {...attributes} className="mb-3">{children}</p>
    }
  }, []);

  const renderLeaf = useCallback((props: RenderLeafProps) => {
    const { attributes, children, leaf } = props;
    let result = children;

    if (leaf.bold) {
      result = <strong>{result}</strong>
    }

    if (leaf.italic) {
      result = <em>{result}</em>
    }

    if (leaf.underline) {
      result = <u>{result}</u>
    }

    return <span {...attributes}>{result}</span>;
  }, []);

  return (
    <div className="min-h-[200px] bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
      <Slate
        editor={editor}
        initialValue={initialContent}
        onChange={value => {
          const isAstChange = editor.operations.some(
            (op: Operation) => 'set_selection' !== op.type
          );
          if (isAstChange) {
            onChange(value);
          }
        }}
      >
        <Editable
          readOnly={readOnly}
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          placeholder="Write your note here..."
          className="min-h-[180px] focus:outline-none text-gray-900 dark:text-white"
        />
      </Slate>
    </div>
  );
} 