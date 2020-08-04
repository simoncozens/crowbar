import React, { useRef, useEffect } from "react";
import * as SVG from "@svgdotjs/svg.js";
import { CrowbarFont, HBGlyph } from "../opentype/CrowbarFont";
import { paletteFor } from "../palette";

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

function glyphstringToSVG(
  glyphstring: HBGlyph[],
  font: CrowbarFont,
  highlightedglyph: number
): SVG.Svg {
  let curAX = 0;
  let curAY = 0;
  const totalSVG = SVG.SVG();
  const maingroup = totalSVG.group();
  glyphstring.forEach((g, ix) => {
    const group = maingroup.group();
    const svgDoc = SVG.SVG(font.getSVG(g.g));
    for (const c of svgDoc.children()) {
      group.add(c);
    }
    group.transform({ translate: [curAX + (g.dx || 0), curAY + (g.dy || 0)] });
    group.attr({ fill: paletteFor(g.cl) });
    if (g.cl == highlightedglyph) {
      const otGlyph = font.getGlyph(g.g);
      if (otGlyph) {
        group
          .rect(
            otGlyph.advanceWidth,
            otGlyph.getMetrics().yMax - otGlyph.getMetrics().yMin
          )
          .stroke({ color: "#f06", width: 5 })
          .fill("none")
          .transform({ translate: [0, otGlyph.getMetrics().yMin] });
      }
    }
    curAX += g.ax || 0;
    curAY += g.ay || 0;
  });
  maingroup.transform({ flip: "y" });
  const box = maingroup.bbox();
  totalSVG.viewbox(box.x, box.y, box.width, box.height);
  return totalSVG;
}

export const SVGArea = ({ glyphstring, font, highlightedglyph }: SVGProps) => {
  const svg = useRef(document.createElement("div"));
  useEffect(() => {
    deleteAllChildren(svg.current);
    glyphstringToSVG(glyphstring, font, highlightedglyph).addTo(svg.current);
  }, [glyphstring, font, highlightedglyph]);
  return (
    <div className="svgwrapper">
      <div ref={svg} className="svgbox" />
    </div>
  );
};
