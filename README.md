
## ALPHA release

# 👔Chief🎩Editor🖊
Editor-In-(rich text editing)-Chief!

A rich-text editor for React, built ontop of Slate.js with an hooks-based addon architecture.

# Installation
```bash
#npm:
npm install --save react-chief-editor

#yarn:
yarn add react-chief-editor
```

# Getting started


## Wworking example
```tsx
import {
  Editor,
  Chief,
  HeadingsAddon,
  BoldAddon,
  ItalicAddon,
  UnderlineAddon,
  StrikethroughAddon,
  ImageAddon,
  ResetToParagraphAddon,
  PreventNewlineAddon,
  LinkAddon,
  ListsAddon,
  BlockTabAddon,
  ParagraphAddon,
} from "react-chief-editor";

const editorLabels = {
  "marks.bold": "Fed",
  "marks.italic": "Kursiv",
  "marks.strikethrough": "Gennemstreg",
  "marks.underline": "Understreg",
  "elements.link": "Link",
  "elements.link.placeholder": "Indsæt eller skriv link",
  "elements.link.btn.link": "Tilføj",
  "elements.link.btn.unlink": "Fjern",
  "elements.paragraph.hint": "Klik for at redigere",
  "elements.paragraph.placeholder": "Tekst",
  "elements.heading.heading-1.placeholder": "Overskrift 1",
  "elements.heading.heading-2.placeholder": "Overskrift 2",
  "elements.heading.heading-3.placeholder": "Overskrift 3",
  "elements.heading.heading-4.placeholder": "Overskrift 4",
  "elements.heading.heading-5.placeholder": "Overskrift 5",
  "elements.heading.heading-6.placeholder": "Overskrift 6"
};

function App() {
    const [value, setValue] = useState<Node[]>([
    {
      type: "h1",
      children: [{ text: "Dark" }]
    },
    {
      type: "paragraph",
      children: [
        {
          text:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
        }
      ]
    }
  ]);

  return (
      <Chief
        value={value}
        onChange={value => setValue(value)}
      >
        <HeadingsAddon/>
        <ParagraphAddon/>
        <BoldAddon/>
        <ItalicAddon/>
        <UnderlineAddon/>
        <StrikethroughAddon/>
        <ImageAddon/>
        <LinkAddon/>
        <ListsAddon/>
        <BlockTabAddon/>
        <ResetToParagraphAddon/>
        <PreventNewlineAddon/>
        <LabelsAddon labels={editorLabels}></LabelsAddon>
        <div
          style={{
            marginLeft: 20
          }}
        >
        <BlockInsert>
            <BlockInsertControls
              controls={[
                ...headingBlockControls,
                ...imageBlockControls,
                ListsAddon.Control
              ]}
            />
          </BlockInsert>
          <HoverToolProvider
            hoverTool={
              <HoverToolControls
                controls={[
                  BoldAddon.Control,
                  italicControl,
                  strikethroughControl,
                  underlineControl,
                  ...headingContextControls,
                  linkControl
                ]}
              />
            }
          >
            <Editor
              spellCheck={false}
              style={{ margin: 10, overflow: "auto", minHeight: 500 }}
            ></Editor>
          </HoverToolProvider>
        </div>
      </Chief>
  );
}

```
...
## Addons
...
### Hooks
...
### Controls
...
### Prensentation
...