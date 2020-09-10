import { Font, load, Glyph, Path } from "opentype.js";
import * as SVG from "@svgdotjs/svg.js";
import { paletteFor } from "../palette";

declare let window: any;

export interface HBGlyph {
  g: number;
  cl: number;
  offset: number;
  dx?: number;
  dy?: number;
  ax?: number;
  ay?: number;
}

export interface StageMessage {
  m: string;
  t: HBGlyph[];
  depth: number;
}

export interface ShapingOptions {
  features: any;
  clusterLevel: number;
  stopAt: number;
  stopPhase: number;
  direction: string;
  script: string;
  language: string;
}

function onlyUnique(value: any, index: number, self: any) {
  return self.indexOf(value) === index;
}

function _arrayBufferToBase64(buffer: ArrayBuffer) {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function remapClusters(glyphs: HBGlyph[], clustermap: number[]) {
  // We want cluster IDs to be sequential,
  // not based on UTF8 offset
  glyphs.forEach((glyph: HBGlyph, ix: number) => {
    if (!glyph.offset) {
      glyph.offset = glyph.cl;
    }
    if (clustermap.indexOf(glyph.offset) === -1) {
      clustermap.push(glyph.offset);
    }
    glyph.cl = clustermap.indexOf(glyph.offset);
  });
}

export class CrowbarFont {
  name: string;
  base64?: string;
  fontFace?: string;
  hbFont?: any;
  otFont?: Font;

  constructor(name: string, fontBlob?: ArrayBuffer) {
    this.name = name;
    if (fontBlob) {
      this.base64 = `data:application/octet-stream;base64,${_arrayBufferToBase64(
        fontBlob
      )}`;
      this.fontFace = `@font-face{font-family:"${name}"; src:url(${this.base64});}`;
      const hbjs = window["hbjs"];
      const blob = hbjs.createBlob(fontBlob);
      const face = hbjs.createFace(blob, 0);
      this.hbFont = hbjs.createFont(face);
    }
    return this;
  }

  initOT(cb: any) {
    const that = this;
    load(this.base64 as string, function (err, otFont) {
      that.otFont = otFont;
      cb(that);
    });
  }

  getSVG(gid: number): any {
    let svgText = this.hbFont.glyphToPath(gid);
    if (svgText.length < 10) {
      const glyph = this.getGlyph(gid);
      if (glyph) {
        svgText = (glyph.path as Path).toSVG(2);
      }
    } else {
      svgText = `<path d="${svgText}"/>`;
    }
    svgText = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000">${svgText} </svg>`;
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgText, "image/svg+xml");
    return doc.documentElement;
  }

  shapeTrace(s: string, options: ShapingOptions): StageMessage[] {
    const hbjs = window["hbjs"];
    const featurestring = Object.keys(options.features)
      .map((f) => (options.features[f] ? "+" : "-") + f)
      .join(",");
    const font = this.hbFont;
    const buffer = hbjs.createBuffer();
    buffer.setClusterLevel(options.clusterLevel);
    buffer.addText(s);
    buffer.guessSegmentProperties();
    console.log(options);
    console.log(featurestring);
    if (options.direction !== "auto") {
      buffer.setDirection(options.direction);
    }
    if (options.script !== "") {
      buffer.setScript(options.script);
    }
    if (options.language !== "") {
      buffer.setLanguage(options.language);
    }

    const preshape = buffer.json();

    const result: StageMessage[] = hbjs.shapeWithTrace(
      font,
      buffer,
      featurestring,
      options.stopAt,
      options.stopPhase
    );
    console.log("Bare result:");
    console.log(result);
    result.unshift({ m: "Start of shaping", t: preshape, depth: 0 });
    const clustermap: number[] = [];

    // Set depths
    let depth = 0;
    result.forEach((r: StageMessage) => {
      if (r.m.startsWith("start lookup")) {
        depth++;
      }
      r.depth = depth;
      if (r.m.startsWith("end lookup")) {
        depth--;
      }
      remapClusters(r.t, clustermap);
    });
    // Reduce this
    const newResult: StageMessage[] = [];
    let lastBuf = "";
    result.forEach((r: StageMessage, ix: number) => {
      if (r.m.startsWith("start table") || r.m.endsWith("start table")) {
        r.t = [];
        newResult.push(r);
        return;
      }
      if (
        JSON.stringify(r.t) !== lastBuf ||
        (r.m.startsWith("start lookup") &&
          result[ix + 1] &&
          result[ix + 1].depth! > r.depth!)
      ) {
        lastBuf = JSON.stringify(r.t);
        newResult.push(r);
      }
    });
    const endbuffer = buffer.json();
    remapClusters(endbuffer, clustermap);
    newResult.push({ m: "End of shaping", t: endbuffer, depth: 0 });
    for (const r of newResult) {
      for (const t of r.t) {
        if (!t.ax || t.ax === 0) {
          delete t.ax;
        }
        if (!t.ay || t.ay === 0) {
          delete t.ay;
        }
        if (!t.dx || t.dx === 0) {
          delete t.dx;
        }
        if (!t.dy || t.dy === 0) {
          delete t.dy;
        }
      }
    }

    return newResult;
  }

  getGlyph(gid: number): Glyph | null {
    if (!this.otFont) {
      return null;
    }
    return this.otFont.glyphs.get(gid);
  }

  gsubFeatureTags(): string[] {
    if (!this.otFont) {
      return [];
    }
    if (!this.otFont.tables.gsub) {
      return [];
    }
    return this.otFont.tables.gsub.features
      .map((x: any) => x.tag)
      .filter(onlyUnique);
  }

  gposFeatureTags(): string[] {
    if (!this.otFont) {
      return [];
    }
    if (!this.otFont.tables.gpos) {
      return [];
    }
    return this.otFont.tables.gpos.features
      .map((x: any) => x.tag)
      .filter(onlyUnique);
  }

  allFeatureTags(): string[] {
    return [...this.gsubFeatureTags(), ...this.gposFeatureTags()].filter(
      onlyUnique
    );
  }

  getFeatureForIndex(ix: number, stage: string) {
    let features;
    if (!this.otFont) {
      return "";
    }
    if (stage === "GSUB") {
      features = this.otFont.tables.gsub.features;
    } else {
      features = this.otFont.tables.gpos.features;
    }
    const featuremap = [];
    for (const f of features.filter(onlyUnique)) {
      var li: number;
      for (li of f.feature.lookupListIndexes) {
        featuremap[li] = f.tag;
      }
    }
    return featuremap[ix];
  }

  getGlyphClass(ix: number): number {
    // Requires my crowbar branch of opentype.js
    if (!this.otFont) {
      return 0;
    }
    if (!this.otFont.tables.gdef) {
      return 0;
    }
    // Types are wrong
    // @ts-ignore
    return this.otFont.position.getGlyphClass(
      this.otFont.tables.gdef.classDef,
      ix
    );
  }

  glyphstringToSVG(glyphstring: HBGlyph[], highlightedglyph: number): SVG.Svg {
    let curAX = 0;
    let curAY = 0;
    const totalSVG = SVG.SVG();
    const maingroup = totalSVG.group();
    glyphstring.forEach((g, ix) => {
      const group = maingroup.group();
      const svgDoc = SVG.SVG(this.getSVG(g.g));
      for (const c of svgDoc.children()) {
        group.add(c);
      }
      group.transform({
        translate: [curAX + (g.dx || 0), curAY + (g.dy || 0)],
      });
      group.attr({ fill: paletteFor(g.cl) });
      if (g.cl == highlightedglyph) {
        const otGlyph = this.getGlyph(g.g);
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
}
