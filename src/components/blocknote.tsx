import { useMemo } from "react";

import { BlockNoteSchema, combineByGroup, filterSuggestionItems, locales, PartialBlock } from "@blocknote/core";
import { BlockNoteView } from "@blocknote/mantine";
import { SuggestionMenuController, getDefaultReactSlashMenuItems, useCreateBlockNote } from "@blocknote/react";
import {
  getMultiColumnSlashMenuItems,
  multiColumnDropCursor,
  locales as multiColumnLocales,
  withMultiColumn,
} from "@blocknote/xl-multi-column";

import "@blocknote/mantine/style.css";
import "@blocknote/core/fonts/inter.css";

async function saveToStorage(jsonBlocks: Block[]) {
  // Save contents to local storage. You might want to debounce this or replace
  // with a call to your API / database.
  // localStorage.setItem("editorContent", JSON.stringify(jsonBlocks));
  console.log(jsonBlocks);
}

async function loadFromStorage() {
  // Gets the previously stored editor contents.
  const storageString = localStorage.getItem("editorContent");
  return storageString ? (JSON.parse(storageString) as PartialBlock[]) : undefined;
}

export const BlockNote = () => {
  // Creates a new editor instance.
  const editor = useCreateBlockNote({
    schema: withMultiColumn(BlockNoteSchema.create()),
    dropCursor: multiColumnDropCursor,
    dictionary: {
      ...locales.es,
      multi_column: multiColumnLocales.es,
    },
    initialContent: [
      {
        type: "paragraph",
        content: "Welcome to this demo!",
      },
      {
        type: "paragraph",
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "Blocks:",
            styles: { bold: true },
          },
        ],
      },
      {
        type: "paragraph",
        content: "Paragraph",
      },
      {
        type: "columnList",
        children: [
          {
            type: "column",
            props: {
              width: 0.8,
            },
            children: [
              {
                type: "paragraph",
                content: "Hello to the left!",
              },
            ],
          },
          {
            type: "column",
            props: {
              width: 1.2,
            },
            children: [
              {
                type: "paragraph",
                content: "Hello to the right!",
              },
            ],
          },
        ],
      },
      {
        type: "heading",
        content: "Heading",
      },
      {
        type: "bulletListItem",
        content: "Bullet List Item",
      },
      {
        type: "numberedListItem",
        content: "Numbered List Item",
      },
      {
        type: "checkListItem",
        content: "Check List Item",
      },
      {
        type: "codeBlock",
        props: { language: "javascript" },
        content: "console.log('Hello, world!');",
      },
      {
        type: "table",
        content: {
          type: "tableContent",
          rows: [
            {
              cells: ["Table Cell", "Table Cell", "Table Cell"],
            },
            {
              cells: ["Table Cell", "Table Cell", "Table Cell"],
            },
            {
              cells: ["Table Cell", "Table Cell", "Table Cell"],
            },
          ],
        },
      },
      {
        type: "paragraph",
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "Inline Content:",
            styles: { bold: true },
          },
        ],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "Styled Text",
            styles: {
              bold: true,
              italic: true,
              textColor: "red",
              backgroundColor: "blue",
            },
          },
          {
            type: "text",
            text: " ",
            styles: {},
          },
          {
            type: "link",
            content: "Link",
            href: "https://www.blocknotejs.org",
          },
        ],
      },
      {
        type: "paragraph",
      },
    ],
  });

  const slashMenuItems = useMemo(() => {
    return combineByGroup(getDefaultReactSlashMenuItems(editor), getMultiColumnSlashMenuItems(editor));
  }, [editor]);

  // Renders the editor instance using a React component.
  return (
    <div style={{ display: "flex", justifyContent: "center", paddingTop: 50 }}>
      <div style={{ maxWidth: 1024, width: "100%" }}>
        <div>
          <button onClick={() => {}}>save</button>
        </div>

        <BlockNoteView
          editable={false}
          editor={editor}
          slashMenu={false}
          theme={"light"}
          onChange={() => {
            saveToStorage(editor.document);
          }}
        >
          <SuggestionMenuController
            triggerCharacter={"/"}
            getItems={async (query) => filterSuggestionItems(slashMenuItems, query)}
          />
        </BlockNoteView>
      </div>
    </div>
  );
};
