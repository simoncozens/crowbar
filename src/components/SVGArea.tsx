import React, { useRef, useEffect } from "react";
import { CrowbarFont, HBGlyph } from "../opentype/CrowbarFont";

type SVGProps = {
  glyphstring: HBGlyph[];
  font: CrowbarFont;
  highlightedglyph: number;
};

function deleteAllChildren(e: any) {
  let child = e.lastElementChild;
  while (child) {
    e.removeChild(child);
    child = e.lastElementChild;
  }
}

export const SVGArea = ({ glyphstring, font, highlightedglyph }: SVGProps) => {
  const svg = useRef(document.createElement("div"));
  // console.log("Rendering glyph string");
  // console.log(glyphstring);
  deleteAllChildren(svg.current);
  font.glyphstringToSVG(glyphstring, highlightedglyph).addTo(svg.current);
  return (
    <div className="svgwrapper">
      <div ref={svg} className="svgbox" />
    </div>
  );
};
