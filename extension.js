// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "split-html-attributes" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('extension.splitHTMLAttributes', function () {
		let editor = vscode.window.activeTextEditor;
		if (!editor) {
				return;
		}
		const document = editor.document
		const selection = editor.selection
		const currentLinePosition = selection.active.line
		const currentLine = editor.document.lineAt(currentLinePosition);
		const textRange = new vscode.Range(currentLinePosition, 
																			 currentLine.range.start.character, 
																			 currentLinePosition, 
																			 currentLine.range.end.character);
		let text = document.getText(textRange)
		// console.log('text: ', text)

		let whitespaceRegex = /[^<]*/i
		let whitespace = text.match(whitespaceRegex)[0]

		console.log('whitespace: "', whitespace + '"')

		text = text.replace(whitespace, '')

		let regex = /\s+(?=([^"]*"[^"]*")*[^"]*$)/g

		let replacement = text.replace(regex, '\n' + whitespace + '  ')
		replacement = whitespace + replacement

		editor.edit(builder => {
			builder.replace(textRange, replacement)
		})

		// vscode.window.showInformationMessage('Split HTML Attributes!')
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
