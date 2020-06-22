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
	name:string;
}

export const _addedFontAction = (font:CrowbarFont) => ({
  type: ADDED_FONT,
  added_font: font
})

export function addedFontAction (fontFile: File) {
   return function (dispatch) {
     new Promise((resolve, reject) => {
        var fr = new FileReader();
        fr.onload = () => {
          resolve(fr.result )
        };
        fr.readAsArrayBuffer(file);
      }).then( (data) => {
        console.log(data)
        // opentype.load('fonts/Roboto-Black.ttf', function(err, font) {
      // }).then( (ot) => {
      // dispatch(_addedFontAction({ ... }))
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
  	{name: "Roboto"},
  	{name: "Arial"},
  	{name: "Times"}
  ],
  inputtext: ""
}
