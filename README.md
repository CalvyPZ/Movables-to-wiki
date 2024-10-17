# Movables-to-wiki

This is a project designed to parse `.tiles` files into usable articles and infoboxes for use on PZwiki.

## Requirements
* Python 3
* tqdm
* Node.js

## Resources
* The entire `translate` folder from [here](https://github.com/TheIndieStone/ProjectZomboidTranslations/). The layout should be `resources/translate/XX`.
* `.tiles` files from the Project Zomboid install location under `\media`. The layout should be `resources/tiles/XYZ.tiles` (copy all of the `.tiles` files).
* `ISMoveableDefinitions.lua` from the Project Zomboid install location under `\media\lua\client\Moveables`. This should go directly into `/resources`.
* `translations.csv` included in the project.

## Usage
* On Windows, open `run.bat`.
* On other operating systems, run `main.py` through your command line or IDE.

Articles and infoboxes are output to their respective language in `/output`.

The working JSON files can be found in `output/json`.
