import React from "react";
import { useTheme } from "@material-ui/core/styles";

import { connect, ConnectedProps } from "react-redux";
import Drawer from "@material-ui/core/Drawer";
import Divider from "@material-ui/core/Divider";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import IconButton from "@material-ui/core/IconButton";
import Chip from "@material-ui/core/Chip";
import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import { changedDrawerState, changedDirection, changedScript, changedLanguage,
  changedFeatureState, changedClusterLevel, CrowbarState } from "../store/actions";
import {CrowbarFont } from "../opentype/CrowbarFont";
import {useStyles } from "../navbarstyles";
import {harfbuzzScripts, opentypeLanguages } from "../opentype/constants";
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';

const mapStateToProps = (state:CrowbarState) => {
  return { open: state.drawerOpen,
    fonts: state.fonts,
    selectedFontIndex: state.selected_font,
    featureState: state.features,
    clusterLevel: state.clusterLevel,
    direction: state.direction,
    script: state.script,
    language: state.language,
  };
};

const connector = connect(mapStateToProps, {changedDirection, changedScript, changedLanguage, changedDrawerState, changedFeatureState, changedClusterLevel});
type PropsFromRedux = ConnectedProps<typeof connector>;

const MyDrawer = (props: PropsFromRedux) => {
  const theme = useTheme();
  const classes = useStyles();
  const handleDrawerClose = () => { props.changedDrawerState(false); };
  const font: CrowbarFont = props.fonts[props.selectedFontIndex];
  let features;
  if (font) {
    features = (
      <div>
        <h2 className={classes.smallspace}>Features</h2>
        <div className={classes.chipArray}>
          { font.allFeatureTags().map( (x) => (
            <Chip
              key={x}
              onClick={() => { props.changedFeatureState(x); }}
              color={
                        (!(x in props.featureState) ? "default"
                          : (props.featureState[x] ? "primary" : "secondary"
                          ))
                    }
              label={x}
            />
          )
          ) }
        </div>
      </div>
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
          {theme.direction === "rtl" ? <ChevronLeftIcon /> : <ChevronRightIcon />}
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
          <MenuItem value={"auto"}>Automatically detect</MenuItem>
          <MenuItem value={"ltr"}>Left to right</MenuItem>
          <MenuItem value={"rtl"}>Right to left</MenuItem>
          <MenuItem value={"ttb"}>Top to bottom</MenuItem>
        </Select>
      </FormControl>
      <Divider />

      <Autocomplete
        id="script"
        options={harfbuzzScripts}
        getOptionLabel={(option) => option.label}
        onChange={(e,v) => props.changedScript(v ? v.tag : "")}
        renderInput={(params) => <TextField {...params} label="Script" variant="outlined" />}
      />
      <Autocomplete
        id="language"
        options={opentypeLanguages}
        getOptionLabel={(option) => option.label}
        onChange={(e,v) => props.changedLanguage(v ? v.tag : "")}
        renderInput={(params) => <TextField {...params} label="Language" variant="outlined" />}
      />
      <Divider />
      {features}
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

    </Drawer>
  );

};

export default connector(MyDrawer);
