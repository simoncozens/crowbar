import { Font, load } from 'opentype.js';

declare var window: any;


export interface HBGlyph {
	g: number,
	cl: number,
	dx?: number,
	dy?: number,
	ax?: number,
	ay?: number
}

export interface StageMessage {
	m: string;
	t: HBGlyph[];
}


function _arrayBufferToBase64( buffer: ArrayBuffer ) {
    var binary = '';
    var bytes = new Uint8Array( buffer );
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode( bytes[ i ] );
    }
    return btoa( binary );
}

export class CrowbarFont {
	name:   string;
  base64?: string;
  fontFace?: string;
  hbFont?: any;
  otFont?: Font;

  constructor(name : string, fontBlob?: ArrayBuffer) {
    this.name = name;
    if (fontBlob) {
	    this.base64 = "data:application/octet-stream;base64,"+_arrayBufferToBase64(fontBlob);
	    this.fontFace = "@font-face{font-family:\"" + name + "\"; src:url(" + this.base64 + ");}";
	    var hbjs = window["hbjs"];
	    var blob = hbjs.createBlob(fontBlob);
	    var face = hbjs.createFace(blob, 0);
	    this.hbFont = hbjs.createFont(face);
    }
    return this;
  }

  initOT(cb: any) {
  	var that = this;
    load(this.base64 as string, function(err, otFont) {
    	that.otFont = otFont;
    	cb(that)
    });
  }

	getSVG(gid: number): any {
		var hbjs = window["hbjs"];
		var svgText = hbjs.glyphToSvg(this.hbFont, gid);
		var parser = new DOMParser();
		var doc = parser.parseFromString(svgText, "image/svg+xml");
		return doc.documentElement;
	}

	shapeTrace(s: string, features: string): StageMessage[] {
		var hbjs = window["hbjs"];
		var font = this.hbFont;
	  var buffer = hbjs.createBuffer()
	  buffer.addText(s)
	  buffer.guessSegmentProperties()
	  var result: StageMessage[] = buffer.shapeWithTrace(font,features);
	  // Reduce this
	  var newResult = [];
	  var lastBuf = "";
	  for (var r of result) {
	  	if (r.m.startsWith("start table") || r.m.endsWith("start table")) {
	  		r.t = [];
	  		newResult.push(r);
	  		continue;
	  	}
	  	if (JSON.stringify(r.t) !== lastBuf) {
	  		lastBuf = JSON.stringify(r.t);
	  		newResult.push(r)
	  	}
	  }
		return newResult;
	}


}
