export const INITAL_CONTENT: any[] = [
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
];
