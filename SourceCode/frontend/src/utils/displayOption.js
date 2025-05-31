const labelMap = {
  IceLevel: {
    NO_ICE: "Không đá",
    LESS_ICE: "Ít đá",
    NORMAL_ICE: "Bình thường",
  },
  SugarLevel: {
    NO_SUGAR: "Không đường",
    LESS_SUGAR: "Ít đường",
    NORMAL_SUGAR: "Bình thường",
  },
  SizeOption: {
    SMALL: "Nhỏ",
    MEDIUM: "Vừa",
    LARGE: "Lớn",
  },
  RoastLevel: {
    LIGHT: "Rang nhạt",
    MEDIUM: "Rang vừa",
    DARK: "Rang đậm",
  },
  GrindLevel: {
    WHOLE_BEAN: "Nguyên hạt",
    FINE: "Xay mịn",
    MEDIUM: "Xay vừa",
    COARSE: "Xay thô",
  },
  Weight: {
    G250: "250g",
    G500: "500g",
    KG1: "1kg",
  },
};

export const getOptionDisplayName = (optionName) => {
  return labelMap[optionName] ? optionName.replace(/([A-Z])/g, " $1").trim() : optionName;
};

export const getOptionValueDisplay = (optionName, value) => {
  return labelMap[optionName] && labelMap[optionName][value] ? labelMap[optionName][value] : value;
};