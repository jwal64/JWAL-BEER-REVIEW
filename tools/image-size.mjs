// Reads an image's pixel dimensions out of its header bytes. No dependencies,
// and no decoding: the audit only needs to know whether what came back is a
// real logo or a 16px favicon.
//
// Vectors have no pixel size — they are as sharp as the space you give them —
// so they report Infinity, which is the truth for the question being asked.
export function imageSize(buf) {
  if (buf.length < 16) return null;
  const a = buf;

  // SVG — text, sniffed rather than parsed
  const head = a.subarray(0, 512).toString('utf8');
  if (/^\s*(<\?xml|<!--|<svg)/i.test(head) && /<svg[\s>]/i.test(head))
    return { w: Infinity, h: Infinity, type: 'svg' };

  // PNG: 8-byte signature, then IHDR with width/height as big-endian uint32
  if (a[0] === 0x89 && a.toString('ascii', 1, 4) === 'PNG')
    return { w: a.readUInt32BE(16), h: a.readUInt32BE(20), type: 'png' };

  // GIF: logical screen descriptor, little-endian uint16
  if (a.toString('ascii', 0, 3) === 'GIF')
    return { w: a.readUInt16LE(6), h: a.readUInt16LE(8), type: 'gif' };

  // WebP: three container flavours, each storing the size differently
  if (a.toString('ascii', 0, 4) === 'RIFF' && a.toString('ascii', 8, 12) === 'WEBP') {
    const fmt = a.toString('ascii', 12, 16);
    if (fmt === 'VP8X') return { w: (a.readUIntLE(24, 3) & 0xffffff) + 1, h: (a.readUIntLE(27, 3) & 0xffffff) + 1, type: 'webp' };
    if (fmt === 'VP8 ') return { w: a.readUInt16LE(26) & 0x3fff, h: a.readUInt16LE(28) & 0x3fff, type: 'webp' };
    if (fmt === 'VP8L') {
      const b = a.readUInt32LE(21);
      return { w: (b & 0x3fff) + 1, h: ((b >> 14) & 0x3fff) + 1, type: 'webp' };
    }
  }

  // ICO: a 0 byte means 256 in the directory entry
  if (a.readUInt16LE(0) === 0 && a.readUInt16LE(2) === 1)
    return { w: a[6] || 256, h: a[7] || 256, type: 'ico' };

  // JPEG: walk the segments to a start-of-frame marker, which carries the size
  if (a[0] === 0xff && a[1] === 0xd8) {
    let i = 2;
    while (i + 9 < a.length) {
      if (a[i] !== 0xff) { i++; continue; }
      const marker = a[i + 1];
      if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker))
        return { h: a.readUInt16BE(i + 5), w: a.readUInt16BE(i + 7), type: 'jpeg' };
      i += 2 + a.readUInt16BE(i + 2);
    }
  }
  return null;
}

export const extFor = ({ type }) =>
  ({ svg: '.svg', png: '.png', gif: '.gif', webp: '.webp', ico: '.ico', jpeg: '.jpg' })[type] ?? '.img';
