# MMM-Cinestar-FWD
Use this module to display "Film-der-Woche" of German Cinestar cinemas.

# Screenshots

![Example of MMM-Cinestar-FWD](./example_1.png)

[Module description]

## Installation

### Install

1. In your terminal, go to your [MagicMirror²][mm] Module folder and clone MMM-Cinestar-FDW:

```bash
cd ~/MagicMirror/modules
git clone https://github.com/LukasWestholt/MMM-Cinestar-FDW
```

2. Change into the module folder and install runtime dependencies with

   ```sh
   cd MMM-Cinestar-FDW
   npm install
   ```

3. Add the module configuration into the `MagicMirror/config/config.js` file (sample configuration):

```javascript
{
  module: "MMM-Cinestar-FDW",
  position: "top_left",
  config: {
  }
}
```



## Configuration options

Option|Possible values|Default|Description
------|------|------|-----------
`exampleContent`|`string`|not available|The content to show on the page

## Update

```bash
cd ~/MagicMirror/modules/MMM-Cinestar-FDW
git pull
```

## Sending notifications to the module

Notification|Description
------|-----------
`TEMPLATE_RANDOM_TEXT`|Payload must contain the text that needs to be shown on this module

## Contribution and Development

This module is written in TypeScript and compiled with Rollup.  
The source files are located in the `/src` folder.
Compile target files with `npm run build`.

Contribution for this module is welcome!

## Developer commands

- `npm install` - Install devDependencies like ESLint.
- `npm run lint` - Run linting and formatter checks.
- `npm run lint:fix` - Fix linting and formatter issues.

[mm]: https://github.com/MagicMirrorOrg/MagicMirror
