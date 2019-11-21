# **Split HTML Attributes** (VSCode Extension) <!-- omit in toc -->

Tired of manually splitting your HTML attributes up onto multiple lines? 

You can now do it **instantly** with this extension:

![Demo](https://raw.githubusercontent.com/dannyconnell/vscode-split-html-attributes/master/images/DemoSelfClosing.gif)

## Contents <!-- omit in toc -->

- [Features](#features)
  - [Opening Tags](#opening-tags)
  - [Self-Closing Tags](#self-closing-tags)
  - [Multiple Selections](#multiple-selections)
- [Usage](#usage)
- [Extension Settings](#extension-settings)
  - [Settings](#settings)
  - [Keybindings](#keybindings)
- [Known Issues](#known-issues)
- [Change Log](#change-log)
- [Feature Suggestions](#feature-suggestions)

## Features

### Opening Tags

The extension works on opening tags:

![OpeningTags](https://raw.githubusercontent.com/dannyconnell/vscode-split-html-attributes/master/images/DemoOpeningTags.gif)

### Self-Closing Tags

As well as self-closing tags:

![SelfClosingTags](https://raw.githubusercontent.com/dannyconnell/vscode-split-html-attributes/master/images/DemoSelfClosing.gif)

### Multiple Selections

And even works with multiple selections:

![MultipleSelections](https://raw.githubusercontent.com/dannyconnell/vscode-split-html-attributes/master/images/DemoMultipleSelections.gif)

## Usage

Just select your opening (or self-closing) tag - from the opening angle bracket (`<`) up to the closing angle bracket (`>`) and either:
* Open Command Pallette (`CMD/CTRL + Shift + P`) and choose `Split HTML Attributes`
* Or use the keyboard shortcut (which defaults to `Ctrl + Alt + Shift + A`)

## Extension Settings

### Settings

| Name | Description | Default | Type |
| - | - | - | - |
| tabSize<br><small>`splitHTMLAttributes.tabSize`</small> | <small>Set the indentation size for your split lines.</small> | `2` | Number
| useSpacesForTabs<br><small>`splitHTMLAttributes.useSpacesForTabs`</small> | <small>Use spaces for indentation (instead of tabs).</small> | `true` | Boolean
| closingBracketOnNewLine<br><small>`splitHTMLAttributes.closingBracketOnNewLine`</sup></> | <small>Place closing bracket (`>` or `/>`) on a new line.</small> | `false` | Boolean

### Keybindings

You can change the keyboard shorcut. This is the default:

```json
{
  "command": "extension.splitHTMLAttributes",
  "key": "ctrl+alt+shift+a"
}
```

## Known Issues

No known issues yet.

## Change Log

[View the Change Log here](https://github.com/dannyconnell/vscode-split-html-attributes/blob/master/CHANGELOG.md)

## Feature Suggestions

A list of feature suggestions I've received, along with vote count.

| Suggestion | Votes | Added?  |
| - | - | - |
| ESLint integration (follow the ESLint indentation rules) | `1` | |
| Attribute ordering options | `1` | |
| ~~Option for closing bracket (`>` or `/>`) to be on a new line~~ | `2` | Yes |