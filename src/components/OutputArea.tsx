/* eslint-disable no-plusplus,prefer-destructuring,@typescript-eslint/indent,react/jsx-one-expression-per-line */
import React, { useState } from "react";
import { connect, ConnectedProps } from "react-redux";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import { diff, Diff, DiffEdit } from "deep-diff";
import SubdirectoryArrowRightIcon from "@material-ui/icons/SubdirectoryArrowRight";
import { paletteFor } from "../palette";
import { SVGArea } from "./SVGArea";
import { GlyphBox } from "./GlyphBox";

import {
  ShapingOptions,
  CrowbarFont,
  StageMessage,
  HBGlyph,
} from "../opentype/CrowbarFont";
import { CrowbarState } from "../store/actions";

const mapStateToProps = (state: CrowbarState) => {
  const font: CrowbarFont = state.fonts[state.selected_font];
  const text: string = state.inputtext;
  return {
    font,
    text,
    features: state.features,
    featureString: state.featureString,
    clusterLevel: state.clusterLevel,
    direction: state.direction,
    variations: state.variations,
    script: state.script,
    language: state.language,
    bufferFlag: state.bufferFlag,
    showAllLookups: state.showAllLookups,
  };
};

const useStyles = makeStyles((theme) => ({
  stageheader: {
    backgroundColor: theme.palette.info.main,
  },
}));

const connector = connect(mapStateToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;

function processDiffArray(
  diffOutput: Array<Diff<HBGlyph[], HBGlyph[]>>
): string[] {
  const output: string[] = [];
  diffOutput.forEach((d) => {
    if (d.kind === "A") {
      output[d.index] = "glyphadded";
    } else if (d.kind === "E" || d.kind === "N") {
      // @ts-ignore
      output[(d as DiffEdit<HBGlyph[], HBGlyph[]>).path[0]] = "glyphmodified";
    }
  });
  return output;
}

const OutputArea = (props: PropsFromRedux) => {
  const [highlightedGlyph, setHighlightedGlyph] = useState(-1);
  const [glyphStringToBeDrawn, setGlyphStringToBeDrawn] = useState<
    HBGlyph[] | null
  >(null);
  const classes = useStyles();
  let stage = "GSUB";
  let lastRow: HBGlyph[] = [];
  let rowid = 0;
  const { font, text, clusterLevel } = props;

  if (!(font && font.hbFont && text)) {
    return <div />;
  }

  const shaping = font.shapeTrace(text, {
    ...props,
    stopAt: 0,
    stopPhase: 0,
  });
  const fullBuffer = shaping[shaping.length - 1].t;

  const doPartialTrace = (lookup: number, phase: number) => {
    const options: ShapingOptions = {
      ...props,
      stopAt: lookup,
      stopPhase: phase,
    };
    const partialShaping = font.shapeTrace(text, options);
    setGlyphStringToBeDrawn(partialShaping[partialShaping.length - 1].t);
  };

  const rowToHTML = (row: StageMessage) => {
    // console.log(row.m, row.t);
    let m = row.m.match(/Start of shaping/);
    if (m) {
      return clusterLevel === 2 ? (
        <TableRow key={rowid++}>
          <TableCell> Pre-shaping</TableCell>
          <TableCell>
            {row.t.map((glyph) => (
              <div
                className="glyphbox"
                style={{
                  color: paletteFor(glyph.cl),
                }}
              >
                U+
                {glyph.g.toString(16).padStart(4, "0")}
              </div>
            ))}
          </TableCell>
        </TableRow>
      ) : (
        <div />
      );
    }
    m = row.m.match(/(start|end).*(normalize|preprocess)/);
    if (m && row.t[0]) {
      return (
        <TableRow key={rowid++}>
          <TableCell>{row.m}</TableCell>
          <TableCell>
            {row.t.map((glyph) => (
              <div className="glyphbox">
                U+
                {glyph.g.toString(16).padStart(4, "0")}
              </div>
            ))}
          </TableCell>
        </TableRow>
      );
    }
    m = row.m.match(/start table (....)/);
    if (m) {
      stage = m[1];
      return (
        <TableRow key={rowid++}>
          <TableCell colSpan={2} className={classes.stageheader}>
            {" "}
            {m[1]}
            Stage
          </TableCell>
        </TableRow>
      );
    }
    let diffColors: string[];
    diffColors = [];
    if (lastRow) {
      const diffarray = diff(lastRow, row.t);
      if (diffarray) {
        diffColors = processDiffArray(diffarray);
      }
    }
    const m2 = row.m.match(/lookup (\d+)/);
    let featurename = "";
    let debugInfo = null;
    let ix = 0;
    if (m2) {
      ix = parseInt(m2[1], 10);
      featurename = font.getFeatureForIndex(ix, stage);
      debugInfo = font.getDebugInfo(ix, stage);
    }
    lastRow = row.t;
    return (
      <TableRow
        key={rowid++}
        onMouseOver={(ev) => {
          let el = ev.target as HTMLElement;
          while (el.tagName !== "TR" && el.parentElement) {
            el = el.parentElement;
          }
          const index = parseInt(el.getAttribute("data-lookup") || "", 10) || 0;
          doPartialTrace(
            index,
            el.getAttribute("data-stage") === "GSUB" ? 1 : 2
          );
        }}
        onMouseLeave={() => setGlyphStringToBeDrawn(null)}
        data-stage={stage}
        data-lookup={ix}
      >
        <TableCell>
          {row.depth > 1 && <SubdirectoryArrowRightIcon />}
          {row.m}
          {featurename && <br />}
          {featurename && <b>{featurename}</b>}
          {debugInfo && (
            <>
              <br />
              {debugInfo.source} :<b>{debugInfo.name}</b>
            </>
          )}
        </TableCell>
        <TableCell>
          {row.t.map((glyph: HBGlyph, glyphIx: number) => (
            <span
              onMouseEnter={() => setHighlightedGlyph(glyph.cl)}
              onMouseLeave={() => setHighlightedGlyph(-1)}
            >
              <GlyphBox glyph={glyph} font={font} color={diffColors[glyphIx]} />
            </span>
          ))}
        </TableCell>
      </TableRow>
    );
  };

  lastRow = [];
  return (
    <div>
      {shaping[shaping.length - 1] && (
        <SVGArea
          highlightedglyph={highlightedGlyph}
          glyphstring={glyphStringToBeDrawn || fullBuffer}
          font={font}
        />
      )}
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
    </div>
  );
};

export default connector(OutputArea);
