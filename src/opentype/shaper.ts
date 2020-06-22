import { CrowbarState, CrowbarFont } from "../store/actions";
declare var window: any;

export function shapeTrace(text: string, font: CrowbarFont, features: string): any {
	var hbjs = window["hbjs"];
  var blob = hbjs.createBlob(font.blob);
  var face = hbjs.createFace(blob, 0);
  var hbfont = hbjs.createFont(face);
  var buffer = hbjs.createBuffer();
  buffer.addText(text);
  buffer.guessSegmentProperties()
  return buffer.shapeWithTrace(hbfont, features);
}
