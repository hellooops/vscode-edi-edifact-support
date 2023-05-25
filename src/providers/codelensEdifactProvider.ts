import * as vscode from "vscode";
import { IProvidable } from "../interfaces/providable";
import { EdiSegment, EdifactParser } from "../parser";

export class CodelensEdifactProvider implements vscode.CodeLensProvider, IProvidable {
  private parser?: EdifactParser;
  onDidChangeCodeLenses?: vscode.Event<void>;
  async provideCodeLenses(document: vscode.TextDocument, token: vscode.CancellationToken): Promise<vscode.CodeLens[]> {
    const codeLenses: vscode.CodeLens[] = [];
    const text = document.getText();
    this.parser = new EdifactParser(text);
    const segments = await this.parser.parseSegments();
    const ediMessage = await this.parser.parseMessage();

    const unb: EdiSegment = segments.find(segment => segment.id === "UNB");
    if (unb) {
      const description = ediMessage?.buildUNBDescription();
      codeLenses.push(new vscode.CodeLens(
        new vscode.Range(
          document.positionAt(unb.startIndex),
          document.positionAt(unb.endIndex),
        ),
        {
          title: description,
          tooltip: description,
          command: null,
          arguments: []
        }
      ));
    }
    
    const unh: EdiSegment = segments.find(segment => segment.id === "UNH");
    if (unh) {
      const description = ediMessage?.buildUNHDescription();
      codeLenses.push(new vscode.CodeLens(
        new vscode.Range(
          document.positionAt(unh.startIndex),
          document.positionAt(unh.endIndex),
        ),
        {
          title: description,
          tooltip: description,
          command: null,
          arguments: []
        }
      ));
    }
    return codeLenses;
  }

  public registerFunction(): vscode.Disposable {
    const selector = { language: "edifact", scheme: "file" };
    return vscode.languages.registerCodeLensProvider(
      selector,
      this
    );
  }
}
