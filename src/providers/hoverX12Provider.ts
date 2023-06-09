import { X12Parser } from "../parser/x12Parser";
import { HoverProviderBase } from "./hoverProviderBase";
import { EdifactParser } from "../parser/edifactParser";

export class HoverX12Provider extends HoverProviderBase {
  public getLanguageName(): string {
    return "x12";
  }

  public getParser(document: string): X12Parser | EdifactParser {
    return new X12Parser(document);
  }
}
