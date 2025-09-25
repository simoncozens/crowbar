import React from "react";
import Input from "@mui/material/Input";
import { makeStyles } from 'tss-react/mui';
import { connect, ConnectedProps } from "react-redux";
import { changedTextAction } from "../store/crowbarSlice";
import { CrowbarFont } from "../opentype/CrowbarFont";
import { useTheme } from "@mui/material/styles";
import { RootState } from "../store";

const mapStateToProps = (state: RootState) => {
  const font: CrowbarFont = state.crowbar.fonts[state.crowbar.selected_font];
  return { font };
};

const connector = connect(mapStateToProps, { changedTextAction });
type PropsFromRedux = ConnectedProps<typeof connector>;
const useStyles = makeStyles()((theme) =>
  ({
    root: {
      backgroundColor: theme.palette.background.paper,
      padding: theme.spacing(1),
    }
  }));

const BigTextBox = (props: PropsFromRedux) => {
  const { font, changedTextAction: connectedChangedTextAction } = props;
  const { classes } = useStyles();
  let restyle;
  if (font) {
    restyle = { fontFamily: `"${font.name}"` } as React.CSSProperties;
  }
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    connectedChangedTextAction(value);
  };
  return (
    <Input
      classes={classes}
      style={restyle}
      onChange={handleChange}
      placeholder="ABC abc"
      id="inputtext"
    />
  );
};

export default connector(BigTextBox);
