
## ALPHA release

# 👔Chief🎩Editor🖊
Editor-In-(rich text editing)-Chief!

A rich-text editor for React, built ontop of Slate.js with an hooks-based addon architecture.

# Installation
```bash
#npm:
npm install --save react-editor-chief

#yarn:
yarn add react-editor-chief
```

# Getting started


## Minimum working example
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
        <div
          style={{
            marginLeft: 20
          }}
        >
        <BlockInsert>
            <BlockInsertControls
              controls={[
                ...headingBlockControls
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