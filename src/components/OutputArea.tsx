import React from 'react'
import Input from '@material-ui/core/Input';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { CrowbarState, CrowbarFont } from "../store/actions";
import { connect, ConnectedProps } from 'react-redux'
import {shapeTrace} from '../opentype/shaper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const mapStateToProps = (state:CrowbarState) => {
  const font: CrowbarFont = state.fonts[state.selected_font];
  const text: string = state.inputtext
  return {font, text};
};

const connector = connect(mapStateToProps)
type PropsFromRedux = ConnectedProps<typeof connector>

const OutputArea = (props: PropsFromRedux) => {
	console.log(props);
	if (props.font && props.font.hbFont && props.text) {
		var shaping = shapeTrace(props.text, props.font, "");
		return(<div/>);
		// return (
  //   <TableContainer component={Paper}>
  //     <Table>
  //       <TableHead>
  //         <TableRow>
  //           <TableCell>Stage</TableCell>
  //           <TableCell>Glyphs</TableCell>
  //         </TableRow>
  //       </TableHead>
  //     <TableBody>
  //       {shaping.map((row: any) => (
  //           <TableRow key={row.m}>
  //             <TableCell>{row.m}</TableCell>
  //             <TableCell>{JSON.stringify(row.t)}</TableCell>
  //           </TableRow>
  //       ))}
  //     </TableBody>
  //     </Table>
  //   </TableContainer>

		// 	)
	} else {
		return (
			<div/>
		)
	}
};

export default connector(OutputArea)

