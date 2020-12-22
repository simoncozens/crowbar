import { CrowbarFont } from "../opentype/CrowbarFont";

export const ADDED_FONT = "ADDED_FONT";
export const CHANGED_TEXT = "CHANGED_TEXT";
export const CHANGED_FONT = "CHANGED_FONT";
export const CHANGED_FEATURE_STATE = "CHANGED_FEATURE_STATE";
export const CHANGED_FEATURE_STRING = "CHANGED_FEATURE_STRING";
export const CHANGED_DRAWER_STATE = "CHANGED_DRAWER_STATE";
export const CHANGED_CLUSTER_LEVEL = "CHANGED_CLUSTER_LEVEL";
export const CHANGED_DIRECTION = "CHANGED_DIRECTION";
export const CHANGED_SCRIPT = "CHANGED_SCRIPT";
export const CHANGED_LANGUAGE = "CHANGED_LANGUAGE";
export const CHANGED_BUFFER_FLAG = "CHANGED_BUFFER_FLAG";

export const changedFeatureState = (featureName: string) => ({
  type: CHANGED_FEATURE_STATE,
  feature: featureName,
});

export const changedFeatureString = (featureString: string) => ({
  type: CHANGED_FEATURE_STRING,
  featureString,
});

export const changedDirection = (direction: string) => ({
  type: CHANGED_DIRECTION,
  direction,
});

export const changedScript = (script: string) => ({
  type: CHANGED_SCRIPT,
  script,
});

export const changedLanguage = (language: string) => ({
  type: CHANGED_LANGUAGE,
  language,
});

export const changedBufferFlag = (bufferFlag: string[]) => ({
  type: CHANGED_BUFFER_FLAG,
  bufferFlag,
});

export const changedClusterLevel = (content: number) => ({
  type: CHANGED_CLUSTER_LEVEL,
  clusterLevel: content,
});

export const changedDrawerState = (open: boolean) => ({
  type: CHANGED_DRAWER_STATE,
  open,
});

export const changedTextAction = (content: string) => ({
  type: CHANGED_TEXT,
  inputtext: content,
});

export const changedFontAction = (content: number) => ({
  type: CHANGED_FONT,
  selected_font: content,
});

export const addedFontActionInternal = (font: CrowbarFont) => ({
  type: ADDED_FONT,
  added_font: font,
});

export function addedFontAction(fontFile: File) {
  return (dispatch: any) => {
    new Promise((resolve) => {
      const fr = new FileReader();
      fr.onload = () => {
        resolve(fr.result);
      };
      fr.readAsArrayBuffer(fontFile);
    }).then((result) => {
      const ab = result as ArrayBuffer;
      const header = new Uint8Array(ab.slice(0, 4));
      if (
        header[0] === 116 && // t
        header[1] === 116 && // t
        header[2] === 99 && // f
        header[3] === 102 // c
      ) {
        const count = new Uint8Array(ab.slice(11, 12))[0]; // If there are more than 255 I hate you
        for (let i = 0; i < count; i += 1) {
          const f = new CrowbarFont(`${fontFile.name}#${i}`, ab, i);
          f.initOT((crowbarFont: CrowbarFont) => {
            dispatch(addedFontActionInternal(crowbarFont));
          });
        }
      } else {
        const f = new CrowbarFont(fontFile.name, ab);
        f.initOT((crowbarFont: CrowbarFont) => {
          dispatch(addedFontActionInternal(crowbarFont));
        });
      }
    });
  };
}

export interface CrowbarState {
  selected_font: number;
  fonts: CrowbarFont[];
  inputtext: string;
  drawerOpen: boolean;
  features: any;
  featureString: string;
  clusterLevel: number;
  direction: string;
  script: string;
  language: string;
  bufferFlag: string[];
}

export const initialState: CrowbarState = {
  selected_font: 0,
  fonts: [],
  inputtext: "",
  drawerOpen: false,
  features: {},
  featureString: "",
  clusterLevel: 0,
  direction: "auto",
  script: "",
  language: "",
  bufferFlag: [],
};
