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
}

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
        fr.readAsDataURL(fontFile);
      }).then( (d1) => {
        var data = d1 as string;
        console.log(data)
        var dataURL = data.split("base64");
        if (dataURL[0].indexOf("application/octet-stream") === -1) {
            dataURL[0] = "data:application/octet-stream;base64"
            data = dataURL[0] + dataURL[1];
        }
        var fontFace = "@font-face{font-family: " + fontFile.name + "; src:url(" + data + ");}";

        dispatch(_addedFontAction( {
          name: fontFile.name,
          base64: data,
          fontFace: fontFace
        }));
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
  	{name: "Roboto", fontFace: "", base64: ""},
  	{name: "Arial", fontFace: "", base64: ""},
  	{name: "Times", fontFace: "", base64: ""}
  ],
  inputtext: ""
}
