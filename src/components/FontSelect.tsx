import React from "react";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import { makeStyles, createStyles } from "@mui/styles";
import {
  alpha,
  useTheme,
} from "@mui/material/styles";
import { connect, ConnectedProps } from "react-redux";
import { CrowbarFont } from "../opentype/CrowbarFont";
import { changedFontAction } from "../store/crowbarSlice";
import { RootState } from "../store";

const mapStateToProps = (state: RootState) => {
  const { fonts } = state.crowbar;
  return { fonts, selectedFontIndex: state.crowbar.selected_font };
};

const connector = connect(mapStateToProps, { changedFontAction });
type PropsFromRedux = ConnectedProps<typeof connector>;

const FontSelect = (props: PropsFromRedux) => {
  const {
    fonts,
    selectedFontIndex,
    changedFontAction: connectedChangedFontAction,
  } = props;
  const handleChange = (event: SelectChangeEvent<number>) => {
    connectedChangedFontAction(event.target.value);
  };
  const origTheme = useTheme();
  const useStyles = makeStyles(() => {
    return createStyles({
      fontSelect: {
        position: "relative",
        borderRadius: origTheme.shape.borderRadius,
        backgroundColor: alpha(origTheme.palette.common.white, 0.15),
        "&:hover": {
          backgroundColor: alpha(origTheme.palette.common.white, 0.25),
        },
        marginRight: 0,
        marginLeft: origTheme.spacing(1),
        width: "100%",
      },
    })
});
  const classes = useStyles();

  return (
    <div>
      <FormControl className={classes.fontSelect}>
        <InputLabel id="font-select-label">
          Drag and drop to load a font
        </InputLabel>
        <Select
          labelId="font-select-label"
          id="font-select"
          onChange={handleChange}
          value={(fonts || []).length > selectedFontIndex ? selectedFontIndex : ""}
        >
          {(fonts || []).map((font: CrowbarFont, ix) => (
            <MenuItem value={ix} key={ix}>{font.name}</MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};

export default connector(FontSelect);
