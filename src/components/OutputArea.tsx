import React from 'react'
import { CrowbarState } from "../store/actions";
import { connect, ConnectedProps } from 'react-redux'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import {CrowbarFont, StageMessage, HBGlyph} from '../opentype/CrowbarFont';

const mapStateToProps = (state:CrowbarState) => {
  const font: CrowbarFont = state.fonts[state.selected_font];
  const text: string = state.inputtext
  return {font, text};
};

const connector = connect(mapStateToProps)
type PropsFromRedux = ConnectedProps<typeof connector>

const glyphToHTML = (glyph:HBGlyph) => {
	return (
		<TableCell>{glyph.g}</TableCell>
	)
};

const rowToHTML = (row:StageMessage) => {
	var  m = row.m.match(/start table (....)/);
	if (m ) {
		return (
      <TableRow>
        <TableCell colSpan={2}> {m[1]} Stage</TableCell>
      </TableRow>
		)
	}
	return (
    <TableRow key={row.m}>
	    <TableCell>{row.m}</TableCell>
      {row.t.map((glyph: HBGlyph) => glyphToHTML(glyph))}
	  </TableRow>
  )
}
const OutputArea = (props: PropsFromRedux) => {
	console.log(props);
	if (props.font && props.font.hbFont && props.text) {
		var shaping = props.font.shapeTrace(props.text,"");
		return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Stage</TableCell>
            <TableCell>Glyphs</TableCell>
          </TableRow>
        </TableHead>
      <TableBody>
        {shaping.map((row: StageMessage) => rowToHTML(row))}
      </TableBody>
      </Table>
    </TableContainer>

			)
	} else {
		return (
			<div/>
		)
	}
};

export default connector(OutputArea)

