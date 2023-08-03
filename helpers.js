import * as d3 from "d3";

function contrastTextColor(backgroundColor) {
  if (!backgroundColor) return "#000000";
  // turn the bg color into a d3 color so we can do color math
  const d3Color = d3.color(backgroundColor);
  const colorHsl = d3.hsl(d3Color);

  // figure out if the bg is light or dark based on our threshold
  const threshold = 0.6;

  // use d3 hsl to get the lightness
  // const lightness = colorHsl.l;
  const lightness = yiq(backgroundColor);

  // console.log('lightness', lightness, threshold)

  // if the lightness is above our threshold, return an extremely darkened version of the color
  if (lightness > threshold) {
    return "black"; //d3Color.darker(10);
  } else {
    return "white";
  }
}

export { contrastTextColor };
