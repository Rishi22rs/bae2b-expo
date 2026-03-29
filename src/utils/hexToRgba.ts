export const hexToRgbA = (hexCode: string, opacity = 1) => {
    let hex = hexCode?.replace('#', '');
  
    if (hex?.length === 3) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
  
    const r = Number.parseInt(hex?.slice(0, 2), 16);
    const g = Number.parseInt(hex?.slice(2, 4), 16);
    const b = Number.parseInt(hex?.slice(4, 6), 16);
  
    /* Backward compatibility for whole number based opacity values. */
    let opac = opacity;
    if (opacity > 1 && opacity <= 100) {
      opac = opacity / 100;
    }
  
    return `rgba(${r},${g},${b},${opac})`;
  };
  