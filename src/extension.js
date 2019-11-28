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

		// check we have an editor
		let editor = vscode.window.activeTextEditor;
		if (!editor) {
				return;
		}

		// get config
		let config = vscode.workspace.getConfiguration('splitHTMLAttributes', editor.document.uri)
		let tabSize = config.get("tabSize")
		let useSpacesForTabs = config.get("useSpacesForTabs")
		let closingBracketOnNewLine = config.get("closingBracketOnNewLine")
		let sortOrder = config.get("sortOrder")

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

				// count the number of lines initally selected
				let lineCount = textSelections[i].split('\n').length

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
	
				// get the opening tag
				let openingTagRegex = /^[^\s]+/
				let openingTag = textSelections[i].match(openingTagRegex)[0]

				// remove opening tag and trim
				textSelections[i] = textSelections[i].replace(openingTagRegex, '')
				textSelections[i] = textSelections[i].trim()
				
				// get the ending bracket (if it's a "/>")
				let endingBracket = ''
				if (textSelections[i].endsWith('/>')) {
					endingBracket = '/>'
				}
				else {
					endingBracket = '>'
				}
				
				// remove ending bracket and trim
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

				// get attributes into an array
				let attributesString = textSelections[i].replace(spacesRegex, '\n')
				let attributesArray = attributesString.split('\n')

				// sort the attributes array
				let sortedAttributesArray = []
				if (sortOrder.length) {

					// loop through sortOrder array
					sortOrder.forEach(search => {
						// loop through attributesArray
						let itemsToMove = []
						attributesArray.forEach((item, index) => {
							if (item.match(search)) {
								itemsToMove.push(index)
								// attributesArray.splice(index, 1)
							}
						})
						// move matched items from attributesArray to sortedAttributesArray (and sort them)
						let tempMatchedItems = []
						itemsToMove.forEach(indexItem => {
							tempMatchedItems.push(attributesArray[indexItem])
						})
						tempMatchedItems.sort()
						sortedAttributesArray.push(...tempMatchedItems)

						// remove matched items from attributesArray
						for (var i = itemsToMove.length - 1; i >= 0; --i) {
							attributesArray.splice(itemsToMove[i], 1)
						}
					})

					// sort remaining attributes and add to sortedAttributesArray
					attributesArray.sort()
					sortedAttributesArray.push(...attributesArray)
				}
				else {
					sortedAttributesArray = attributesArray
				}
				
				// add the opening tag
				textSplit[i] = openingTag

				// set the join character based on number of lines initially selected
				// (newLine if one line, space if more)
				let joinCharacter = lineCount > 1 ? ' ' : '\n'

				// if there are no attributes, set joinCharacter to ''
				if (sortedAttributesArray.length == 1 && sortedAttributesArray[0] == '') {
					joinCharacter = ''
				}

				// add the sorted attributes to the textSplit string
				if (lineCount > 1) {
					sortedAttributesArray.forEach(item => {
						textSplit[i] += joinCharacter + item
					})
				}
				else {
					sortedAttributesArray.forEach(item => {
						textSplit[i] += joinCharacter + initialWhitespace + indentationString + item
					})
				}
	
				// configure ending bracket (new line or not new line)
				if (lineCount > 1) {
					if (endingBracket == '/>') {
						endingBracket = ' ' + endingBracket
					}
				}
				else {
					if (closingBracketOnNewLine) {
						endingBracket = '\n' + initialWhitespace + endingBracket
					}
					else if (endingBracket == '/>') {
						endingBracket = ' ' + endingBracket
					}
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
