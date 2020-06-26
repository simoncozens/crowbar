module.exports = {
  "extends": [
    "react-app",
    "airbnb",
    "plugin:jsx-a11y/recommended",
    "airbnb-typescript"
  ],
  "plugins": [
    "jsx-a11y",
  ],
  "rules": {
    "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx", ".ts", ".tsx"] }],
    "prettier/prettier": [
      "error", {
        "semi": false
      }
    ]
  }
}
