export default {
  extends: ["stylelint-config-standard", "stylelint-config-recess-order"],
  overrides: [
    {
      // tokens.css là nơi duy nhất được đẻ màu.
      files: ["src/app/styles/tokens.css"],
      rules: {
        "color-no-hex": null,
        "function-disallowed-list": null,
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
  },
};
