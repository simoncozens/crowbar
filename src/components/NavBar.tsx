import React, {useCallback} from "react";
import clsx from "clsx";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import MenuIcon from "@material-ui/icons/Menu";
import FontSelect from "./FontSelect";
import {useDropzone} from "react-dropzone";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import {useStyles } from "../navbarstyles";
import { connect, ConnectedProps } from "react-redux";
import { addedFontAction, CrowbarState, changedDrawerState } from "../store/actions";
import MyDrawer from "./MyDrawer";
import IconButton from "@material-ui/core/IconButton";

const mapStateToProps = (state:CrowbarState) => {
    return { open: state.drawerOpen };
};

const connector = connect(mapStateToProps, {addedFontAction, changedDrawerState});
type PropsFromRedux = ConnectedProps<typeof connector>

const NavBar = (props: PropsFromRedux) => {
    const classes = useStyles();
    const [shaking, setShaking] = React.useState(false);

    const action = props.addedFontAction;
    const handleDrawerOpen = () => { props.changedDrawerState(true); };
    const onDrop = useCallback(acceptedFiles => {
        if (!acceptedFiles[0].name.endsWith(".otf") &&
        !acceptedFiles[0].name.endsWith(".ttf")) {
            setShaking(true);
        } else {
            action(acceptedFiles[0]);
        }
    }, [action]);

    const {getRootProps, getInputProps, isDragAccept,
    } = useDropzone({onDrop,
        noClick: true,
        noKeyboard: true,
        multiple: false
    });

    return(
        <div {...getRootProps()}>
            <input {...getInputProps()} />
            <AppBar
                position="fixed"
                className={clsx(classes.appBar, {
                    [classes.appBarShift]: props.open,
                    [classes.dragging]: isDragAccept,
                    "shake": shaking
                })}
                onAnimationEnd={() => setShaking(false)}
            >
                <Toolbar>
                    <Typography variant="h6" noWrap>
            Crowbar
                    </Typography>
                    <div className={classes.smallspace}/>
                    <CloudUploadIcon/>
                    <div className={classes.tinyspace}/>
                    <div className={classes.grow}>
                        <FontSelect/>
                    </div>
                    <div className={classes.smallspace}/>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="end"
                        onClick={handleDrawerOpen}
                        className={clsx(props.open && classes.hide)}
                    >
                        <MenuIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>
            <MyDrawer/>
        </div>
    );
};
export default connector(NavBar);
