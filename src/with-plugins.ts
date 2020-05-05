import { Editor } from "slate";

export const withPlugins = (editor: Editor) => {
  for (let plugin in plugins) {
    if (typeof plugins[plugin] !== "function") continue;
    const pluginEditor = plugins[plugin](editor);
    if (pluginEditor !== editor) continue; // Invalid plugin
    editor = pluginEditor;
  }
  return editor;
};
