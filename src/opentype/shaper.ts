import { CrowbarState, CrowbarFont } from "../store/actions";
declare var window: any;


export function shapeTrace(s: string, infont: CrowbarFont, features: string): any {
	var hbjs = window["hbjs"];
	var font = infont.hbFont;
  var buffer = hbjs.createBuffer()
  buffer.addText(s)
  buffer.guessSegmentProperties()
  // buffer.shape(font,0)
  console.log(buffer.shapeWithTrace(font,0));
  var result :any[] = buffer.json();
  if (result.length > 0) {
  	console.log(hbjs.glyphToSvg(font, result[0].g))
  }
  console.log(result);
}
