/* eslint-disable react/jsx-one-expression-per-line */
import React from "react";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";
import ArrowDropUpIcon from "@material-ui/icons/ArrowDropUp";
import { CrowbarFont, HBGlyph } from "../opentype/CrowbarFont";
import { paletteFor } from "../palette";

export type GlyphBoxProps = {
  glyph: HBGlyph;
  font: CrowbarFont;
  color: string;
};

export const GlyphBox = ({ glyph, font, color }: GlyphBoxProps) => {
  const fGlyph = font.getGlyph(glyph.g);
  const baseOrMark = font.getGlyphClass(glyph.g) === 3 ? "markglyph" : "";
  return (
    <div
      className={`glyphbox ${color} ${baseOrMark}`}
      style={{
        color: paletteFor(glyph.cl),
      }}
    >
      {fGlyph && fGlyph.name} ({glyph.g})
      {(glyph.ax || glyph.ay) && (
        <div>
          {glyph.ax && (
            <span>
              <ArrowForwardIcon /> {glyph.ax}
            </span>
          )}
          {glyph.ay && (
            <span>
              <ArrowUpwardIcon /> {glyph.ay}
            </span>
          )}
        </div>
      )}
      {(glyph.dx || glyph.dy) && (
        <div>
          {glyph.dx && (
            <span>
              <ArrowRightIcon /> {glyph.dx}
            </span>
          )}
          {glyph.dy && (
            <span>
              <ArrowDropUpIcon /> {glyph.dy}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
