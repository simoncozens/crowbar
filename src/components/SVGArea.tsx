import React, {useRef, useEffect} from 'react'
import {CrowbarFont, HBGlyph} from '../opentype/CrowbarFont';
import * as SVG from '@svgdotjs/svg.js';
import {paletteFor} from '../palette';

type SVGProps = {
  glyphstring: HBGlyph[],
  font: CrowbarFont
}

function deleteAllChildren(e :any) {
	var child = e.lastElementChild;
  while (child) {
      e.removeChild(child);
      child = e.lastElementChild;
  }
}

function glyphstringToSVG(glyphstring: HBGlyph[], font: CrowbarFont) :SVG.Svg{
	var curAX = 0;
	var curAY = 0;
	var totalSVG = SVG.SVG();
	var maingroup = totalSVG.group();
	for (var g of glyphstring) {
		var group = maingroup.group();
		var svgDoc = SVG.SVG(font.getSVG(g.g));
		for (var c of svgDoc.children()) {
			group.add(c);
		}
		group.transform({translate: [curAX+(g.dx||0), curAY+(g.dy||0)]})
		group.attr({fill: paletteFor(g.cl) })
		curAX += g.ax || 0; curAY += g.ay || 0;
	}
	maingroup.transform({"flip": "y"});
	var box = maingroup.bbox()
	totalSVG.viewbox(box.x, box.y, box.width, box.height);
	return totalSVG;
}

export const SVGArea = ({ glyphstring, font }: SVGProps) => {
	const svg = useRef(document.createElement("div"))
	useEffect(()=>{
				deleteAllChildren(svg.current);
	    	glyphstringToSVG(glyphstring, font).addTo(svg.current);
	}, [glyphstring, font]);
	return <div className="svgwrapper">
	<div ref={svg} className="svgbox"/>
	</div>
}
;
