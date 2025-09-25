import React from "react";
import clsx from "clsx";

import { makeStyles } from 'tss-react/mui';
import { createTheme, StyledEngineProvider, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import "./App.css";
import { connect, ConnectedProps } from "react-redux";
import NavBar from "./components/NavBar";
import OutputArea from "./components/OutputArea";
import BigTextBox from "./components/BigTextBox";

const mapStateToProps = (state: RootState) => ({
  fontFaces: state.crowbar.fonts.map((x) => x.fontFace),
  drawerOpen: state.crowbar.drawerOpen,
});

const connector = connect(mapStateToProps, {});
type PropsFromRedux = ConnectedProps<typeof connector>;

const drawerWidth = 240;

import { Theme } from '@mui/material/styles';
import { RootState } from "./store";

declare module '@mui/styles/defaultTheme' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface DefaultTheme extends Theme {}
}

const theme = createTheme({
  colorSchemes: {
    dark: true,
  },
  palette: {
    mode: 'dark',
    primary: {
      main: '#ff5252',
    },
  },
});

const useStyles = makeStyles()((theme) => {
  return {
    root: {
      display: "flex",
      alignContent: "center",
    },
    drawerHeader: {
      display: "flex",
      alignItems: "center",
      padding: theme.spacing(0, 1),
      // necessary for content to be below app bar
      justifyContent: "flex-start",
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
      // transition: theme.transitions.create("margin", {
      //   easing: theme.transitions.easing.sharp,
      //   duration: theme.transitions.duration.leavingScreen,
      // }),
      marginRight: -drawerWidth,
    },
    contentShift: {
      // transition: theme.transitions.create("margin", {
      //   easing: theme.transitions.easing.easeOut,
      //   duration: theme.transitions.duration.enteringScreen,
      // }),
      marginRight: 0,
    },
  };
});

function Component(props: PropsFromRedux) {
  const { fontFaces, drawerOpen } = props;
  const { classes } = useStyles();
  return (
    <div className={classes.root}>
      <style>{fontFaces.join("\n")}</style>
      <CssBaseline />
      <main
        className={clsx(classes.content, {
          [classes.contentShift]: drawerOpen,
        })}
      >
        <div className={classes.drawerHeader} />
        <BigTextBox />
        <OutputArea />
      </main>
      <NavBar />
    </div>
  );
}

const App = (props: PropsFromRedux) => {

  return (
    <StyledEngineProvider injectFirst>
    <ThemeProvider theme={theme}>
      <Component {...props} />
    </ThemeProvider>
    </StyledEngineProvider>
  );
};

export default connector(App);
