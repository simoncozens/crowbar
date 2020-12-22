module.exports = {
    extends: [
        "react-app",
        "plugin:jsx-a11y/recommended",
        "airbnb-typescript",
        "prettier",
        "prettier/@typescript-eslint",
    ],
    plugins: ["jsx-a11y", "prettier"],
    rules: {
        quotes: "off",
        "@typescript-eslint/quotes": ["error", "double"],
        "react/jsx-filename-extension": [
            1,
            { extensions: [".js", ".jsx", ".ts", ".tsx"] },
        ],
        "@typescript-eslint/comma-dangle": "off",
        "prettier/prettier": "error",
    },
    parserOptions: {
        project: "./tsconfig.json",
    },
}
