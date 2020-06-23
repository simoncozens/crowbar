import { Font, load } from 'opentype.js';
declare var window: any;

export const ADDED_FONT = 'ADDED_FONT'
export const CHANGED_TEXT = 'CHANGED_TEXT'
export const CHANGED_FONT = 'CHANGED_FONT'

export const changedTextAction = (content:string) => ({
  type: CHANGED_TEXT,
  inputtext: content
})

export const changedFontAction = (content:number) => ({
  type: CHANGED_FONT,
  selected_font: content
})

export interface CrowbarFont {
	name:   string;
  base64: string;
  fontFace: string;
  hbFont?: any;
  otFont?: Font;
}

export const _addedFontAction = (font:CrowbarFont) => ({
  type: ADDED_FONT,
  added_font: font
})

function _arrayBufferToBase64( buffer: ArrayBuffer ) {
    var binary = '';
    var bytes = new Uint8Array( buffer );
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode( bytes[ i ] );
    }
    return btoa( binary );
}

export function addedFontAction (fontFile: File) {
   return function (dispatch :any) {
     new Promise((resolve, reject) => {
        var fr = new FileReader();
        fr.onload = () => {
          resolve(fr.result )
        };
        fr.readAsArrayBuffer(fontFile);
      }).then( (result) => {
        var ab = result as ArrayBuffer;
        var data = "data:application/octet-stream;base64,"+_arrayBufferToBase64(ab);
        var fontFace = "@font-face{font-family:\"" + fontFile.name + "\"; src:url(" + data + ");}";
        var hbjs = window["hbjs"];
        var blob = hbjs.createBlob(ab);
        var face = hbjs.createFace(blob, 0);
        var hbFont = hbjs.createFont(face);


        load(data, function(err, font) {
          dispatch(_addedFontAction( {
            name: fontFile.name,
            base64: data,
            fontFace: fontFace,
            hbFont: hbFont,
            otFont: font
          }));
        });

      })
   };
}

export interface CrowbarState {
	selected_font: number;
	fonts: CrowbarFont[];
	inputtext: string;
}

export const initialState: CrowbarState = {
  selected_font: 0,
  fonts: [
  	{name: "Roboto", fontFace: "", base64: ""},
  	{name: "Arial", fontFace: "", base64: ""},
  	{name: "Times", fontFace: "", base64: ""}
  ],
  inputtext: ""
}
