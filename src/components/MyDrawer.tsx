import React from "react";
import { connect, ConnectedProps } from "react-redux";
import Drawer from "@mui/material/Drawer";
import Divider from "@mui/material/Divider";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import IconButton from "@mui/material/IconButton";
import Chip from "@mui/material/Chip";
import Select from "@mui/material/Select";
import Slider from "@mui/material/Slider";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Checkbox from "@mui/material/Checkbox";
import {
  changedDrawerState,
  changedVariations,
  changedDirection,
  changedScript,
  changedLanguage,
  changedFeatureState,
  changedClusterLevel,
  changedFeatureString,
  changedBufferFlag,
  changedShowAllLookups,
} from "../store/crowbarSlice";
import { RootState } from "../store";
import { CrowbarFont } from "../opentype/CrowbarFont";
import { useStyles } from "../navbarstyles";
import { harfbuzzScripts, opentypeLanguages } from "../opentype/constants";
import { hbSingleton } from "../opentype/CrowbarFont";

const mapStateToProps = (state: RootState) => {
  // console.log("Mapping state to props", state);
  return {
  open: state.crowbar.drawerOpen,
  fonts: state.crowbar.fonts,
  selectedFontIndex: state.crowbar.selected_font,
  featureState: state.crowbar.features,
  featureString: state.crowbar.featureString,
  clusterLevel: state.crowbar.clusterLevel,
  variations: state.crowbar.variations,
  direction: state.crowbar.direction,
  script: state.crowbar.script,
  language: state.crowbar.language,
  bufferFlag: state.crowbar.bufferFlag || [],
  showAllLookups: state.crowbar.showAllLookups,
}};

const connector = connect(mapStateToProps, {
  changedDirection,
  changedScript,
  changedLanguage,
  changedDrawerState,
  changedVariations,
  changedFeatureState,
  changedClusterLevel,
  changedFeatureString,
  changedBufferFlag,
  changedShowAllLookups,
});
type PropsFromRedux = ConnectedProps<typeof connector>;

