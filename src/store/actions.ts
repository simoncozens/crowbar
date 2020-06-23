import {CrowbarFont} from '../opentype/CrowbarFont';

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

export const _addedFontAction = (font:CrowbarFont) => ({
  type: ADDED_FONT,
  added_font: font
})

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
        var f = new CrowbarFont(fontFile.name, ab);
        f.initOT(function (crowbarFont: CrowbarFont) {
          dispatch(_addedFontAction(crowbarFont));
        })
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
  ],
  inputtext: ""
}
