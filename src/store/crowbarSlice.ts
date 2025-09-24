import {
  createSlice,
  PayloadAction,
  ThunkAction,
  UnknownAction,
} from "@reduxjs/toolkit";
import { CrowbarFont } from "../opentype/CrowbarFont";
import { RootState } from ".";

export interface CrowbarState {
  selected_font: number;
  fonts: CrowbarFont[];
  inputtext: string;
  drawerOpen: boolean;
  features: Record<string, boolean>;
  featureString: string;
  clusterLevel: number;
  direction: string;
  script: string;
  language: string;
  bufferFlag: string[];
  showAllLookups: boolean;
  variations: Record<string, number>;
}

export const initialState: CrowbarState = {
  selected_font: 0,
  fonts: [],
  inputtext: "",
  drawerOpen: false,
  features: {},
  featureString: "",
  clusterLevel: 0,
  variations: {},
  direction: "auto",
  script: "",
  language: "",
  bufferFlag: [],
  showAllLookups: false,
};

const crowbarSlice = createSlice({
  name: "crowbar",
  initialState,
  reducers: {
    changedFeatureState(state, action: PayloadAction<string>) {
      const feature = action.payload;
      if (!(feature in state.features)) {
        state.features[feature] = true;
      } else if (state.features[feature]) {
        state.features[feature] = false;
      } else {
        delete state.features[feature];
      }
    },
    changedFeatureString(state, action: PayloadAction<string>) {
      state.featureString = action.payload;
    },
    changedDirection(state, action: PayloadAction<string>) {
      state.direction = action.payload;
    },
    changedScript(state, action: PayloadAction<string>) {
      state.script = action.payload;
    },
    changedLanguage(state, action: PayloadAction<string>) {
      state.language = action.payload;
    },
    changedBufferFlag(state, action: PayloadAction<string[]>) {
      state.bufferFlag = action.payload;
    },
    changedClusterLevel(state, action: PayloadAction<number>) {
      state.clusterLevel = action.payload;
    },
    changedVariations(state, action: PayloadAction<Record<string, number>>) {
      if (
        state.fonts[state.selected_font] &&
        state.fonts[state.selected_font].axes
      ) {
        state.fonts[state.selected_font].setVariations(action.payload);
      }
      state.variations = action.payload;
    },
    changedShowAllLookups(state, action: PayloadAction<boolean>) {
      state.showAllLookups = action.payload;
    },
    changedDrawerState(state, action: PayloadAction<boolean>) {
      state.drawerOpen = action.payload;
    },
    changedTextAction(state, action: PayloadAction<string>) {
      state.inputtext = action.payload;
    },
    changedFontAction(state, action: PayloadAction<number>) {
      state.selected_font = action.payload;
    },
    addedFontActionInternal(state, action: PayloadAction<CrowbarFont>) {
      state.fonts.push(action.payload);
      state.selected_font = state.fonts.length - 1;
    },
  },
});

export const {
  changedFeatureState,
  changedFeatureString,
  changedDirection,
  changedScript,
  changedLanguage,
  changedBufferFlag,
  changedClusterLevel,
  changedVariations,
  changedShowAllLookups,
  changedDrawerState,
  changedTextAction,
  changedFontAction,
  addedFontActionInternal,
} = crowbarSlice.actions;

export default crowbarSlice.reducer;

// Thunk
export function addedFontAction(
  fontFile: File
): ThunkAction<void, RootState, unknown, UnknownAction> {
  return async (dispatch) => {
    const fr = new FileReader();
    fr.onload = (progress) => {
      const ab = fr.result as ArrayBuffer;
      const header = new Uint8Array(ab.slice(0, 4));
      if (
        header[0] === 116 && // t
        header[1] === 116 && // t
        header[2] === 99 && // f
        header[3] === 102 // c
      ) {
        // If there are more than 255 I hate you
        const count = new Uint8Array(ab.slice(11, 12))[0];
        for (let i = 0; i < count; i += 1) {
          const f = new CrowbarFont(`${fontFile.name}#${i}`, ab, i);
          dispatch(addedFontActionInternal(f));
        }
      } else {
        const f = new CrowbarFont(fontFile.name, ab);
        dispatch(addedFontActionInternal(f));
      }
    };
    await fr.readAsArrayBuffer(fontFile);
  };
}
