 
import React, { useCallback } from "react";
import clsx from "clsx";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import MenuIcon from "@mui/icons-material/Menu";
import { useDropzone } from "react-dropzone";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { connect, ConnectedProps } from "react-redux";
import IconButton from "@mui/material/IconButton";
import FontSelect from "./FontSelect";
import { useStyles } from "../navbarstyles";
import {
  addedFontAction,
  changedDrawerState,
} from "../store/crowbarSlice";
import MyDrawer from "./MyDrawer";
import { RootState } from "../store";

const mapStateToProps = (state: RootState) => ({ open: state.crowbar.drawerOpen });

const connector = connect(mapStateToProps, {
  addedFontAction,
  changedDrawerState,
});
type PropsFromRedux = ConnectedProps<typeof connector>;

const NavBar = (props: PropsFromRedux) => {
  const { classes } = useStyles();
  const [shaking, setShaking] = React.useState(false);
  const { open } = props;

  const action = props.addedFontAction;
  const handleDrawerOpen = () => {
    props.changedDrawerState(true);
  };
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const name = acceptedFiles[0].name.toLowerCase();
      if (
        !name.endsWith(".otf") &&
        !name.endsWith(".ttf") &&
        !name.endsWith(".ttc") &&
        !name.endsWith(".otc")
      ) {
        setShaking(true);
      } else {
        action(acceptedFiles[0]);
      }
    },
    [action]
  );

  const { getRootProps, getInputProps, isDragAccept } = useDropzone({
    onDrop,
    noClick: true,
    noKeyboard: true,
    multiple: false,
  });

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
          [classes.dragging]: isDragAccept,
          shake: shaking,
        })}
        onAnimationEnd={() => setShaking(false)}
      >
        <Toolbar>
          <Typography variant="h6" noWrap>
            Crowbar
          </Typography>
          <div className={classes.smallspace} />
          <CloudUploadIcon />
          <div className={classes.tinyspace} />
          <div className={classes.grow}>
            <FontSelect />
          </div>
          <div className={classes.smallspace} />
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="end"
            onClick={handleDrawerOpen}
            className={clsx(open && classes.hide)}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <MyDrawer />
    </div>
  );
};
export default connector(NavBar);
