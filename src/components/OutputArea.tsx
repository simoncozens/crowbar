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
import { diff, Diff, DiffEdit } from 'deep-diff';

const mapStateToProps = (state:CrowbarState) => {
  const font: CrowbarFont = state.fonts[state.selected_font];
  const text: string = state.inputtext
  return {font, text, features: state.features};
};

const useStyles = makeStyles((theme) => ({
  stageheader: {
    backgroundColor: theme.palette.info.main
  }
}));

const connector = connect(mapStateToProps)
type PropsFromRedux = ConnectedProps<typeof connector>

const glyphToHTML = (glyph:HBGlyph, font: CrowbarFont, color:string) => {
	var fGlyph = font.getGlyph(glyph.g);
	return (
		<div className={"glyphbox "+color} style={{
			color: paletteFor(glyph.cl)
		}}
		>
			{fGlyph && fGlyph.name} ({glyph.g})
			{ (glyph.ax||glyph.ay) &&	<div>
					{glyph.ax && <span><ArrowForwardIcon/> {glyph.ax}</span> }
					{glyph.ay && <span><ArrowUpwardIcon/> {glyph.ay}</span> }
				</div>
			}
			{ (glyph.dx || glyph.dy) &&	<div>
				{glyph.dx && <span><ArrowRightIcon/> {glyph.dx}</span> }
				{glyph.dy && <span><ArrowDropUpIcon/> {glyph.dy}</span> }
					</div>
			}

		</div>
	)
};

function processDiffArray(diffOutput: Array<Diff<HBGlyph[], HBGlyph[]>>) : string[] {
	var output = []
	console.log(diffOutput);
	for (var d of diffOutput) {
		if (d.kind == "A") {
			output[d.index] = "glyphadded";
		} else if (d.kind == "E" || d.kind == "N") {
			// @ts-ignore
			output[(d as DiffEdit<HBGlyph[],HBGlyph[]>).path[0]] = "glyphmodified"
		}
	}
	return output
}

const OutputArea = (props: PropsFromRedux) => {
	var classes = useStyles();
	var stage = "GSUB"
	var lastRow: HBGlyph[] = [];
	const rowToHTML = (row:StageMessage, font: CrowbarFont) => {
		var  m = row.m.match(/start table (....)/);
		if (m ) {
			stage = m[1];
			return (
	      <TableRow>
	        <TableCell colSpan={2} className={classes.stageheader}> {m[1]} Stage</TableCell>
	      </TableRow>
			)
		}
		var diffColors: string[];
		diffColors = [];
		if (lastRow) {
			var diffarray = diff(lastRow, row.t);
			if (diffarray) { diffColors = processDiffArray(diffarray) }
		}
		var  m2 = row.m.match(/lookup (\d+)/);
		var featurename = "";
		if (m2) {
			var ix = parseInt(m2[1]);
			featurename = font.getFeatureForIndex(ix, stage);
		}
		lastRow = row.t;
		return (
	    <TableRow key={row.m}>
		    <TableCell>{row.m}
		    {featurename && <br/>}
		    {featurename && <b>{featurename}</b>}
		    </TableCell>
		    <TableCell>
		      {row.t.map((glyph: HBGlyph, ix:number) => glyphToHTML(glyph, font, diffColors[ix]))}
	      </TableCell>
		  </TableRow>
	  )
	}

	if (props.font && props.font.hbFont && props.text) {
		var shaping = props.font.shapeTrace(props.text,props.features);

		console.log("Calling svg with", shaping[shaping.length-1].t)
		lastRow = [];
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

