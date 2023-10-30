import * as d3 from "d3";

function yiq(color) {
  const { r, g, b } = d3.rgb(color);
  return (r * 299 + g * 587 + b * 114) / 1000 / 255; // returns values between 0 and 1
}

function contrastTextColor(backgroundColor) {
  if (!backgroundColor) return "#000000";  
  // const d3Color = d3.color(backgroundColor);
  // const colorHsl = d3.hsl(d3Color);

  // figure out if the bg is light or dark based on our threshold
  const threshold = 0.6;

  // use d3 hsl to get the lightness
  // const lightness = colorHsl.l;
  
  // or use our yiq function to get the lightness
  const lightness = yiq(backgroundColor);

  // if the lightness is above our threshold, return an extremely darkened version of the color
  if (lightness > threshold) {
    return "black"; //d3Color.darker(10);
  } else {
    return "white";
  }
}

export { contrastTextColor };
