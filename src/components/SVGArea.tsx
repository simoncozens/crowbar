import React, {useRef, useEffect} from "react";
import {CrowbarFont, HBGlyph} from "../opentype/CrowbarFont";
import * as SVG from "@svgdotjs/svg.js";
import {paletteFor} from "../palette";

type SVGProps = {
  glyphstring: HBGlyph[],
  font: CrowbarFont
}

function deleteAllChildren(e :any) {
    let child = e.lastElementChild;
    while (child) {
        e.removeChild(child);
        child = e.lastElementChild;
    }
}

function glyphstringToSVG(glyphstring: HBGlyph[], font: CrowbarFont) :SVG.Svg{
    let curAX = 0;
    let curAY = 0;
    const totalSVG = SVG.SVG();
    const maingroup = totalSVG.group();
    for (const g of glyphstring) {
        const group = maingroup.group();
        const svgDoc = SVG.SVG(font.getSVG(g.g));
        for (const c of svgDoc.children()) {
            group.add(c);
        }
        group.transform({translate: [curAX+(g.dx||0), curAY+(g.dy||0)]});
        group.attr({fill: paletteFor(g.cl) });
        curAX += g.ax || 0; curAY += g.ay || 0;
    }
    maingroup.transform({"flip": "y"});
    const box = maingroup.bbox();
    totalSVG.viewbox(box.x, box.y, box.width, box.height);
    return totalSVG;
}

export const SVGArea = ({ glyphstring, font }: SVGProps) => {
    const svg = useRef(document.createElement("div"));
    useEffect(()=>{
        deleteAllChildren(svg.current);
	    	glyphstringToSVG(glyphstring, font).addTo(svg.current);
    }, [glyphstring, font]);
    return <div className="svgwrapper">
        <div ref={svg} className="svgbox"/>
    </div>;
}
;
