import React from 'react'
import { useTheme } from '@material-ui/core/styles';

import {useStyles } from '../navbarstyles';
import {CrowbarFont } from '../opentype/CrowbarFont';
import { connect, ConnectedProps } from 'react-redux'
import { changedDrawerState, changedFeatureState, CrowbarState } from "../store/actions";
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import IconButton from '@material-ui/core/IconButton';
import Chip from '@material-ui/core/Chip';

const mapStateToProps = (state:CrowbarState) => {
  return { open: state.drawerOpen,
   fonts: state.fonts,
   selectedFontIndex: state.selected_font,
   featureState: state.features
  };
};

const connector = connect(mapStateToProps, {changedDrawerState, changedFeatureState})
type PropsFromRedux = ConnectedProps<typeof connector>

const MyDrawer = (props: PropsFromRedux) => {
  const theme = useTheme();
  const classes = useStyles();
  const handleDrawerClose = () => { props.changedDrawerState(false); };
  var font: CrowbarFont = props.fonts[props.selectedFontIndex];
  var features;
  if (font) {
    features = <div>
      <h2 className={classes.smallspace}>Features</h2>
      <div className={classes.chipArray}>
        { font.allFeatureTags().map( (x) => <Chip
          key={x}
          onClick={ () => { props.changedFeatureState(x) }}
          color={
              (!(x in props.featureState) ? "default"
                  : (props.featureState[x] ? "primary" : "secondary"
                    ))
            }
          label={x}
          />
        ) }
      </div>
    </div>
  }

  return <Drawer
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
            {theme.direction === 'rtl' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </div>
        <Divider />
        {features}
      </Drawer>

}

export default connector(MyDrawer);
