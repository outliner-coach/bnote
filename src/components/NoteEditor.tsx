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
  ReactEditor
} from 'slate-react';
import { Note } from '@/lib/api';

type CustomText = {
  text: string;
}

type ParagraphElement = {
  type: 'paragraph';
  children: CustomText[];
}

type CustomElement = ParagraphElement;

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element: CustomElement;
    Text: CustomText;
  }
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
  const editor = useMemo(() => withReact(createEditor()), []);

  const renderElement = useCallback(({ attributes, children, element }: {
    attributes: any;
    children: React.ReactNode;
    element: CustomElement;
  }) => {
    switch (element.type) {
      case 'paragraph':
        return <p {...attributes}>{children}</p>;
      default:
        return <p {...attributes}>{children}</p>;
    }
  }, []);

  const renderLeaf = useCallback(({ attributes, children }: {
    attributes: any;
    children: React.ReactNode;
  }) => {
    return <span {...attributes}>{children}</span>;
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
          className="min-h-[180px] focus:outline-none"
        />
      </Slate>
    </div>
  );
} 