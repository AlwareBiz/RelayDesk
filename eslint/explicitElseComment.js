// ********************************************************************************
// == Constant ====================================================================
const ELSE_COMMENT_PATTERN = /^\s*else -- \S/;

// == Rule ========================================================================
/** requires every `if` without an `else` to use braces and close with a `/* else -- <meaning> *\/` comment */
export const explicitElseComment = {
 meta: {
  docs: { description: 'Require an explicit else comment after every if without an else branch' },
  messages: {
   braces: 'Wrap this if body in braces so it can close with an else comment.',
   missing: 'Close this if with `} /* else -- <what continuing means> */`.',
  },
  schema: [],
  type: 'suggestion',
 },

 create(context) {
  const sourceCode = context.sourceCode;

  return {
   IfStatement(node) {
    if (node.alternate) {
     return;
    } /* else -- the if has no else branch to explain */

    if (node.consequent.type !== 'BlockStatement') {
     context.report({ messageId: 'braces', node });
     return;
    } /* else -- the body is a block */

    const closingBrace = sourceCode.getLastToken(node.consequent);
    const [comment] = sourceCode.getCommentsAfter(closingBrace);
    const isElseComment = comment
     && comment.type === 'Block'
     && comment.loc.start.line === closingBrace.loc.end.line
     && ELSE_COMMENT_PATTERN.test(comment.value);
    if (isElseComment) {
     return;
    } /* else -- the missing branch is undocumented */

    context.report({ loc: closingBrace.loc, messageId: 'missing' });
   },
  };
 },
};
