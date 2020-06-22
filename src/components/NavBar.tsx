import React, {useCallback} from 'react'
import clsx from 'clsx';
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import { useTheme } from '@material-ui/core/styles';
import FontSelect from './FontSelect'
import {useDropzone} from 'react-dropzone'
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import {useStyles } from '../navbarstyles';
import { connect, ConnectedProps } from 'react-redux'
import { addedFontAction } from "../store/actions";


const connector = connect(null, {addedFontAction})
type PropsFromRedux = ConnectedProps<typeof connector>

const NavBar = (props: PropsFromRedux) => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [shaking, setShaking] = React.useState(false);
  const handleDrawerOpen = () => {setOpen(true); };
  const handleDrawerClose = () => {setOpen(false); };

  const theme = useTheme();
  var action = props.addedFontAction;
  const onDrop = useCallback(acceptedFiles => {
    if (!acceptedFiles[0].name.endsWith(".otf") &&
        !acceptedFiles[0].name.endsWith(".ttf")) {
      setShaking(true)
    } else {
      action(acceptedFiles[0])
    }
  }, [action])

  const {getRootProps, getInputProps, isDragAccept,
  } = useDropzone({onDrop,
      noClick: true,
      noKeyboard: true,
      multiple: false
  })

    return(
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
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
            className={clsx(open && classes.hide)}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
            <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="right"
        open={open}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </div>
        <Divider />
        <List>
          {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
            <ListItem button key={text}>
              <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
      </Drawer>
    </div>
    )
}
export default connector(NavBar);
