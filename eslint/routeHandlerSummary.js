// ********************************************************************************
// == Constant ====================================================================
const ROUTE_METHODS = new Set(['delete', 'get', 'patch', 'post', 'put']);

// == Rule ========================================================================
/** requires a one-sentence comment directly above every `<name>Router.<method>(...)` registration */
export const routeHandlerSummary = {
 meta: {
  docs: { description: 'Require a summary comment directly above each Express route handler' },
  messages: { missing: 'Add a one-sentence comment above this route saying what it does, e.g. "// Register a new profile".' },
  schema: [],
  type: 'suggestion',
 },

 create(context) {
  const sourceCode = context.sourceCode;

  return {
   ExpressionStatement(node) {
    if (!isRouteRegistration(node.expression)) {
     return;
    } /* else -- this statement registers a route handler */

    const comments = sourceCode.getCommentsBefore(node);
    const lastComment = comments[comments.length - 1];
    if (lastComment && lastComment.loc.end.line === node.loc.start.line - 1) {
     return;
    } /* else -- nothing describes this route */

    context.report({ messageId: 'missing', node });
   },
  };
 },
};

// == Util ========================================================================
const isRouteRegistration = (expression) => expression.type === 'CallExpression'
 && expression.callee.type === 'MemberExpression'
 && expression.callee.object.type === 'Identifier'
 && expression.callee.object.name.endsWith('Router')
 && expression.callee.property.type === 'Identifier'
 && ROUTE_METHODS.has(expression.callee.property.name);
