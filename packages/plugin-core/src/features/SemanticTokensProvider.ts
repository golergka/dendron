import _ from "lodash";
import vscode from "vscode";

const ANCHOR_REGEX = /\^([\w-]+)\w*(\n|$)/;
// see https://code.visualstudio.com/api/language-extensions/semantic-highlight-guide#standard-token-types-and-modifiers
const TOKEN_TYPES = ["label"];
const TOKEN_MODIFIERS = ["declaration"];
export const SEMANTIC_TOKENS_LEGEND = new vscode.SemanticTokensLegend(
  TOKEN_TYPES,
  TOKEN_MODIFIERS
);

export class SemanticTokensProvider
  implements vscode.DocumentSemanticTokensProvider
{
  onDidChangeSemanticTokens?: vscode.Event<void> | undefined;

  provideDocumentSemanticTokens(
    document: vscode.TextDocument,
    token: vscode.CancellationToken
  ): vscode.SemanticTokens | undefined {
    const tokensBuilder = new vscode.SemanticTokensBuilder(
      SEMANTIC_TOKENS_LEGEND
    );
    if (token.isCancellationRequested) return;

    for (let lineIndex = 0; lineIndex < document.lineCount; lineIndex++) {
      const line = document.lineAt(lineIndex);
      const match = line.text.match(ANCHOR_REGEX);
      if (!_.isNull(match) && !_.isUndefined(match.index)) {
        tokensBuilder.push(
          new vscode.Range(
            new vscode.Position(lineIndex, match.index),
            new vscode.Position(lineIndex, match.index + match[0].length)
          ),
          "label",
          ["declaration"]
        );
      }
      if (token.isCancellationRequested) return;
    }

    return tokensBuilder.build();
  }
}
