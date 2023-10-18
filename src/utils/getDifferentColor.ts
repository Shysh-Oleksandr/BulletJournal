import tinycolor from "tinycolor2";

function shadeColor(color: string, amount: number) {
  return (
    "#" +
    color
      .replace(/^#/, "")
      .replace(/../g, (color) =>
        (
          "0" +
          Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)
        ).substr(-2),
      )
  );
}

export const getDifferentColor = (color: string, amount: number = 20) => {
  const tinyColor = tinycolor(color);

  return tinyColor.isLight()
    ? shadeColor(color, amount * -1)
    : shadeColor(color, amount);
};
