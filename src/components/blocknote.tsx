import { useMemo, useState } from "react";
import { useSetAtom } from "jotai";
import { toast } from "sonner";

import {
  BlockNoteSchema,
  combineByGroup,
  filterSuggestionItems,
  locales,
  defaultBlockSpecs,
  defaultInlineContentSpecs,
  BlockNoteEditor,
  PartialBlock,
} from "@blocknote/core";
import { BlockNoteView } from "@blocknote/mantine";
import {
  DefaultReactSuggestionItem,
  SuggestionMenuController,
  getDefaultReactSlashMenuItems,
  useCreateBlockNote,
} from "@blocknote/react";
import {
  getMultiColumnSlashMenuItems,
  multiColumnDropCursor,
  locales as multiColumnLocales,
  withMultiColumn,
} from "@blocknote/xl-multi-column";

// EXPORT PDF
import { PDFExporter, pdfDefaultSchemaMappings } from "@blocknote/xl-pdf-exporter";
import * as ReactPDF from "@react-pdf/renderer";

import "@blocknote/mantine/style.css";
import "@blocknote/core/fonts/inter.css";

import { INITAL_CONTENT } from "./initial";
import { editorAtom } from "../store/editor";
import { Mention } from "./Mention";

const simulateFetch = (data: any, shouldFail?: boolean, delay: number = 3000) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      shouldFail ? reject(new Error("Fetch error")) : resolve(data);
    }, delay);
  });
};

// Custom Slash Menu item to insert a block after the current one.
const insertHelloWorldItem = (editor: BlockNoteEditor) => ({
  title: "Insert Hello World",
  onItemClick: async () => {
    const toastId = toast.loading("Loading data...");

    // Block that the text cursor is currently in.
    const currentBlock = editor.getTextCursorPosition().block;

    // New block we want to insert.
    const helloWorldBlock: PartialBlock = (await simulateFetch({
      type: "paragraph",
      content: [{ type: "text", text: "Hello World", styles: { bold: true } }],
    })) as PartialBlock;

    // Inserting the new block after the current one.
    editor.insertBlocks([helloWorldBlock], currentBlock, "before");
    toast.success("Data loaded successfully!", { id: toastId });
  },
  aliases: ["helloworld", "hw"],
  group: "Other",
  icon: <span style={{ padding: 4, borderRadius: 5 }}>hw</span>,
  subtext: "Used to insert a block with 'Hello World' below.",
});

// List containing all default Slash Menu Items, as well as our custom one.
const getCustomSlashMenuItems = (editor: any): DefaultReactSuggestionItem[] => [
  ...getDefaultReactSlashMenuItems(editor),
  insertHelloWorldItem(editor),
];

