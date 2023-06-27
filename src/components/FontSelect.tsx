import React from "react";
import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import {
  alpha,
  makeStyles,
  createStyles,
  Theme,
} from "@material-ui/core/styles";
import { connect, ConnectedProps } from "react-redux";
import { CrowbarFont } from "../opentype/CrowbarFont";
import { changedFontAction, CrowbarState } from "../store/actions";

const mapStateToProps = (state: CrowbarState) => {
  const { fonts } = state;
  return { fonts, selectedFontIndex: state.selected_font };
};

const connector = connect(mapStateToProps, { changedFontAction });
type PropsFromRedux = ConnectedProps<typeof connector>;

const FontSelect = (props: PropsFromRedux) => {
  const {
    fonts,
    selectedFontIndex,
    changedFontAction: connectedChangedFontAction,
  } = props;
  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    connectedChangedFontAction(event.target.value as number);
  };
  const useStyles = makeStyles((theme: Theme) =>
    createStyles({
      fontSelect: {
        position: "relative",
        borderRadius: theme.shape.borderRadius,
        backgroundColor: alpha(theme.palette.common.white, 0.15),
        "&:hover": {
          backgroundColor: alpha(theme.palette.common.white, 0.25),
        },
        marginRight: 0,
        marginLeft: theme.spacing(1),
        width: "100%",
      },
    })
  );
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
          value={fonts.length > selectedFontIndex ? selectedFontIndex : ""}
        >
          {fonts.map((font: CrowbarFont, ix) => (
            <MenuItem value={ix}>{font.name}</MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};

export default connector(FontSelect);
