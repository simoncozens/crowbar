/* eslint-disable react/jsx-props-no-spreading,react/destructuring-assignment */
import React from "react";
import { useTheme } from "@material-ui/core/styles";

import { connect, ConnectedProps } from "react-redux";
import Drawer from "@material-ui/core/Drawer";
import Divider from "@material-ui/core/Divider";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import CancelIcon from "@material-ui/icons/Cancel";
import IconButton from "@material-ui/core/IconButton";
import Chip from "@material-ui/core/Chip";
import Select from "@material-ui/core/Select";
import Slider from "@material-ui/core/Slider";
import Typography from "@material-ui/core/Typography";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Checkbox from "@material-ui/core/Checkbox";
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
  CrowbarState,
} from "../store/actions";
import { CrowbarFont } from "../opentype/CrowbarFont";
import { useStyles } from "../navbarstyles";
import { harfbuzzScripts, opentypeLanguages } from "../opentype/constants";

declare let window: any;

const mapStateToProps = (state: CrowbarState) => ({
  open: state.drawerOpen,
  fonts: state.fonts,
  selectedFontIndex: state.selected_font,
  featureState: state.features,
  featureString: state.featureString,
  clusterLevel: state.clusterLevel,
  variations: state.variations,
  direction: state.direction,
  script: state.script,
  language: state.language,
  bufferFlag: state.bufferFlag,
  showAllLookups: state.showAllLookups,
});

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
  const theme = useTheme();
  const classes = useStyles();
  const handleDrawerClose = () => {
    props.changedDrawerState(false);
  };
  const handleVariationChange = (tag: string, value: number | number[]) => {
    const state = props.variations;
    state[tag] = value;
    props.changedVariations(state);
  };
  const font: CrowbarFont = props.fonts[props.selectedFontIndex];
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
          <div>
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
          {theme.direction === "rtl" ? (
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
        renderOption={(option) => (
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
        renderOption={(option) => (
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
          {window.hbjs && window.hbjs.version
            ? ` Harfbuzz version ${window.hbjs.version_string()}`
            : " an unknown version of Harfbuzz"}
        </div>
      </FormControl>
    </Drawer>
  );
};

export default connector(MyDrawer);