export const BlockNote = () => {
  const saveDocument = useSetAtom(editorAtom);
  const { audio, image, codeBlock, checkListItem, video, file, ...remainingBlockSpecs } = defaultBlockSpecs;
  const [pdfDocumentRender, setPdfDocumentRender] = useState<any>();

  const schema = BlockNoteSchema.create({
    blockSpecs: remainingBlockSpecs,

    inlineContentSpecs: {
      // Adds all default inline content.
      ...defaultInlineContentSpecs,
      // Adds the mention tag.
      mention: Mention,
    },
  });

  // Creates a new editor instance.
  const editor = useCreateBlockNote({
    schema: withMultiColumn(schema),
    dropCursor: multiColumnDropCursor,
    dictionary: {
      ...locales.es,
      multi_column: multiColumnLocales.es,
    },
    // initialContent: INITAL_CONTENT,
  });

  const slashMenuItems = useMemo(() => {
    return combineByGroup(
      // getDefaultReactSlashMenuItems(editor), // esto se remplaza por el custom slash
      getMultiColumnSlashMenuItems(editor),
      getCustomSlashMenuItems(editor)
    );
  }, [editor]);

  const handleExportPDF = async () => {
    // Create the exporter
    const exporter = new PDFExporter(editor.schema, pdfDefaultSchemaMappings as any);

    // Convert the blocks to a react-pdf document
    const pdfDocument = await exporter.toReactPDFDocument(editor.document);

    // Use react-pdf to write to file:
    //  await ReactPDF.render(pdfDocument, `filename.pdf`);
    setPdfDocumentRender(pdfDocument);
  };

  const handleSave = () => {
    const jsonBlocks = editor.document;
    console.log(jsonBlocks);
    saveDocument(jsonBlocks);
  };

  // Function which gets all users for the mentions menu.
  const getMentionMenuItems = (editor: any): DefaultReactSuggestionItem[] => {
    const users = ["Steve", "Bob", "Joe", "Mike"];

    return users.map((user) => ({
      id: user,
      title: user,
      onItemClick: () => {
        editor.insertInlineContent([
          {
            type: "mention",
            props: {
              user,
            },
          },
          " ", // add a space after the mention
        ]);
      },
      icon: <p>{user.substring(0, 1)}</p>,
    }));
  };

  // const getMentionMenuItems = (editor: typeof schema.BlockNoteEditor): DefaultReactGridSuggestionItem[] => {
  //   const users = ["Steve", "Bob", "Joe", "Mike"];
  //   return users.map((user) => ({
  //     id: user,
  //     onItemClick: () => {
  //       editor.insertInlineContent([
  //         {
  //           type: "mention",
  //           props: {
  //             user,
  //           },
  //         },
  //         " ", // add a space after the mention
  //       ]);
  //     },
  //     icon: <p>{user.substring(0, 1)}</p>,
  //   }));
  // };

  // Renders the editor instance using a React component.
  return (
    <div style={{ display: "flex", justifyContent: "center", paddingTop: 50, gap: 20 }}>
      <div style={{ maxWidth: 1024, width: "100%", display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={handleSave}>save</button>
          <button onClick={handleExportPDF}>export pdf</button>
          <button
            className={"edit-button"}
            onClick={() =>
              editor.insertBlocks(
                [
                  {
                    type: "paragraph",
                    content: "This block was inserted at " + new Date().toLocaleTimeString(),
                  },
                ],
                editor.document[0],
                "before"
              )
            }
          >
            Insert First Block
          </button>
          <button
            className={"edit-button"}
            onClick={() =>
              editor.updateBlock(editor.document[0], {
                content: "This block was updated at " + new Date().toLocaleTimeString(),
              })
            }
          >
            Update First Block
          </button>
          <button className={"edit-button"} onClick={() => editor.removeBlocks([editor.document[0]])}>
            Remove First Block
          </button>
          <button
            className={"edit-button"}
            onClick={() =>
              editor.replaceBlocks(
                [editor.document[0]],
                [
                  {
                    type: "paragraph",
                    content: "This block was replaced at " + new Date().toLocaleTimeString(),
                  },
                ]
              )
            }
          >
            Replace First Block
          </button>
        </div>

        <BlockNoteView
          editable={true}
          editor={editor}
          slashMenu={false}
          theme={"dark"}
          // onSelectionChange={() => {
          //   const selection = editor.getSelection();
          //   console.log(selection);
          // }}
        >
          <SuggestionMenuController
            triggerCharacter={"/"}
            getItems={async (query) => filterSuggestionItems(slashMenuItems, query)}
          />
          <SuggestionMenuController
            triggerCharacter={"@"}
            getItems={async (query) => {
              // Gets the mentions menu items
              // TODO: Fix map/type cast
              return filterSuggestionItems(
                getMentionMenuItems(editor).map((item) => ({
                  ...item,
                  title: item.title,
                })),
                query
              ) as DefaultReactSuggestionItem[];
            }}
          />
          {/* <GridSuggestionMenuController
            triggerCharacter={"@"}
            getItems={async (query) => {
              console.log("asdasda", query);

              // Gets the mentions menu items
              // TODO: Fix map/type cast
              return filterSuggestionItems(
                getMentionMenuItems(editor).map((item) => ({
                  ...item,
                  title: item.id,
                })),
                query
              ) as DefaultReactGridSuggestionItem[];
            }}
            columns={2}
            minQueryLength={0}
          /> */}
        </BlockNoteView>
      </div>
      <div style={{ maxWidth: 1024, width: "100%", minHeight: 500, display: "flex", flexDirection: "column", gap: 10 }}>
        <ReactPDF.PDFViewer style={{ width: "100%", minHeight: 500 }}>{pdfDocumentRender}</ReactPDF.PDFViewer>
      </div>
    </div>
  );
};