const MyDrawer = (props: PropsFromRedux) => {
  const classes = useStyles();
  const handleDrawerClose = () => {
    props.changedDrawerState(false);
  };
  const handleVariationChange = (tag: string, value: number) => {
    const state = props.variations;
    state[tag] = value;
    props.changedVariations(state);
  };
  const font: CrowbarFont = (props.fonts || [])[props.selectedFontIndex];
  const sortLanguages = (
    a: Record<"label" | "tag", string>,
    b: Record<"label" | "tag", string>
  ) => {
    if (!font) {
      return a.label.localeCompare(b.label);
    }
    if (
      font.supportedLanguages.has(a.tag) &&
      !font.supportedLanguages.has(b.tag)
    ) {
      return -1;
    }
    if (
      font.supportedLanguages.has(b.tag) &&
      !font.supportedLanguages.has(a.tag)
    ) {
      return 1;
    }
    return a.label.localeCompare(b.label);
  };
  const sortScripts = (
    a: Record<"label" | "tag", string>,
    b: Record<"label" | "tag", string>
  ) => {
    if (!font) {
      return a.label.localeCompare(b.label);
    }
    if (
      font.supportedScripts.has(a.tag.toLowerCase()) &&
      !font.supportedScripts.has(b.tag.toLowerCase())
    ) {
      return -1;
    }
    if (
      font.supportedScripts.has(b.tag.toLowerCase()) &&
      !font.supportedScripts.has(a.tag.toLowerCase())
    ) {
      return 1;
    }
    return a.label.localeCompare(b.label);
  };
  const featureStateColor = (x: string) => {
    if (!(x in props.featureState)) {
      return "default";
    }
    if (props.featureState[x]) {
      return "primary";
    }
    return "secondary";
  };
  const featureStateIcon = (x: string) => {
    if (!(x in props.featureState)) {
      return <span />;
    }
    if (props.featureState[x]) {
      return <CheckCircleIcon />;
    }
    return <CancelIcon />;
  };

  let features;
  if (font) {
    features = (
      <div>
        <h2 className={classes.smallspace}>Features</h2>
        <TextField
          id="featurestring"
          label="Features"
          onChange={(e) => {
            props.changedFeatureString(e.target.value);
          }}
        />
        {!props.featureString && (
          <div className={classes.chipArray}>
            {font.allFeatureTags().map((x) => (
              <Chip
                key={x}
                onClick={() => {
                  props.changedFeatureState(x);
                }}
                color={featureStateColor(x)}
                icon={featureStateIcon(x)}
                label={x}
              />
            ))}
          </div>
        )}
      </div>
    );
  }
  let axes;
  if (font && font.axes) {
    axes = (
      <FormControl className={classes.formControl}>
        <h2 className={classes.smallspace}>Variation Axes</h2>
        {Object.entries(font.axes).map(([axistag, axis]) => (
          <div key={axistag}>
            <Typography>{axistag}</Typography>
            <Slider
              value={
                typeof props.variations[axistag] === "number"
                  ? props.variations[axistag]
                  : axis.default
              }
              min={axis.min}
              max={axis.max}
              valueLabelDisplay="auto"
              aria-labelledby="input-slider"
              onChange={(e, v) => handleVariationChange(axistag, v)}
            />
          </div>
        ))}
      </FormControl>
    );
  }

  return (
    <Drawer
      className={classes.drawer}
      variant="persistent"
      anchor="right"
      open={props.open}
      classes={{
        paper: classes.drawerPaper,
      }}
    >
      <div className={classes.drawerHeader}>
        <IconButton onClick={handleDrawerClose}>
          {document.dir == "rtl" ? (
            <ChevronLeftIcon />
          ) : (
            <ChevronRightIcon />
          )}
        </IconButton>
      </div>

      <FormControl className={classes.formControl}>
        <InputLabel id="direction-label">Direction</InputLabel>
        <Select
          labelId="direction-label"
          id="direction"
          value={props.direction}
          onChange={(e) => props.changedDirection(e.target.value as string)}
        >
          <MenuItem value="auto">Automatically detect</MenuItem>
          <MenuItem value="ltr">Left to right</MenuItem>
          <MenuItem value="rtl">Right to left</MenuItem>
          <MenuItem value="ttb">Top to bottom</MenuItem>
        </Select>
      </FormControl>
      <Divider />

      <Autocomplete
        freeSolo
        id="script"
        options={harfbuzzScripts.sort(sortScripts)}
        renderOption={(props, option) => (
          <>
            <span className={classes.flag}>
              {font && font.supportedScripts.has(option.tag.toLowerCase())
                ? "✅"
                : " "}
            </span>
            {option.label}
          </>
        )}
        getOptionLabel={(option) => {
          if (typeof option === "string") {
            return option;
          }
          return option.label;
        }}
        onChange={(e, v) => {
          if (!v) {
            return props.changedScript("");
          }
          if (typeof v === "string") {
            return props.changedScript(v);
          }
          return props.changedScript(v.tag);
        }}
        renderInput={(params) => (
          <TextField {...params} label="Script" variant="outlined" />
        )}
      />
      <Autocomplete
        freeSolo
        id="language"
        options={opentypeLanguages.sort(sortLanguages)}
        renderOption={(_props, option) => (
          <>
            <span className={classes.flag}>
              {font && font.supportedLanguages.has(option.tag) ? "✅" : " "}
            </span>
            {option.label}
          </>
        )}
        getOptionLabel={(option) => {
          if (typeof option === "string") {
            return option;
          }
          return option.label;
        }}
        onChange={(e, v) => {
          if (!v) {
            return props.changedLanguage("");
          }
          if (typeof v === "string") {
            return props.changedLanguage(v);
          }
          return props.changedLanguage(v.tag);
        }}
        renderInput={(params) => (
          <TextField {...params} label="Language" variant="outlined" />
        )}
      />
      <Divider />
      {features}
      {axes && <Divider />}
      {axes}
      <Divider />

      <FormControl className={classes.formControl}>
        <InputLabel id="cluster-level-label">Clustering</InputLabel>
        <Select
          labelId="cluster-level-label"
          id="cluster-level"
          value={props.clusterLevel}
          onChange={(e) => props.changedClusterLevel(e.target.value as number)}
        >
          <MenuItem value={0}>Monotone graphemes</MenuItem>
          <MenuItem value={1}>Monotone characters</MenuItem>
          <MenuItem value={2}>Characters</MenuItem>
        </Select>
      </FormControl>
      <FormControl className={classes.formControl}>
        <InputLabel id="buffer-flag-label">Buffer Flags</InputLabel>
        <Select
          labelId="buffer-flag-label"
          id="buffer-flag"
          multiple
          value={props.bufferFlag}
          onChange={(e) => props.changedBufferFlag(e.target.value as string[])}
        >
          <MenuItem value="BOT">Beginning of text paragraph</MenuItem>
          <MenuItem value="EOT">End of text paragraph</MenuItem>
          <MenuItem value="PRESERVE_DEFAULT_IGNORABLES">
            Preserve default ignorables
          </MenuItem>
          <MenuItem value="REMOVE_DEFAULT_IGNORABLES">
            Remove default ignorables
          </MenuItem>
          <MenuItem value="DO_NOT_INSERT_DOTTED_CIRCLE">
            Do not insert dotted circle
          </MenuItem>
        </Select>
      </FormControl>
      <FormControl className={classes.formControl}>
        <FormControlLabel
          control={
            <Checkbox
              name="show-all-lookups"
              checked={props.showAllLookups}
              value={props.showAllLookups}
              onChange={() => {
                props.changedShowAllLookups(!props.showAllLookups);
              }}
            />
          }
          label="Show All Lookups"
        />
        <div>
          Crowbar is using
          {hbSingleton && hbSingleton.version
            ? ` Harfbuzz version ${hbSingleton.version_string()}`
            : " an unknown version of Harfbuzz"}
        </div>
      </FormControl>
    </Drawer>
  );
};

export default connector(MyDrawer);
