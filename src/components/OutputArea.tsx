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
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import {SVGArea} from "./SVGArea";
import {paletteFor} from '../palette';
import {  makeStyles } from '@material-ui/core/styles';

const mapStateToProps = (state:CrowbarState) => {
  const font: CrowbarFont = state.fonts[state.selected_font];
  const text: string = state.inputtext
  return {font, text};
};

const useStyles = makeStyles((theme) => ({
  stageheader: {
    backgroundColor: theme.palette.info.dark
  }
}));

const connector = connect(mapStateToProps)
type PropsFromRedux = ConnectedProps<typeof connector>

const glyphToHTML = (glyph:HBGlyph, font: CrowbarFont) => {
	var fGlyph = font.getGlyph(glyph.g);
	return (
		<div className="glyphbox" style={{color: paletteFor(glyph.cl)}}>
			{fGlyph && fGlyph.name} ({glyph.g})
				<div>&nbsp;
			{glyph.ax && <span><ArrowForwardIcon/> {glyph.ax}</span> }
			{glyph.ay && <span><ArrowUpwardIcon/> {glyph.ay}</span> }
				</div>
				<div>&nbsp;
			{glyph.dx && <span><ArrowRightIcon/> {glyph.dx}</span> }
			{glyph.dy && <span><ArrowDropUpIcon/> {glyph.dy}</span> }
				</div>

		</div>
	)
};


const OutputArea = (props: PropsFromRedux) => {
	var classes = useStyles();

	const rowToHTML = (row:StageMessage, font: CrowbarFont) => {
		var  m = row.m.match(/start table (....)/);
		if (m ) {
			return (
	      <TableRow>
	        <TableCell colSpan={2} className={classes.stageheader}> {m[1]} Stage</TableCell>
	      </TableRow>
			)
		}
		return (
	    <TableRow key={row.m}>
		    <TableCell>{row.m}</TableCell>
		    <TableCell>
		      {row.t.map((glyph: HBGlyph) => glyphToHTML(glyph, font))}
	      </TableCell>
		  </TableRow>
	  )
	}

	if (props.font && props.font.hbFont && props.text) {
		var shaping = props.font.shapeTrace(props.text,"");

		console.log("Calling svg with", shaping[shaping.length-1].t)

		return (
		<div>

		{shaping[shaping.length-1] &&	<SVGArea glyphstring={shaping[shaping.length-1].t} font={props.font} />}
	    <TableContainer component={Paper}>
	      <Table>
	        <TableHead>
	          <TableRow>
	            <TableCell>Stage</TableCell>
	            <TableCell>Glyphs</TableCell>
	          </TableRow>
	        </TableHead>
	      <TableBody>
	        {shaping.map((row: StageMessage) => rowToHTML(row, props.font))}
	      </TableBody>
	      </Table>
	    </TableContainer>
	  </div>
			)
	} else {
		return (
			<div/>
		)
	}
};

export default connector(OutputArea)

