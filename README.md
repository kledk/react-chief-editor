
## Currently in ALPHA!
This project is stil in alpha - i do not recommend using in production!

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


## Working example
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

function App() {
    const [value, setValue] = useState<Node[]>([
    {
      type: "h1",
      children: [{ text: "Heading" }]
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
