import React, {useState} from "react";
import { connect, ConnectedProps } from "react-redux";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";
import ArrowDropUpIcon from "@material-ui/icons/ArrowDropUp";
import {  makeStyles } from "@material-ui/core/styles";
import { diff, Diff, DiffEdit } from "deep-diff";
import SubdirectoryArrowRightIcon from "@material-ui/icons/SubdirectoryArrowRight";
import {paletteFor} from "../palette";
import {SVGArea} from "./SVGArea";
import { ShapingOptions, CrowbarFont, StageMessage, HBGlyph} from "../opentype/CrowbarFont";
import { CrowbarState } from "../store/actions";

const mapStateToProps = (state:CrowbarState) => {
  const font: CrowbarFont = state.fonts[state.selected_font];
  const text: string = state.inputtext;
  return {font, text,
    features: state.features,
    clusterLevel: state.clusterLevel,
    direction: state.direction
  };
};

const useStyles = makeStyles((theme) => ({
  stageheader: {
    backgroundColor: theme.palette.info.main
  }
}));

const connector = connect(mapStateToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;

const glyphToHTML = (glyph:HBGlyph, font: CrowbarFont, color:string) => {
  const fGlyph = font.getGlyph(glyph.g);
  var baseOrMark = font.getGlyphClass(glyph.g) == 3 ? "markglyph" : "";
  return (
    <div
      className={`glyphbox ${color} ${baseOrMark}`}
      style={{
        color: paletteFor(glyph.cl)
      }}
    >
      {fGlyph && fGlyph.name}
      {" "}
      (
      {glyph.g}
      )
      { (glyph.ax||glyph.ay) &&	(
      <div>
        {glyph.ax && (
        <span>
          <ArrowForwardIcon /> 
          {" "}
          {glyph.ax}
        </span>
        ) }
        {glyph.ay && (
        <span>
          <ArrowUpwardIcon /> 
          {" "}
          {glyph.ay}
        </span>
        ) }
      </div>
      )}
      { (glyph.dx || glyph.dy) &&	(
      <div>
        {glyph.dx && (
        <span>
          <ArrowRightIcon /> 
          {" "}
          {glyph.dx}
        </span>
        ) }
        {glyph.dy && (
        <span>
          <ArrowDropUpIcon /> 
          {" "}
          {glyph.dy}
        </span>
        ) }
      </div>
      )}

    </div>
  );
};

function processDiffArray(diffOutput: Array<Diff<HBGlyph[], HBGlyph[]>>) : string[] {
  const output = [];
  for (const d of diffOutput) {
    if (d.kind === "A") {
      output[d.index] = "glyphadded";
    } else if (d.kind === "E" || d.kind === "N") {
      // @ts-ignore
      output[(d as DiffEdit<HBGlyph[], HBGlyph[]>).path[0]] = "glyphmodified";
    }
  }
  return output;
}

const OutputArea = (props: PropsFromRedux) => {
  const [glyphStringToBeDrawn, setGlyphStringToBeDrawn] = useState();
  const [oldText, setOldText] = useState();
  const classes = useStyles();
  let stage = "GSUB";
  let lastRow: HBGlyph[] = [];
  let rowid = 0;

  const doPartialTrace = (lookup: number, phase: number) => {
    console.log("Shaping up to ", lookup, phase);
    var options :ShapingOptions = {
       features: props.features,
       clusterLevel: props.clusterLevel,
       stopAt: lookup,
       stopPhase: phase,
       direction: props.direction
    }
    const shaping = props.font.shapeTrace(props.text, options);
    setGlyphStringToBeDrawn(shaping[shaping.length-1].t);
  };

  const rowToHTML = (row:StageMessage, font: CrowbarFont, fullBuffer: HBGlyph[]) => {
    var  m = row.m.match(/Start of shaping/);
    if (m) {
      return props.clusterLevel == 2 ? (
        <TableRow key={rowid++}>
          <TableCell> Pre-shaping</TableCell>
          <TableCell>
            {row.t.map( (glyph) => (
              <div
                className="glyphbox"
                style={{
                  color: paletteFor(glyph.cl)
                }}
              >
                U+
                {glyph.g.toString(16).padStart(4, "0")}
              </div>
            )
	        )}
          </TableCell>
        </TableRow>
      ) : (<div />);
    }
    var  m = row.m.match(/start table (....)/);
    if (m ) {
      stage = m[1];
      return (
        <TableRow key={rowid++}>
          <TableCell colSpan={2} className={classes.stageheader}> 
            {" "}
            {m[1]}
            {" "}
            Stage
          </TableCell>
        </TableRow>
      );
    }
    let diffColors: string[];
    diffColors = [];
    if (lastRow) {
      const diffarray = diff(lastRow, row.t);
      if (diffarray) { diffColors = processDiffArray(diffarray); }
    }
    const  m2 = row.m.match(/lookup (\d+)/);
    let featurename = "";
    let ix  = 0;
    if (m2) {
      ix = parseInt(m2[1]);
      featurename = font.getFeatureForIndex(ix, stage);
    }
    lastRow = row.t;
    return (
      <TableRow
        key={rowid++}
        onMouseOver={(ev) => {
	    		let el = ev.target as HTMLElement;
	    		while (el.tagName != "TR" && el.parentElement) { el = el.parentElement; }
	    		console.log(el);
	    		const index = parseInt(el.getAttribute("data-lookup")||"") || 0;
	    		doPartialTrace(index, (el.getAttribute("data-stage")=="GSUB") ? 1 : 2);
	    	}}
        onMouseLeave={() => setGlyphStringToBeDrawn(fullBuffer)}
        data-stage={stage}
        data-lookup={ix}
      >
        <TableCell>
          {row.depth >1 && <SubdirectoryArrowRightIcon /> }
          {row.m}
          {featurename && <br />}
          {featurename && <b>{featurename}</b>}
        </TableCell>
        <TableCell>
          {row.t.map((glyph: HBGlyph, ix:number) => glyphToHTML(glyph, font, diffColors[ix]))}
        </TableCell>
      </TableRow>
	  );
  };

  if (props.font && props.font.hbFont && props.text) {
    const shaping = props.font.shapeTrace(props.text, {
      features: props.features,
      clusterLevel: props.clusterLevel,
      direction: props.direction,
      stopAt: 0,
      stopPhase: 0
    });
    const fullBuffer = shaping[shaping.length-1].t;
    if (props.text != oldText) {
      setGlyphStringToBeDrawn(fullBuffer);
      setOldText(props.text);
    }
    lastRow = [];
    return (
      <div>

        {shaping[shaping.length-1] &&	<SVGArea glyphstring={glyphStringToBeDrawn} font={props.font} />}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Stage</TableCell>
                <TableCell>Glyphs</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {shaping.map((row: StageMessage) => rowToHTML(row, props.font, fullBuffer))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    );
  } 
  return (
    <div />
  );
    
};

export default connector(OutputArea);

