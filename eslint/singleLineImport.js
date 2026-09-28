// ********************************************************************************
// == Rule ========================================================================
/** reports import declarations that span more than one line and joins them into one */
export const singleLineImport = {
 meta: {
  docs: { description: 'Require each import declaration to fit on a single line' },
  fixable: 'code',
  messages: { multiline: 'Write this import on a single line.' },
  schema: [],
  type: 'layout',
 },

 create(context) {
  const sourceCode = context.sourceCode;

  return {
   ImportDeclaration(node) {
    if (node.loc.start.line === node.loc.end.line) {
     return;
    } /* else -- the import spans several lines */

    // joining lines would swallow or misplace comments, so those imports are reported without a fix
    const hasComments = sourceCode.getCommentsInside(node).length > 0;
    context.report({
     fix: hasComments ? null : (fixer) => fixer.replaceText(node, toSingleLine(sourceCode.getText(node))),
     messageId: 'multiline',
     node,
    });
   },
  };
 },
};

// == Util ========================================================================
const toSingleLine = (text) => text
 .replace(/\s*\n\s*/g, ' ')
 .replace(/,\s*}/, ' }')
 .replace(/{\s*/, '{ ');
