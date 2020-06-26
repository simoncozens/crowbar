function hbjs(instance) {
  const {exports} = instance;
  const heapu8 = new Uint8Array(exports.memory.buffer);
  const heapu32 = new Uint32Array(exports.memory.buffer);
  const heapi32 = new Int32Array(exports.memory.buffer);
  const utf8Decoder = new TextDecoder("utf8");

  const HB_MEMORY_MODE_WRITABLE = 2;

  function createBlob(blob) {
    const blobPtr = exports.malloc(blob.byteLength);
    heapu8.set(new Uint8Array(blob), blobPtr);
    const ptr = exports.hb_blob_create(blobPtr, blob.byteLength, HB_MEMORY_MODE_WRITABLE, blobPtr, exports.free_ptr());
    return {
      ptr,
      destroy() { exports.hb_blob_destroy(ptr); }
    };
  }
  
  function createFace(blob, index) {
    const ptr = exports.hb_face_create(blob.ptr, index);
    return {
      ptr,
      destroy() { exports.hb_face_destroy(ptr); }
    };
  }

  function createFont(face) {
    const ptr = exports.hb_font_create(face.ptr);
    return {
      ptr,
      setScale(xScale, yScale) {
        exports.hb_font_set_scale(ptr, xScale, yScale);
      },
      destroy() { exports.hb_font_destroy(ptr); }
    };
  }

  const utf8Encoder = new TextEncoder("utf8");
  function createCString(text) {
    const bytes = utf8Encoder.encode(text);
    const ptr = exports.malloc(bytes.byteLength);
    heapu8.set(bytes, ptr);
    return {
      ptr,
      length: bytes.byteLength,
      free() { exports.free(ptr); }
    };
  }

  function createBuffer() {
    const ptr = exports.hb_buffer_create();
    return {
      ptr,
      addText(text) {
        const str = createCString(text);
        exports.hb_buffer_add_utf8(ptr, str.ptr, str.length, 0, str.length);
        str.free();
      },
      guessSegmentProperties() {
        return exports.hb_buffer_guess_segment_properties(ptr);
      },
      setDirection(dir) {
        exports.hb_buffer_set_direction(ptr, {
          ltr: 4,
          rtl: 5,
          ttb: 6,
          btt: 7
        }[dir] || 0);
      },
      setClusterLevel(level) {
        exports.hb_buffer_set_cluster_level(ptr, level);
      },
      shape(font, features) {
        // features are not used yet
        exports.hb_shape(font.ptr, ptr, 0, 0);
      },
      shapeWithTrace(font, features, stop_at, stop_phase) {
        const bufLen = 1024 * 1024;
        const traceBuffer = exports.malloc(bufLen);
        const featurestr = createCString(features);
        const traceLen = exports.hbjs_shape_with_trace(font.ptr, ptr, featurestr.ptr, stop_at, stop_phase, traceBuffer, bufLen);
        const trace =  utf8Decoder.decode(heapu8.slice(traceBuffer, traceBuffer + traceLen -1));
        exports.free(traceBuffer);
        return JSON.parse(trace);
      },
      json(font) {
        const length = exports.hb_buffer_get_length(ptr);
        const result = [];
        const infosPtr32 = exports.hb_buffer_get_glyph_infos(ptr, 0) / 4;
        const positionsPtr32 = exports.hb_buffer_get_glyph_positions(ptr, 0) / 4;
        const infos = heapu32.slice(infosPtr32, infosPtr32 + 5 * length);
        const positions = heapi32.slice(positionsPtr32, positionsPtr32 + 5 * length);
        for (let i = 0; i < length; ++i) {
          result.push({
            g: infos[i * 5 + 0],
            cl: infos[i * 5 + 2],
            ax: positions[i * 5 + 0],
            ay: positions[i * 5 + 1],
            dx: positions[i * 5 + 2],
            dy: positions[i * 5 + 3]
          });
        }
        return result;
      },
      destroy() { exports.hb_buffer_destroy(ptr); }
    };
  }

  function glyphToSvg(font, glyphId) {
    let bufSize = 4096;
    const maxBufSize = 5 * 1024 * 1024;
    while (bufSize < maxBufSize) {
      const pathBuffer = exports.malloc(bufSize);
      const svgLength = exports.hbjs_glyph_svg(font.ptr, glyphId, pathBuffer, bufSize);
      if (svgLength != -1) {
        const path = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000"><path d="${ 
          utf8Decoder.decode(heapu8.slice(pathBuffer, pathBuffer + svgLength)) 
        }"/></svg>`;
        exports.free(pathBuffer);
        return path;
      }
      // Failed, try again with more
      exports.free(pathBuffer);
      bufSize *= 2;
    }
    
  }


  function shape(font, buffer, features) {
    // features are not used yet
    exports.hb_shape(font.ptr, buffer.ptr, 0, 0);
  }

  return {
    createBlob,
    createFace,
    createFont,
    createBuffer,
    shape,
    glyphToSvg
  };
}

// Should be replaced with something more reliable
try { module.exports = hbjs; } catch(e) {}
