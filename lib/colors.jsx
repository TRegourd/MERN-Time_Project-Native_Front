export default function stringifyRGB(RGBasNumber) {
  const { r, g, b } = RGBasNumber;
  return { r: String(r), g: String(g), b: String(b) };
}
