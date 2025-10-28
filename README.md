# Stylelint Config: Tailwind CSS

A [Stylelint](https://stylelint.io/) configuration for [Tailwind CSS](https://tailwindcss.com/) projects.

## Install

```shell
npm install --save-dev @dreamsicle.io/stylelint-config-tailwindcss
```

### Include in `extends`

```javascript
/**
 * @type {import("stylelint").Config}
 */
const stylelintConfig = {
    // ...
    extends: [
        "stylelint-config-standard",
        "@dreamsicle.io/stylelint-config-tailwindcss",
    ],
    // ...
};

export default stylelintConfig;
```
