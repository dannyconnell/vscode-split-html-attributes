// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('extension.splitHTMLAttributes', function () {
		let editor = vscode.window.activeTextEditor;
		if (!editor) {
				return;
		}

		// get config
		let config = vscode.workspace.getConfiguration('splitHTMLAttributes', editor.document.uri)
		let tabSize = config.get("tabSize")
		let useSpacesForTabs = config.get("useSpacesForTabs")
		let closingBracketOnNewLine = config.get("closingBracketOnNewLine")

		// get document & selection
		const document = editor.document
		const selections = editor.selections

		// check if each selection starts with < and ends with >
		let textSelections = []
		let selectionErrorCount = 0
		for (let i = 0; i < selections.length; i++) {
			textSelections[i] = document.getText(selections[i])
			textSelections[i] = textSelections[i].trim()
			if (!(textSelections[i].startsWith('<') && textSelections[i].endsWith('>'))) {
				selectionErrorCount++
			}
		}
		if (selectionErrorCount) {
			vscode.window.showWarningMessage('Please select your full opening tag (from < to >)')
		}
		else {
			doReplacement()
		}

		function doReplacement() {

			let textSplit = []

			for (let i = 0; i < selections.length; i++) {

				// get full line text from current line
				const currentLinePosition = selections[i].active.line
				const currentLine = editor.document.lineAt(currentLinePosition);
				const lineTextRange = new vscode.Range(currentLinePosition, 
																					 currentLine.range.start.character, 
																					 currentLinePosition, 
																					 currentLine.range.end.character);
				const lineText = document.getText(lineTextRange)
	
				// get the initial white space at the start of the line
				let initialWhitespaceRegex = /\s*/i
				let initialWhitespace = lineText.match(initialWhitespaceRegex)[0]
	
				// get the ending bracket (if it's a "/>")
				let endingBracket = ''
				if (textSelections[i].endsWith('/>')) {
					endingBracket = '/>'
				}
				else {
					endingBracket = '>'
				}
		
				// remove ending bracket and trim (if it's a "/>")
				if (endingBracket == '/>') {
					textSelections[i] = textSelections[i].replace('/>', '')
				}
				else {
					textSelections[i] = textSelections[i].substring(0, textSelections[i].length - 1)
				}
				textSelections[i] = textSelections[i].trim()
				
				// create the indentation string
				let indentationString
				if (useSpacesForTabs == false) {
					indentationString = '\t'
				}
				else {
					indentationString = ' '.repeat(tabSize)
				}
				
				// regex to select all spaces that aren't within quotes
				let spacesRegex = /\s+(?=([^"]*"[^"]*")*[^"]*$)/g
				
				// replace spaces with newlines, intial whitespace plus extra spaces / tabs for indentation		
				textSplit[i] = textSelections[i].replace(spacesRegex, '\n' + initialWhitespace + indentationString)
	
				// configure ending bracket (new line or not new line)
				if (closingBracketOnNewLine) {
					endingBracket = '\n' + initialWhitespace + endingBracket
				}
				else if (endingBracket == '/>') {
					endingBracket = ' ' + endingBracket
				}

				// add the ending bracket
				textSplit[i] = textSplit[i] + endingBracket
			}

			// do the replacement in the editor
			editor.edit(builder => {
				for (let i = 0; i < selections.length; i++) {
					builder.replace(selections[i], textSplit[i])
				}
			})

		}

	});

	context.subscriptions.push(disposable);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
