export default {
  extends: ["stylelint-config-standard", "stylelint-config-recess-order"],
  plugins: ["stylelint-declaration-strict-value"],
  overrides: [
    {
      // tokens.css và motion.css là nơi duy nhất được đẻ token.
      files: ["src/app/styles/tokens.css", "src/app/styles/motion.css"],
      rules: {
        "color-no-hex": null,
        "function-disallowed-list": null,
        "scale-unlimited/declaration-strict-value": null,
      },
    },
  ],
  rules: {
    // Màu chỉ được đẻ trong tokens.css, component xài qua var(--...).
    // transparent / currentColor / inherit vẫn dùng tự do.
    "color-named": "never",
    "color-no-hex": true,
    "function-disallowed-list": [
      "rgb",
      "rgba",
      "hsl",
      "hsla",
      "hwb",
      "lab",
      "lch",
      "oklab",
      "oklch",
    ],
    "scale-unlimited/declaration-strict-value": [
      [
        "/color$/",
        "font-size",
        "line-height",
        "border-radius",
        "border-width",
        "z-index",
        "transition-duration",
        "animation-duration",
      ],
      {
        expandShorthand: true,
        ignoreValues: [
          "transparent",
          "currentColor",
          "currentcolor",
          "inherit",
          "initial",
          "none",
          "auto",
          "0",
          "0s",
          "0ms",
          "1",
        ],
      },
    ],
  },
};
