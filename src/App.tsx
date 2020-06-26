import React from "react";
import clsx from "clsx";

import useMediaQuery from "@material-ui/core/useMediaQuery";
import { createMuiTheme, ThemeProvider, makeStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import "./App.css";
import NavBar from "./components/NavBar";
import OutputArea from "./components/OutputArea";
import BigTextBox from "./components/BigTextBox";
import { connect, ConnectedProps } from "react-redux";
import { CrowbarState } from "./store/actions";

const mapStateToProps = (state:CrowbarState) => {
    return { 
        fontFaces: state.fonts.map( (x) => x.fontFace ),
        drawerOpen: state.drawerOpen
    };
};

const connector = connect(mapStateToProps, {});
type PropsFromRedux = ConnectedProps<typeof connector>

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex",
        alignContent: "center"
    },
    drawerHeader: {
        display: "flex",
        alignItems: "center",
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
        justifyContent: "flex-start",
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
        transition: theme.transitions.create("margin", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginRight: -drawerWidth,
    },
    contentShift: {
        transition: theme.transitions.create("margin", {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginRight: 0,
    },
}));
const App = (props: PropsFromRedux) => {
    const classes = useStyles();
    const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

    const theme = React.useMemo(
        () =>
            createMuiTheme({
                palette: {
                    type: prefersDarkMode ? "dark" : "light",
                },
            }),
        [prefersDarkMode],
    );


    return (
        <ThemeProvider theme={theme}>
            <style>
                {props.fontFaces.join("\n")}
            </style>
            <div className={classes.root}>
                <CssBaseline/>
                <main className={clsx(classes.content, {
                    [classes.contentShift]: props.drawerOpen,
                })}
                >
                    <div className={classes.drawerHeader} />
                    <BigTextBox/>
                    <OutputArea/>
                </main>
                <NavBar />
            </div>
        </ThemeProvider>
    );
};

export default connector(App);
