import React from "react";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import { CrowbarFont, HBGlyph } from "../opentype/CrowbarFont";
import { paletteFor } from "../palette";

export type GlyphBoxProps = {
  glyph: HBGlyph;
  font: CrowbarFont;
  color: string;
};

export const GlyphBox = ({ glyph, font, color }: GlyphBoxProps) => {
  const fGlyph = font.getGlyph(glyph.g);
  let baseOrMark = "";
  try {
    if (font.getGlyphClass(glyph.g) === 3) {
      baseOrMark = "markglyph";
    }
  } catch (e) {
    // Stay at empty
    console.log(e);
  }

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
