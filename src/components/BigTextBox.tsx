import React from 'react'
import Input from '@material-ui/core/Input';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { changedTextAction, CrowbarState, CrowbarFont } from "../store/actions";
import { connect, ConnectedProps } from 'react-redux'

const mapStateToProps = (state:CrowbarState) => {
  const font: CrowbarFont = state.fonts[state.selected_font];
  return { fontFamily: font.name };
};

const connector = connect(mapStateToProps, {changedTextAction})
type PropsFromRedux = ConnectedProps<typeof connector>
const useStyles = makeStyles((theme: Theme) =>
createStyles({
  root: {
    ...theme.typography.h2,
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(1),
  },
}));

const BigTextBox = (props: PropsFromRedux) => {
  const classes = useStyles();
  const restyle = {
    'font-family': '"'+props.fontFamily+'"'
  } as React.CSSProperties;
  const handleChange = (e: any) => {
    let value = e.target.value;
    props.changedTextAction(value);
  }
  return (
    <Input
      classes={classes}
      style={restyle}
      onChange={ (e) => handleChange(e) }
      placeholder="ABC abc"
      id="inputtext" />
  )
}


export default connector(BigTextBox)
