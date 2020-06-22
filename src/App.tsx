import React, {useEffect} from 'react';
// import clsx from 'clsx';

import useMediaQuery from '@material-ui/core/useMediaQuery';
import { createMuiTheme, ThemeProvider, makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import './App.css';
import NavBar from './components/NavBar'
import BigTextBox from './components/BigTextBox'
import { connect, ConnectedProps } from 'react-redux'
import { CrowbarState, CrowbarFont } from "./store/actions";
import hbjs from './hbjs';

declare var window: any;

const mapStateToProps = (state:CrowbarState) => {
  return { fontFaces: state.fonts.map( (x) => x.fontFace ),
           };
};

const connector = connect(mapStateToProps, {})
type PropsFromRedux = ConnectedProps<typeof connector>

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    alignContent: 'center'
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-start',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginRight: -drawerWidth,
  },
}));
const App = (props: PropsFromRedux) => {
  const classes = useStyles();
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const theme = React.useMemo(
    () =>
      createMuiTheme({
        palette: {
          type: prefersDarkMode ? 'dark' : 'light',
        },
      }),
    [prefersDarkMode],
  );
  useEffect( () => {
      fetch('/harfbuzz.wasm').then(response =>
        response.arrayBuffer()
      ).then(bytes =>
        WebAssembly.instantiate(bytes)
      ).then(results => {
        var hb = hbjs(results.instance); // Dirty but works
        window["hbjs"] = hb;
      })
  })

  // XXX subscribe to drawer state and set attribute on main
      //   className={clsx(classes.content, {
      //     [classes.contentShift]: open,
      //   })}
      // >

  return (
   <ThemeProvider theme={theme}>
   <style>
            {props.fontFaces.join("\n")}
   </style>
    <div className={classes.root}>
      <CssBaseline/>
      <main className={classes.content}>
        <div className={classes.drawerHeader} />
        <BigTextBox/>
       </main>
      <NavBar />
      </div>
   </ThemeProvider>
  );
};

export default connector(App);
