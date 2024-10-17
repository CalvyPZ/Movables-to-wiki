/**
 * @typedef double
 * @type number
 */

/**
 * @typedef float
 * @type number
 */

/**
 * @typedef long
 * @type number
 */

/**
 * @typedef int
 * @type number
 */

/**
 * @typedef short
 * @type number
 */

/**
 * @typedef byte
 * @type number
 */

/**
 * @typedef IsoObjectType
 * @type number
 */

/**
 * @typedef IsoFlagType
 * @type number
 */

/**
 * @typedef RenderLayer
 * @type number
 */

const path = require('path');
const fs = require('fs');

const RenderLayer = {
    Default: 0,
    Floor: 1
};

const getRenderLayerFromValue = function (val) {
    switch (val) {
        case 0: return 'Default';
        case 1: return 'Floor';
        default:
            throw new Error();
    }
}

const IsoFlagType = {
    collideW: 0,
    collideN: 1,
    solidfloor: 2,
    noStart: 3,
    windowW: 4,
    windowN: 5,
    hidewalls: 6,
    exterior: 7,
    NoWallLighting: 8,
    doorW: 9,
    doorN: 10,
    transparentW: 11,
    transparentN: 12,
    WallOverlay: 13,
    FloorOverlay: 14,
    vegitation: 15,
    burning: 16,
    burntOut: 17,
    unflamable: 18,
    cutW: 19,
    cutN: 20,
    tableN: 21,
    tableNW: 22,
    tableW: 23,
    tableSW: 24,
    tableS: 25,
    tableSE: 26,
    tableE: 27,
    tableNE: 28,
    halfheight: 29,
    HasRainSplashes: 30,
    HasRaindrop: 31,
    solid: 32,
    trans: 33,
    pushable: 34,
    solidtrans: 35,
    invisible: 36,
    floorS: 37,
    floorE: 38,
    shelfS: 39,
    shelfE: 40,
    alwaysDraw: 41,
    ontable: 42,
    transparentFloor: 43,
    climbSheetW: 44,
    climbSheetN: 45,
    climbSheetTopN: 46,
    climbSheetTopW: 47,
    attachtostairs: 48,
    sheetCurtains: 49,
    waterPiped: 50,
    HoppableN: 51,
    HoppableW: 52,
    bed: 53,
    blueprint: 54,
    canPathW: 55,
    canPathN: 56,
    blocksight: 57,
    climbSheetE: 58,
    climbSheetS: 59,
    climbSheetTopE: 60,
    climbSheetTopS: 61,
    makeWindowInvincible: 62,
    water: 63,
    canBeCut: 64,
    canBeRemoved: 65,
    taintedWater: 66,
    smoke: 67,
    attachedN: 68,
    attachedS: 69,
    attachedE: 70,
    attachedW: 71,
    attachedFloor: 72,
    attachedSurface: 73,
    attachedCeiling: 74,
    attachedNW: 75,
    ForceAmbient: 76,
    WallSE: 77,
    WindowN: 78,
    WindowW: 79,
    FloorHeightOneThird: 80,
    FloorHeightTwoThirds: 81,
    CantClimb: 82,
    diamondFloor: 83,
    attachedSE: 84,
    TallHoppableW: 85,
    WallWTrans: 86,
    TallHoppableN: 87,
    WallNTrans: 88,
    container: 89,
    DoorWallW: 90,
    DoorWallN: 91,
    WallW: 92,
    WallN: 93,
    WallNW: 94,
    SpearOnlyAttackThrough: 95,
    forceRender: 96,
    open: 97,
    MAX: 98
};

const getIsoFlagTypeNameFromValue = function (val) {
    switch (val) {
        case 0: return 'collideW';
        case 1: return 'collideN';
        case 2: return 'solidfloor';
        case 3: return 'noStart';
        case 4: return 'windowW';
        case 5: return 'windowN';
        case 6: return 'hidewalls';
        case 7: return 'exterior';
        case 8: return 'NoWallLighting';
        case 9: return 'doorW';
        case 10: return 'doorN';
        case 11: return 'transparentW';
        case 12: return 'transparentN';
        case 13: return 'WallOverlay';
        case 14: return 'FloorOverlay';
        case 15: return 'vegitation';
        case 16: return 'burning';
        case 17: return 'burntOut';
        case 18: return 'unflamable';
        case 19: return 'cutW';
        case 20: return 'cutN';
        case 21: return 'tableN';
        case 22: return 'tableNW';
        case 23: return 'tableW';
        case 24: return 'tableSW';
        case 25: return 'tableS';
        case 26: return 'tableSE';
        case 27: return 'tableE';
        case 28: return 'tableNE';
        case 29: return 'halfheight';
        case 30: return 'HasRainSplashes';
        case 31: return 'HasRaindrop';
        case 32: return 'solid';
        case 33: return 'trans';
        case 34: return 'pushable';
        case 35: return 'solidtrans';
        case 36: return 'invisible';
        case 37: return 'floorS';
        case 38: return 'floorE';
        case 39: return 'shelfS';
        case 40: return 'shelfE';
        case 41: return 'alwaysDraw';
        case 42: return 'ontable';
        case 43: return 'transparentFloor';
        case 44: return 'climbSheetW';
        case 45: return 'climbSheetN';
        case 46: return 'climbSheetTopN';
        case 47: return 'climbSheetTopW';
        case 48: return 'attachtostairs';
        case 49: return 'sheetCurtains';
        case 50: return 'waterPiped';
        case 51: return 'HoppableN';
        case 52: return 'HoppableW';
        case 53: return 'bed';
        case 54: return 'blueprint';
        case 55: return 'canPathW';
        case 56: return 'canPathN';
        case 57: return 'blocksight';
        case 58: return 'climbSheetE';
        case 59: return 'climbSheetS';
        case 60: return 'climbSheetTopE';
        case 61: return 'climbSheetTopS';
        case 62: return 'makeWindowInvincible';
        case 63: return 'water';
        case 64: return 'canBeCut';
        case 65: return 'canBeRemoved';
        case 66: return 'taintedWater';
        case 67: return 'smoke';
        case 68: return 'attachedN';
        case 69: return 'attachedS';
        case 70: return 'attachedE';
        case 71: return 'attachedW';
        case 72: return 'attachedFloor';
        case 73: return 'attachedSurface';
        case 74: return 'attachedCeiling';
        case 75: return 'attachedNW';
        case 76: return 'ForceAmbient';
        case 77: return 'WallSE';
        case 78: return 'WindowN';
        case 79: return 'WindowW';
        case 80: return 'FloorHeightOneThird';
        case 81: return 'FloorHeightTwoThirds';
        case 82: return 'CantClimb';
        case 83: return 'diamondFloor';
        case 84: return 'attachedSE';
        case 85: return 'TallHoppableW';
        case 86: return 'WallWTrans';
        case 87: return 'TallHoppableN';
        case 88: return 'WallNTrans';
        case 89: return 'container';
        case 90: return 'DoorWallW';
        case 91: return 'DoorWallN';
        case 92: return 'WallW';
        case 93: return 'WallN';
        case 94: return 'WallNW';
        case 95: return 'SpearOnlyAttackThrough';
        case 96: return 'forceRender';
        case 97: return 'open';
        case 98: return 'MAX';
        default:
            throw new Error();
    }
};

const IsoObjectType = {
    normal: 0,
    jukebox: 1,
    wall: 2,
    stairsTW: 3,
    stairsTN: 4,
    stairsMW: 5,
    stairsMN: 6,
    stairsBW: 7,
    stairsBN: 8,
    UNUSED9: 9,
    UNUSED10: 10,
    doorW: 11,
    doorN: 12,
    lightswitch: 13,
    radio: 14,
    curtainN: 15,
    curtainS: 16,
    curtainW: 17,
    curtainE: 18,
    doorFrW: 19,
    doorFrN: 20,
    tree: 21,
    windowFN: 22,
    windowFW: 23,
    UNUSED24: 24,
    WestRoofB: 25,
    WestRoofM: 26,
    WestRoofT: 27,
    isMoveAbleObject: 28,
    MAX: 29,
};

const getIsoObjectTypeNameFromValue = function (val) {
    switch (val) {
        case 0: return 'normal';
        case 1: return 'jukebox';
        case 2: return 'wall';
        case 3: return 'stairsTW';
        case 4: return 'stairsTN';
        case 5: return 'stairsMW';
        case 6: return 'stairsMN';
        case 7: return 'stairsBW';
        case 8: return 'stairsBN';
        case 9: return 'UNUSED9';
        case 10: return 'UNUSED10';
        case 11: return 'doorW';
        case 12: return 'doorN';
        case 13: return 'lightswitch';
        case 14: return 'radio';
        case 15: return 'curtainN';
        case 16: return 'curtainS';
        case 17: return 'curtainW';
        case 18: return 'curtainE';
        case 19: return 'doorFrW';
        case 20: return 'doorFrN';
        case 21: return 'tree';
        case 22: return 'windowFN';
        case 23: return 'windowFW';
        case 24: return 'UNUSED24';
        case 25: return 'WestRoofB';
        case 26: return 'WestRoofM';
        case 27: return 'WestRoofT';
        case 28: return 'isMoveAbleObject';
        case 29: return 'MAX';
        default:
            throw new Error();
    };
};

class Color {

    /**
     * @type int
     */
    r = 0;

    /**
     * @type int
     */
    g = 0;

    /**
     * @type int
     */
    b = 0;

    toJSON() {
        return {
            r: this.r,
            g: this.g,
            b: this.b
        };
    }

}

class BufferReader {

    /**
     * @private
     *
     * @type {int}
     */
    offset;

    /**
     * @private
     * @readonly
     *
     * @type {Buffer}
     */
    buffer;

    constructor(buffer) {
        this.buffer = buffer;
        this.offset = 0;
    }

    nextLittleInt32() {
        const val = this.buffer.readInt32LE(this.offset);
        this.offset += 4;
        return val;
    }

    nextString() {
        let var1 = '';
        let var2 = -1;
        let var3 = false;
        let i = 0;
        while (!var3) {
            var2 = this.buffer.readUInt8(this.offset++);
            switch (var2) {
                case -1:
                case 10:
                    var3 = true;
                    break;
                case 13:
                    throw new Error('\r\n unsupported');
                default:
                    var1 += String.fromCharCode(var2);

                    // Hard-Break. (For debugging)
                    i++;
                    if (i >= 1024) {
                        var3 = true;
                        throw new Error();
                        break;
                    }
            }
        }
        return var1;
    }
}

class TileProperty {

    /**
     * @public
     * @type string
     */
    propertyName;

    /**
     * @public
     * @readonly
     * @type Array<string>
     */
    possibleValues = [];

    /**
     * @public
     * @readonly
     * @type {[key: string]: int}
     */
    idMap = {};
}

class TilePropertyAliasMap {

    /**
     * @public
     * @readonly
     * @type {[key: string]: int}
     */
    static PropertyToID = {};

    /**
     * @public
     * @readonly
     * @type Array<TileProperty>
     */
    static Properties = [];

    /**
     * @private
     */
    constructor() {
        throw new Error('Cannot instantiate TilePropertyAliasMap. It\'s a singleton!');
    }


    /**
     * @param {{[key: string]: Array<string>}} propValueMap
     */
    static generate(propValueMap) {

        // Read-only clear.
        TilePropertyAliasMap.Properties.length = 0;
        for (const key of Object.keys(TilePropertyAliasMap.PropertyToID)) {
            delete TilePropertyAliasMap.PropertyToID[key];
        }
        ///////////////////

        for (const var3 of Object.keys(propValueMap)) {
            const var5 = propValueMap[var3];
            TilePropertyAliasMap.PropertyToID[var3] = TilePropertyAliasMap.Properties.length;
            const var6 = new TileProperty();
            TilePropertyAliasMap.Properties.push(var6);
            var6.propertyName = var3;

            for (const x of var5) {
                var6.possibleValues.push(x);
            }

            const var7 = var6.possibleValues;

            for (let var8 = 0; var8 < var7.length; var8++) {
                const var9 = var7[var8];
                var6.idMap[var9] = var8;
            }
        }
    }

    /**
     * @param {string} var1 The property-name.
     *
     * @returns {int}
     */
    static getIDFromPropertyName(var1) {
        const x = TilePropertyAliasMap.PropertyToID[var1];
        if (!x) return -1;
        return x;
    }

    /**
     * @param {int} var1 The aliased property-name as a value.
     *
     * @returns {string}
     */
    static getPropertyNameFromID(var1) {
        for (const key of Object.keys(this.PropertyToID)) {
            const val = this.PropertyToID[key];
            if (val == var1) return key;
        }
        return null;
    }

    /**
     *
     * @param {int} var1
     * @param {string} var2
     * @returns {int}
     */
    static getIDFromPropertyValue(var1, var2) {
        const var3 = TilePropertyAliasMap.Properties[var1];
        if (var3 && var3.possibleValues.length === 0) {
            return 0;
        }
        return Object.keys(var3.idMap).indexOf(var2) === -1 ? 0 : var3.idMap[var2];
    }

    /**
     * @param {int} var1
     * @param {int} var2
     * @returns {string}
     */
    static getPropertyValueString(var1, var2) {
        const var3 = TilePropertyAliasMap.Properties[var1];
        if (!var3 || var3.possibleValues.length === 0) {
            return '';
        }
        return var3.possibleValues[var2];
    }
}

class PropertyContainer {

    /**
     * @public
     *
     * @type byte
     */
    static SURFACE_VALID = 1;

    /**
     * @public
     *
     * @type byte
     */
    static SURFACE_ISOFFSET = 2;

    /**
     * @public
     *
     * @type byte
     */
    static SURFACE_ISTABLE = 4;

    /**
     * @public
     *
     * @type byte
     */
    static SURFACE_ISTABLETOP = 8;

    /**
     * @private
     * @readonly
     *
     * @type {[key: int]: int}
     */
    Properties = {};

    /**
     * @private
     *
     * @type Array<int> | null
     */
    keyArray = null;

    /**
     * @private
     *
     * @type long
     */
    SpriteFlags1 = 0;

    /**
     * @private
     *
     * @type long
     */
    SpriteFlags2 = 0;

    /**
     * @private
     *
     * @type short
     */
    StackReplaceTileOffset = 0;

    /**
     * @private
     *
     * @type byte
     */
    Surface = 0;

    /**
     * @private
     *
     * @type byte
     */
    SurfaceFlags = 0;


    flagsSet = [];

    /**
     * @private
     *
     * @type byte
     */
    ItemHeight = 0;

    toJSON() {
        const json = {
            spriteFlags1: this.SpriteFlags1 !== 0 ? this.SpriteFlags1 : undefined,
            spriteFlags2: this.SpriteFlags2 !== 0 ? this.SpriteFlags2 : undefined
        };

        if (this.flagsSet.length !== 0) {
            json.flags = [];
            for (const flag of this.flagsSet) {
                json.flags.push(getIsoFlagTypeNameFromValue(flag));
            }
        }

        if (Object.keys(this.Properties).length !== 0) {
            json.generic = {};
            for (const key of Object.keys(this.Properties)) {
                const sKey = TilePropertyAliasMap.getPropertyNameFromID(key);
                const sVal = TilePropertyAliasMap.getPropertyValueString(key, this.Properties[key]);
                json.generic[sKey] = sVal;
            }
        }

        return json;
    }

    CreateKeySet() {
        this.keyArray = Object.keys(this.Properties);
    }

    /**
     * @public
     *
     * @param {PropertyContainer} var1
     *
     * @returns {void}
     */
    AddProperties(var1) {
        if (!var1.keyArray) return;
        for (const var3 of var1.keyArray) {
            this.Properties[var3] = var1.Properties[var3];
        }
    }

    /**
     * @public
     *
     * @returns {void}
     */
    Clear() {
        this.SpriteFlags1 = 0;
        this.SpriteFlags2 = 0;
        this.Properties = {};
        this.SurfaceFlags &= -2;
    }

    /**
     * @public
     *
     * @param {IsoFlagType | double | string} type
     *
     * @returns {boolean}
     */
    Is(type) {

        // Is(string)
        if (typeof type === 'string') {
            const var2 = TilePropertyAliasMap.getIDFromPropertyName(type);
            return this.Properties[var2];
        }

        // (Double -> Int)
        type = Math.round(type);

        const val = type / 64 === 0 ? this.SpriteFlags1 : this.SpriteFlags2;
        return (val & 1 << type % 64) != 0;
    }

    /**
     * @public
     *
     * @param {string} var1 The property's name.
     * @param {string} var2 The property's value.
     * @param {boolean?} var3 Whether the property is a IsoFlagType enum.
     *
     * @returns {void}
     */
    Set(var1, var2, var3) {
        if (!var1) return;
        if (var3 === undefined) {
            var3 = true;
        }

      // Treat 'container' as a generic property, not a flag
      if (var1 === 'container') {
          var3 = false;
      }
        // If flagged as an IsoFlagType property, set it.
        if (var3) {
            const var4 = IsoFlagType[var1];
            if (var4 != null && var4 !== IsoFlagType.MAX) {
                this.SetFlag(var4);
                return;
            }
        }

        // Properly map the non-flag property based on the alias's ID.
        const var6 = TilePropertyAliasMap.getIDFromPropertyName(var1);
        if (var6 !== -1) {
            const var5 = TilePropertyAliasMap.getIDFromPropertyValue(var6, var2);
            this.SurfaceFlags &= -2;
            this.Properties[var6] = var5;
        }
    }

    /**
     * @public
     *
     * @param {IsoFlagType} var1
     *
     * @returns {void}
     */
    SetFlag(var1) {
        if (var1 / 64 === 0) {
            this.SpriteFlags1 = this.SpriteFlags1 | 1 << var1 % 64;
        } else {
            this.SpriteFlags2 = this.SpriteFlags2 | 1 << var1 % 64;
        }
        if (this.flagsSet.indexOf(var1) === -1) {
            this.flagsSet.push(var1);
        }
    }

    /**
     * @public
     *
     * @param {string} var1
     *
     * @returns {void}
     */
    UnSet(var1) {
        const var2 = TilePropertyAliasMap.getIDFromPropertyName(var1);
        delete this.Properties[var2];
    }

    /**
     * @public
     *
     * @param {IsoFlagType} var1
     *
     * @returns {void}
     */
    UnsetFlag(var1) {
        if (var1 / 64 === 0) {
            this.SpriteFlags1 = this.SpriteFlags1 & ~(1 << var1 % 64);
        } else {
            this.SpriteFlags2 = this.SpriteFlags2 & ~(1 << var1 % 64);
        }
        if (this.flagsSet.indexOf(var1) !== -1) {
            this.flagsSet.splice(var1, 1);
        }
    }

    /**
     * @public
     *
     * @param {string} var1
     *
     * @returns {string}
     */
    Val(var1) {

        const var2 = TilePropertyAliasMap.getIDFromPropertyName(var1);

        let result;
        if (this.Properties[var2] == null) {
            result = null;
        } else {
            result = TilePropertyAliasMap.getPropertyValueString(var2, this.Properties[var2]);
        }

        return result;
    }

    /**
     * @public
     *
     * @returns {Array<int>}
     */
    getFlagsList() {

        /**
         * @type Array<int>
         */
        const var1 = [];

        for (let var2 = 0; var2 < 64; var2++) {
            if ((this.SpriteFlags1 & 1 << var2) != 0) {
                var1.push(var2);
            }
        }

        for (let var3 = 0; var3 < 64; var3++) {
            if ((this.SpriteFlags2 & 1 << var3) != 0) {
                var1.push(64 + var3);
            }
        }

        return var1;

    }

    getPropertyNames() {

        /**
         * @type Array<string>
         */
        const var1 = [];

        for (const var1x of Object.keys(this.Properties)) {
            var1.push(TilePropertyAliasMap.Properties[var1x].propertyName);
        }

        var2.sort();

        return var1;

    }

    initSurface() {
        if ((this.SurfaceFlags & 1) !== 0) return;

        this.Surface = 0;
        this.StackReplaceTileOffset = 0;
        this.SurfaceFlags = 1;
        this.ItemHeight = 0;

        for (const var1 of Object.keys(this.Properties)) {
            const var2 = this.Properties[var1];
            const var3 = TilePropertyAliasMap.Properties[var1];
            const var4 = var3.propertyName;
            const var5 = var3.possibleValues[var2];
            if (var4 === 'Surface' && var5 != null) {
                try {
                    const var10 = parseInt(var5);
                    if (var10 >= 0 && var10 <= 127) {
                        this.Surface = var10;
                    }
                } catch (ignored) {
                }
            } else if (var4 === 'IsSurfaceOffset') {
                this.SurfaceFlags = (this.SurfaceFlags | 2);
            } else if (var4 === 'IsTable') {
                this.SurfaceFlags = (this.SurfaceFlags | 4);
            } else if (var4 === 'IsTableTop') {
                this.SurfaceFlags = (this.SurfaceFlags | 8);
            } else if (var4 === 'StackReplaceTileOffset') {
                try {
                    this.StackReplaceTileOffset = parseInt(var5);
                } catch (ignored) {
                }
            } else if (var4 === 'ItemHeight') {
                try {
                    const var6 = parseInt(var5);
                    if (var6 >= 0 && var6 <= 127) {
                        this.ItemHeight = var6;
                    }
                } catch (ignored) {
                }
            }
        }
    }

    /**
     * @public
     *
     * @returns {int}
     */
    getSurface() {
        this.initSurface();
        return this.Surface;
    }

    /**
     * @public
     *
     * @returns {boolean}
     */
    isSurfaceOffset() {
        this.initSurface();
        return (this.SurfaceFlags & 2) !== 0;
    }

    /**
     * @public
     *
     * @returns {boolean}
     */
    isTable() {
        this.initSurface();
        return (this.SurfaceFlags & 4) !== 0;
    }

    /**
     * @public
     *
     * @returns {boolean}
     */
    isTableTop() {
        this.initSurface();
        return (this.SurfaceFlags & 8) !== 0;
    }


    /**
     * @public
     *
     * @returns {int}
     */
    getStackReplaceTileOffset() {
        this.initSurface();
        return this.StackReplaceTileOffset;
    }

    /**
     * @public
     *
     * @returns {int}
     */
    getItemHeight() {
        this.initSurface();
        return this.ItemHeight;
    }
}

class IsoSprite {

    /**
     * @public
     * @readonly
     *
     * @type {PropertyContainer}
     */
    properties = new PropertyContainer();

    /**
     * @public
     * @readonly
     *
     * @type {ColorInfo}
     */
    TintMod = [1.0, 1.0, 1.0, 1.0];

    /**
     * @type {string}
     */
    name = '';

    /**
     * @type {int}
     */
    id = 20000000;

    /**
     * @type {int}
     */
    tileSheetIndex = 0;

    /**
     * @type {int}
     */
    type = IsoObjectType.MAX;

    /**
     * @type {boolean}
     */
    isBush = false;

    /**
     * @type {int}
     */
    firerequirement = 0;

    /**
     * @type {string}
     */
    burntTile = null;

    /**
     * @type {boolean}
     */
    forceAmbient = false;

    /**
     * @type {boolean}
     */
    solidFloor = false;

    /**
     * @type {boolean}
     */
    canBeRemoved = false;

    /**
     * @type {boolean}
     */
    attachedFloor = false;

    /**
     * @type {boolean}
     */
    cutN = false;

    /**
     * @type {boolean}
     */
    cutW = false;

    /**
     * @type {boolean}
     */
    solid = false;

    /**
     * @type {boolean}
     */
    solidTrans = false;

    /**
     * @type {boolean}
     */
    invisible = false;

    /**
     * @type {boolean}
     */
    alwaysDraw = false;

    /**
     * @type {boolean}
     */
    forceRender = false;

    /**
     * @type {boolean}
     */
    moveWithWind = false;

    /**
     * @type {number}
     */
    windType = 1;

    /**
     * @type {byte}
     */
    renderLayer = 0;

    /**
     * @type {boolean}
     */
    Animate = true;

    /**
     * @type {boolean}
     */
    treatAsWallOrder = false;

    /**
     * @type {boolean}
     */
    hideForWaterRender = false;

    /**
     * @param {IsoSpriteManager?} mgr
     */
    constructor(mgr) {
        if (mgr) {
            this.parentManager = mgr;
        } else {
            this.parentManager = IsoSpriteManager.instance;
        }
    }

    toJSON() {
        const json = {
            id: this.id,
            type: getIsoFlagTypeNameFromValue(this.type),
            tileSheetIndex: this.tileSheetIndex,
        };

        const renderLayer = getRenderLayerFromValue(this.renderLayer);
        if (renderLayer !== 'Default') {
            json.renderLayer = renderLayer;
        }

        if (this.TintMod[0] !== 1 || this.TintMod[1] !== 1 || this.TintMod[2] !== 1 || this.TintMod[3] !== 1) {
            json.tintMod = {
                r: this.TintMod[0],
                g: this.TintMod[1],
                b: this.TintMod[2],
                a: this.TintMod[3]
            };
        }

        const p = this.properties.toJSON();
        if (JSON.stringify(p) !== '{}') {
            json.properties = p;
        }

        json.isBush = this.isBush ? true : undefined;
        json.fireRequirement = this.firerequirement ? true : undefined;
        json.burntTile = this.burntTile ? true : undefined;
        json.forceAmbient = this.forceAmbient ? true : undefined;
        json.solidFloor = this.solidFloor ? true : undefined;
        json.canBeRemoved = this.canBeRemoved ? true : undefined;
        json.attachedFloor = this.attachedFloor ? true : undefined;
        json.cutN = this.cutN ? true : undefined;
        json.cutW = this.cutW ? true : undefined;
        json.solid = this.solid ? true : undefined;
        json.solidTrans = this.solidTrans ? true : undefined;
        json.invisible = this.invisible ? true : undefined;
        json.alwaysDraw = this.alwaysDraw ? true : undefined;
        json.forceRender = this.forceRender ? true : undefined;
        json.moveWithWind = this.moveWithWind ? true : undefined;
        json.windType = this.windType !== 1 ? this.windType : undefined;
        json.animate = !this.Animate ? false : undefined;
        json.treatAsWallOrder = this.treatAsWallOrder ? true : undefined;
        json.hideForWaterRender = this.hideForWaterRender ? true : undefined;

        return json;
    }
}

class IsoSpriteManager {

    /**
     * @public
     * @readonly
     */
    static instance = new IsoSpriteManager();

    /**
     * @private
     * @readonly
     *
     * @type {IsoSprite}
     */
    emptySprite;


    /**
     * @public
     * @readonly
     *
     * @type {{[key: int]: IsoSprite}}
     */
    IntMap = {};

    /**
     * @public
     * @readonly
     *
     * @type {{[key: string]: IsoSprite}}
     */
    NamedMap = {};

    /**
     * @private
     */
    constructor() {

        if (IsoSpriteManager.instance) {
            throw new Error();
        }

        const var1 = IsoSpriteManager.emptySprite = new IsoSprite(this);
        var1.name = '';
        var1.id = -1;
        var1.properties.SetFlag(IsoFlagType.invisible);

    }

    Dispose() {

        IsoSprite.DisposeAll();
        IsoAnim.DisposeAll();

        const var1 = Object.values(this.IntMap);

        for (let var2 = 0; var2 < var1.length; var2++) {
            const var3 = var1[var2];
            var3.Dispose();
            var3.def = null;
            var3.parentManager = null;
        }

        this.IntMap.clear();

        for (const key of Object.keys(this.NamedMap)) {
            delete this.NamedMap[key];
        }

        this.NamedMap[this.emptySprite.name] = this.emptySprite;

    }

    /**
     * @param {int} var1
     *
     * @returns {IsoSprite}
     */
    getSprite(var1) {

        if (typeof var1 === 'number') {
            if (Object.keys(this.IntMap).indexOf(var1) !== -1) {
                return this.IntMap[var1];
            }
        } else if (typeof var1 === 'string') {
            if (Object.keys(this.NamedMap).indexOf(var1) !== -1) {
                return this.NamedMap[var1];
            }
        }

        return null;

    }

    /**
     * @param {string} var1
     * @param {Color?} var2
     *
     * @returns {IsoSprite}
     */
    getOrAddSpriteCache(var1, var2) {

        if (var2) {
            const var3 = Math.round(var2.r * 255.0);
            const var4 = Math.round(var2.g * 255.0);
            const var5 = Math.round(var2.b * 255.0);
            const var6 = `${var1}_${var3}_${var4}_${var5}`;
            if (Object.keys(this.NamedMap).indexOf(var6) !== -1) {
                return this.NamedMap[var6];
            } else {
                const var7 = new IsoSprite(this);
                // var7.LoadFramesNoDirPageSimple(var1);
                this.NamedMap[var6] = var7;
                return var7;
            }
        }

        if (Object.keys(this.NamedMap).indexOf(var1) !== -1) {
            return this.NamedMap[var1];
        } else {
            const var2 = new IsoSprite(this);
            // var2.LoadFramesNoDirPageSimple(var1);
            this.NamedMap[var1] = var2;
            return var2;
        }
    }

    /**
     *
     * @param {string} name The name of the sprite.
     * @param {int?} id
     *
     * @returns {IsoSprite}
     */
    AddSprite(name, id) {

        if (id != null) {
            const var3 = new IsoSprite(this);
            if (this.NamedMap[name] !== undefined) {
                console.error(`duplicate texture ${name} ignore ID=${id}, use ID=${this.NamedMap[name].id}`);
                id = this.NamedMap[name].id;
            }

            this.NamedMap[name] = var3;
            var3.id = id;
            var3.name = name;
            this.IntMap[id] = var3;
            return var3;
        }

        const sprite = new IsoSprite(this);
        // sprite.LoadFramesNoDirPageSimple(name);
        this.NamedMap[name] = sprite;
        return sprite;
    }

}

class IsoWorld {

    /**
     * @public
     * @readonly
     *
     * @type {{[key: string]: Array<string>}}
     */
    propertyValueMap = {};

    /**
     * @readonly
     *
     * @type Array<string>
     */
    tileImages = [];

    /**
     * @type {{[id: string]: Tile}}
     */
    tiles = {};



    /**
     * @param {string} pathToFile The path to the file.
     */
    loadTileDefinitionsPropertyStrings(pathToFile) {
        console.log(`tiledef: loading ${pathToFile}`);

        const buffer = fs.readFileSync(pathToFile);
        const reader = new BufferReader(buffer);

        try {
            // (Skip)
            reader.nextLittleInt32();
            reader.nextLittleInt32();

            /**
             * Count of Tile-Definition(s).
             */
            const var8 = reader.nextLittleInt32();

            for (let var10 = 0; var10 < var8; var10++) {

                // (Skip)
                reader.nextString().trim();

                this.tileImages.push(reader.nextString());

                // (Skip)
                reader.nextLittleInt32();
                reader.nextLittleInt32();
                reader.nextLittleInt32();

                const tileDefCount = reader.nextLittleInt32();

                for (let tileDefIndex = 0; tileDefIndex < tileDefCount; tileDefIndex++) {

                    // Property-value(s)

                    /**
                     * The amount of property-values in the tile-definition.
                     */
                    const propCount = reader.nextLittleInt32();

                    for (let propIndex = 0; propIndex < propCount; propIndex++) {
                        const propName = reader.nextString().trim();
                        const propValue = reader.nextString().trim();

                        let tileDefProperties = null;
                        if (Object.keys(this.propertyValueMap).indexOf(propName) !== -1) {
                            tileDefProperties = this.propertyValueMap[propName];
                        } else {
                            tileDefProperties = [];
                            this.propertyValueMap[propName] = tileDefProperties;
                        }

                        if (Object.keys(tileDefProperties).indexOf(propValue) === -1) {
                            tileDefProperties.push(propValue)
                        }

                    }
                }
            }

        } catch (err) {
            console.error(err);
        }
    }

    setCustomPropertyValues() {

        this.propertyValueMap['WindowN'].push('WindowN');
        this.propertyValueMap['WindowW'].push('WindowW');
        this.propertyValueMap['DoorWallN'].push('DoorWallN');
        this.propertyValueMap['DoorWallW'].push('DoorWallW');
        this.propertyValueMap['WallSE'].push('WallSE');

        /**
         * @type Array<string>
         */
        const var1 = [];

        for (let var2 = -96; var2 <= 96; var2++) {
            var1.push(`${var2}`);
        }

        this.propertyValueMap['Noffset'] = var1;
        this.propertyValueMap['Soffset'] = var1;
        this.propertyValueMap['Woffset'] = var1;
        this.propertyValueMap['Eoffset'] = var1;

        this.propertyValueMap['tree'].push('5');
        this.propertyValueMap['tree'].push('6');
        this.propertyValueMap['lightR'].push('0');
        this.propertyValueMap['lightG'].push('0');
        this.propertyValueMap['lightB'].push('0');
    }

    generateTilePropertyLookupTables() {

        TilePropertyAliasMap.generate(this.propertyValueMap);

        // (read-only clear)
        for (const key of Object.keys(this.propertyValueMap)) {
            delete this.propertyValueMap[key];
        }
    }

    readTileDefinitions(pathToFile, someParameter) {


        const var4 = pathToFile.indexOf('.patch.tiles') !== -1;

        console.log(`readFileDefinitions(pathToFile='${pathToFile}', someParameter=${someParameter})`)

        /**
         * @type { [tileName: string]: IsoSprite }
         */
        const tiles = {};

        const buffer = fs.readFileSync(pathToFile);
        const reader = new BufferReader(buffer);

        /**
         * @type {Array<IsoSprite>}
         */
        const defs = [];
        const var16 = { 'N': [], 'E': [], 'S': [], 'W': [] };
        const var17 = ['N', 'E', 'S', 'W'];

        let var12 = false;
        let var15 = {};
        let var19 = {};
        let var20 = 0;
        let var21 = 0;
        let var24 = [];

        const bDebug = false;

        // Skip
        reader.nextLittleInt32();
        reader.nextLittleInt32();

        const countTiles = reader.nextLittleInt32();

        for (let i = 0; i < countTiles; i++) {

            /** Tile-Name */
            let var27 = reader.nextString().trim();

            // Skip
            reader.nextString();
            reader.nextLittleInt32();
            reader.nextLittleInt32();

            /** Used to calculate the tile ID. */
            let magicIDValue = reader.nextLittleInt32();

            /** Tile-Index */
            const countTiles = reader.nextLittleInt32();

            for (let tileIndex = 0; tileIndex < countTiles; tileIndex++) {

                const tileName = `${var27}_${tileIndex}`;

                let def = null;
                if (var4) {
                    def = IsoSpriteManager.instance.NamedMap[tileName];
                    if (def == null) {
                        const x = reader.nextLittleInt32()
                        for (let i = 0; i < x; i++) {
                            reader.nextString();
                            reader.nextString();
                        }
                        continue;
                    }
                } else if (someParameter < 2) {
                    const tileID = someParameter * 100 * 1000 + 10000 + magicIDValue * 1000 + tileIndex;
                    def = IsoSpriteManager.instance.AddSprite(tileName, tileID);
                } else {
                    const tileID = someParameter * 512 * 512 + magicIDValue * 512 + tileIndex;
                    def = IsoSpriteManager.instance.AddSprite(tileName, tileID);
                }

                defs.push(def);
                if (!var4) {
                    def.name = tileName;
                    def.tileSheetIndex = tileIndex;
                }

                if (def.name.indexOf('damaged') !== -1 || def.name.indexOf('trash_') !== -1) {
                    def.attachedFloor = true;
                    def.properties.Set('attachedFloor', 'true');
                }

                if (tileName.startsWith('f_bushes') && tileIndex <= 31) {
                    def.isBush = true;
                    def.attachedFloor = true;
                }

                const countProperties = reader.nextLittleInt32()

                for (let propertyIndex = 0; propertyIndex < countProperties; propertyIndex++) {
                    /** IsoObjectType enum as string */
                    const propertyID = reader.nextString().trim();
                    const subPropertyID = reader.nextString().trim();
                    this.transformTileDefinition(def, var27, propertyID, subPropertyID);
                }

                if (def.properties.Is('lightR') || def.properties.Is('lightG') || def.properties.Is('lightB')) {
                    if (!def.properties.Is('lightR')) {
                        def.properties.Set('lightR', '0');
                    }
                    if (!def.properties.Is('lightG')) {
                        def.properties.Set('lightG', '0');
                    }
                    if (!def.properties.Is('lightB')) {
                        def.properties.Set('lightB', '0');
                    }
                }

                def.properties.CreateKeySet();

                this.tiles[tileName] = tiles[tileName] = def;
                defs.push(def);
            }

            this.setOpenDoorProperties(var27, defs);
            var15 = {};

            for (const var70 of defs) {

                if (var70.properties.Is('StopCar')) {
                    var70.type = IsoObjectType.isMoveAbleObject;
                }

                if (var70.properties.Is('IsMoveAble')) {
                    if (var70.properties.Is('CustomName') && var70.properties.Val('CustomName') !== '') {
                        var20++;
                        if (var70.properties.Is('GroupName')) {
                            const var73 = var70.properties.Val('GroupName') + ' ' + var70.properties.Val('CustomName');
                            if (var15[var73] == null) {
                                var15[var73] = [];
                            }

                            var15[var73].push(var70);
                            var24.push(var73);
                        } else {
                            if (var19[var27] == null) {
                                var19[var27] = [];
                            }

                            const pCustomName = var70.properties.Val('CustomName');
                            if (var19[var27][pCustomName] == null) {
                                var19[var27].push(pCustomName);
                            }

                            var21++;
                            var24.push(pCustomName);
                        }
                    } else {
                        console.error(`[IMPORTANT] MOVABLES: Object has no custom name defined: sheet = ${var27}`);
                    }
                }
            }

            for (const var74 of Object.keys(var15)) {
                if (var19[var27] == null) var19[var27] = [];
                if (var19[var27].indexOf(var74) === -1) var19[var27].push(var74);

                /**
                 * @type {Array<IsoSprite>}
                 */
                const var75 = var15[var74];

                if (var75.length === 1) {
                    console.warn(`MOVABLES: Object has only one face defined for group: (${var74}) sheet = ${var27}`);
                } else if (var75.length === 3) {
                    console.warn(`MOVABLES: Object only has 3 sprites, _might_ have a error in settings, group: (${var74}) sheet = ${var27}`);
                }

                // Clear direction dictionary.
                for (const var85 of var17) {
                    var16[var85] = [];
                }

                /**
                 * @type {boolean}
                 */
                const var77 = var75[0].properties.Is('SpriteGridPos') && !var75[0].properties.Val('SpriteGridPos') === 'None';

                /**
                 * @type {boolean}
                 */
                let var79 = true;

                for (const var86 of var75) {

                    const var41 = var86.properties.Is('SpriteGridPos') && !var86.properties.Val('SpriteGridPos') === 'None';
                    if (var77 !== var41) {
                        var79 = false;
                        console.warn(`MOVABLES: Difference in SpriteGrid settings for members of group: (${var74}) sheet = ${var27}`);
                        break;
                    }

                    if (!var86.properties.Is('Facing')) {
                        var79 = false;
                    } else {
                        const var42 = var86.properties.Val('Facing');
                        switch (var42) {
                            case 'N': {
                                var16['N'].push(var86);
                                break;
                            }
                            case 'E': {
                                var16['E'].push(var86);
                                break;
                            }
                            case 'S': {
                                var16['S'].push(var86);
                                break;
                            }
                            case 'W': {
                                var16['W'].push(var86);
                                break;
                            }
                            default: {
                                console.warn(`MOVABLES: Invalid face (${var42}) for group: (${var74}) sheet = ${var27}, (${var42})`);
                                var79 = false;
                            }
                        }

                        if (!var79) {
                            console.warn(`MOVABLES: Not all members have a valid face defined for group: (${var74}) sheet = ${var27}`);
                            break;
                        }
                    }



                    // (IsoSpriteGrid stuff)
                }


            }

            defs.length = 0;
        }

        // (Always false)
        // if (var12) {
        //     const var58 = [...var24];
        //     var58.sort();
        //     for (const var64 of var58) {
        //         console.log(var64.replaceAll(' ', '_').replaceAll('-', '_').replaceAll('\'', '').replaceAll('\\.', '') + ' = "' + var64 + '\",');
        //     }
        // }

        return tiles;
    }

    transformTileDefinition(def, var27, var37, var38) {

        const var39 = IsoObjectType[var37];

        if (var39 != null && var39 != IsoObjectType.MAX) {
            if (def.type !== IsoObjectType.doorW && def.type !== IsoObjectType.doorN || var39 !== IsoObjectType.wall) {
                def.type = var39;
            }

            if (var39 === IsoObjectType.doorW) {
                def.properties.SetFlag(IsoFlagType.doorW);
            } else if (var39 === IsoObjectType.doorN) {
                def.properties.SetFlag(IsoFlagType.doorN);
            }
        } else {
            if (var37 === 'firerequirement') {
                def.firerequirement = parseInt(var38);
            } else if (var37 === 'fireRequirement') {
                def.firerequirement = parseInt(var38);
            } else if (var37 === 'BurntTile') {
                def.burntTile = var38;
            } else if (var37 === 'ForceAmbient') {
                def.forceAmbient = true;
                def.properties.Set(var37, var38);
            } else if (var37 === 'solidFloor') {
                def.solidFloor = true;
                def.properties.Set(var37, var38);
            } else if (var37 === 'canBeRemoved') {
                def.canBeRemoved = true;
                def.properties.Set(var37, var38);
            } else if (var37 === 'attachedFloor') {
                def.attachedFloor = true;
                def.properties.Set(var37, var38);
            } else if (var37 === 'cutW') {
                def.cutW = true;
                def.properties.Set(var37, var38);
            } else if (var37 === 'cutN') {
                def.cutN = true;
                def.properties.Set(var37, var38);
            } else if (var37 === 'solid') {
                def.solid = true;
                def.properties.Set(var37, var38);
            } else if (var37 === 'solidTrans') {
                def.solidTrans = true;
                def.properties.Set(var37, var38);
            } else if (var37 === 'invisible') {
                def.invisible = true;
                def.properties.Set(var37, var38);
            } else if (var37 === 'alwaysDraw') {
                def.alwaysDraw = true;
                def.properties.Set(var37, var38);
            } else if (var37 === 'forceRender') {
                def.forceRender = true;
                def.properties.Set(var37, var38);
            } else if (var37 === 'FloorHeight') {
                if (var38 === 'OneThird') {
                    def.properties.SetFlag(IsoFlagType.FloorHeightOneThird);
                } else if (var38 === 'TwoThirds') {
                    def.properties.SetFlag(IsoFlagType.FloorHeightTwoThirds);
                }
            } else if (var37 === 'MoveWithWind') {
                def.moveWithWind = true;
                def.properties.Set(var37, var38);
            } else if (var37 === 'WindType') {
                def.windType = parseInt(var38);
                def.properties.Set(var37, var38);
            } else if (var37 === 'RenderLayer') {
                def.properties.Set(var37, var38);
                if (var38 === 'Default') {
                    def.renderLayer = 0;
                } else if (var38 === 'Floor') {
                    def.renderLayer = 1;
                }
            } else if (var37 === 'TreatAsWallOrder') {
                def.treatAsWallOrder = true;
                def.properties.Set(var37, var38);
            } else {
                def.properties.Set(var37, var38);
                if (var37 === "WindowN" || var37 === "WindowW") {
                    def.properties.Set(var37, var38, false);
                }
            }
        }

        if (var39 === IsoObjectType.tree) {
            if (def.name === 'e_riverbirch_1_1') {
                var38 = '1';
            }

            def.properties.Set('tree', var38);
            def.properties.UnsetFlag(IsoFlagType.solid);
            def.properties.SetFlag(IsoFlagType.blocksight);

            let var40 = parseInt(var38);

            if (var27.startsWith('vegetation_trees')) {
                var40 = 4;
            }

            // (Clamp to 1 -> 4)
            if (var40 < 1) var40 = 1;
            else if (var40 > 4) var40 = 4;

            if (var40 === 1 || var40 === 2) {
                def.properties.UnsetFlag(IsoFlagType.blocksight);
            }

            if (var37 === 'interior' && var38 === 'false') {
                def.properties.SetFlag(IsoFlagType.exterior);
            } else if (var37 === 'HoppableN') {
                def.properties.SetFlag(IsoFlagType.collideN);
                def.properties.SetFlag(IsoFlagType.canPathN);
                def.properties.SetFlag(IsoFlagType.transparentN);
            } else if (var37 === 'HoppableW') {
                def.properties.SetFlag(IsoFlagType.collideW);
                def.properties.SetFlag(IsoFlagType.canPathW);
                def.properties.SetFlag(IsoFlagType.transparentW);
            } else if (var37 === 'WallN') {
                def.properties.SetFlag(IsoFlagType.collideN);
                def.properties.SetFlag(IsoFlagType.cutN);
                def.type = IsoObjectType.wall;
                def.cutN = true;
                def.properties.Set('WallN', '', false);
            } else if (var37 === 'CantClimb') {
                def.properties.Set(IsoFlagType.CantClimb);
            } else if (var37 === 'container') {
                def.properties.Set(var37, var38, false);
            } else if (var37 === 'WallNTrans') {
                def.properties.Set(IsoFlagType.collideN);
                def.properties.Set(IsoFlagType.cutN);
                def.properties.Set(IsoFlagType.transparentN);
                def.type = IsoObjectType.wall;
                def.cutN = true;
                def.properties.Set('WallNTrans', '', false);
            } else if (var37 === 'WallW') {
                def.properties.SetFlag(IsoFlagType.collideW);
                def.properties.SetFlag(IsoFlagType.cutW);
                def.type = IsoObjectType.wall;
                def.cutW = true;
                def.properties.Set('WallW', '', false);
            } else if (var37 === 'WindowN') {
                def.properties.Set('WindowN', 'WindowN');
                def.properties.SetFlag(IsoFlagType.transparentN);
                def.properties.Set('WindowN', 'WindowN', false);
            } else if (var37 === 'WindowW') {
                def.properties.Set('WindowW', 'WindowW');
                def.properties.SetFlag(IsoFlagType.transparentW);
                def.properties.Set('WindowW', 'WindowW', false);
            } else if (var37 === 'cutW') {
                def.properties.SetFlag(IsoFlagType.cutW);
                def.cutW = true;
            } else if (var37 === 'cutN') {
                def.properties.SetFlag(IsoFlagType.cutN);
                def.cutN = true;
            } else if (var37 === 'WallWTrans') {
                def.properties.SetFlag(IsoFlagType.collideW);
                def.properties.SetFlag(IsoFlagType.transparentW);
                def.properties.SetFlag(IsoFlagType.cutW);
                def.type = IsoObjectType.wall;
                def.cutW = true;
                def.properties.Set('WallWTrans', '', false);
            } else if (var37 === 'DoorWallN') {
                def.properties.SetFlag(IsoFlagType.cutN);
                def.cutN = true;
                def.properties.Set('DoorWallN', '', false);
            } else if (var37 === 'DoorWallNTrans') {
                def.properties.SetFlag(IsoFlagType.cutN);
                def.properties.SetFlag(IsoFlagType.transparentN);
                def.cutN = true;
                def.properties.Set('DoorWallNTrans', '', false);
            } else if (var37 === 'DoorWallW') {
                def.properties.SetFlag(IsoFlagType.cutW);
                def.cutW = true;
                def.properties.Set('DoorWallW', '', false);
            } else if (var37 === 'DoorWallWTrans') {
                def.properties.SetFlag(IsoFlagType.cutW);
                def.properties.SetFlag(IsoFlagType.transparentW);
                def.cutW = true;
                def.properties.Set('DoorWallWTrans', '', false);
            } else if (var37 === 'WallNW') {
                def.properties.SetFlag(IsoFlagType.collideN);
                def.properties.SetFlag(IsoFlagType.cutN);
                def.properties.SetFlag(IsoFlagType.collideW);
                def.properties.SetFlag(IsoFlagType.cutW);

                def.type = IsoObjectType.wall;
                def.cutW = true;
                def.cutN = true;
                def.properties.Set('WallNW', '', false);
            } else if (var37 === 'WallNWTrans') {
                def.properties.SetFlag(IsoFlagType.collideN);
                def.properties.SetFlag(IsoFlagType.cutN);
                def.properties.SetFlag(IsoFlagType.collideW);
                def.properties.SetFlag(IsoFlagType.transparentN);
                def.properties.SetFlag(IsoFlagType.transparentW);
                def.properties.SetFlag(IsoFlagType.cutW);
                def.type = IsoObjectType.wall;
                def.cutW = true;
                def.cutN = true;
                def.properties.Set('WallNWTrans', '', false);
            } else if (var37 === 'WallSE') {
                def.properties.SetFlag(IsoFlagType.cutW);
                def.properties.SetFlag(IsoFlagType.WallSE);
                def.properties.Set('WallSE', 'WallSE');
                def.cutW = true;
            } else if (var37 === 'WindowW') {
                def.properties.SetFlag(IsoFlagType.canPathW);
                def.properties.SetFlag(IsoFlagType.collideW);
                def.properties.SetFlag(IsoFlagType.cutW);
                def.properties.SetFlag(IsoFlagType.transparentW);
                def.type = IsoObjectType.windowFW;

                if (def.properties.Is(IsoFlagType.HoppableW)) {
                    def.properties.UnSet(IsoFlagType.HoppableW);
                }

                def.cutW = true;
            } else if (var37 === 'WindowN') {
                def.properties.SetFlag(IsoFlagType.canPathN);
                def.properties.SetFlag(IsoFlagType.collideN);
                def.properties.SetFlag(IsoFlagType.cutN);
                def.properties.SetFlag(IsoFlagType.transparentN);
                def.type = IsoObjectType.windowFN;
                if (def.properties.Is(IsoFlagType.HoppableN)) {
                    def.properties.UnSet(IsoFlagType.HoppableN);
                }

                def.cutN = true;
            } else if (var37 === 'UnbreakableWindowW') {
                def.properties.SetFlag(IsoFlagType.canPathW);
                def.properties.SetFlag(IsoFlagType.collideW);
                def.properties.SetFlag(IsoFlagType.cutW);
                def.properties.SetFlag(IsoFlagType.transparentW);
                def.properties.SetFlag(IsoFlagType.collideW);
                def.type = IsoObjectType.wall;
                def.cutW = true;
            } else if (var37 === 'UnbreakableWindowN') {
                def.properties.SetFlag(IsoFlagType.canPathN);
                def.properties.SetFlag(IsoFlagType.collideN);
                def.properties.SetFlag(IsoFlagType.cutN);
                def.properties.SetFlag(IsoFlagType.transparentN);
                def.properties.SetFlag(IsoFlagType.collideN);
                def.type = IsoObjectType.wall;
                def.cutN = true;
            } else if (var37 === 'UnbreakableWindowNW') {
                def.properties.SetFlag(IsoFlagType.cutN);
                def.properties.SetFlag(IsoFlagType.transparentN);
                def.properties.SetFlag(IsoFlagType.collideN);
                def.properties.SetFlag(IsoFlagType.cutN);
                def.properties.SetFlag(IsoFlagType.collideW);
                def.properties.SetFlag(IsoFlagType.cutW);
                def.type = IsoObjectType.wall;
                def.cutW = true;
                def.cutN = true;
            } else if (var37 === 'NoWallLighting') {
                def.properties.SetFlag(IsoFlagType.NoWallLighting);
            } else if (var37 === 'ForceAmbient') {
                def.properties.SetFlag(IsoFlagType.ForceAmbient);
            }

            if (var37 === 'name') {
                def.parentObjectName = var38;
            }
        }
    }

    /**
     * @param {string} var1
     * @param {Array<IsoSprite>} var2
     *
     * @returns {void}
     */
    setOpenDoorProperties(var1, var2) {
        for (let var3 = 0; var3 < var2.length; var3++) {
            const var4 = var2[var3];
            if ((var4.type === IsoObjectType.doorN || var4.type === IsoObjectType.doorW) && !var4.properties.Is(IsoFlagType.open)) {
                const var5 = var4.properties.Val('DoubleDoor');
                if (var5 != null) {

                    let var6 = parseInt(var5);
                    if (var6 == null) var6 = -1;

                    if (var6 >= 5) {
                        var4.properties.SetFlag(IsoFlagType.open);
                    }

                } else {
                    const var8 = var4.properties.Val('GarageDoor');
                    if (var8 != null) {

                        let var7 = parseInt(var8);
                        if (var7 == null) var7 = -1;

                        if (var7 >= 4) {
                            var4.properties.SetFlag(IsoFlagType.open);
                        }

                    } else {
                        const var9 = IsoSpriteManager.instance.NamedMap[`${var1}_${var4.tileSheetIndex + 2}`];
                        if (var9 != null) {
                            var9.type = var4.type;
                            var9.properties.SetFlag(var4.type === IsoObjectType.doorN ? IsoFlagType.doorN : IsoFlagType.doorW);
                            var9.properties.SetFlag(IsoFlagType.open);
                        }
                    }
                }
            }
        }
    }

    /**
     * @param {int} var2
     */
    jumboTreeDefinitions(var2) {
        this.addJumboTreeTileset(var2, 'americanholly', 1, 2, 3);
        this.addJumboTreeTileset(var2, 'americanlinden', 2, 6, 2);
        this.addJumboTreeTileset(var2, 'canadianhemlock', 3, 2, 3);
        this.addJumboTreeTileset(var2, 'carolinasilverbell', 4, 6, 1);
        this.addJumboTreeTileset(var2, 'cockspurhawthorn', 5, 6, 2);
        this.addJumboTreeTileset(var2, 'dogwood', 6, 6, 2);
        this.addJumboTreeTileset(var2, 'easternredbud', 7, 6, 2);
        this.addJumboTreeTileset(var2, 'redmaple', 8, 6, 2);
        this.addJumboTreeTileset(var2, 'riverbirch', 9, 6, 1);
        this.addJumboTreeTileset(var2, 'virginiapine', 10, 2, 1);
        this.addJumboTreeTileset(var2, 'yellowwood', 11, 6, 2);

        /**
         * @type byte
         */
        const var3 = 12;

        /**
         * @type byte
         */
        const var4 = 0;


        const name = `jumbo_tree_01_${var4}`;
        /**
         * @type Tile
         */
        const var5 = IsoSpriteManager.instance.AddSprite(name, var2 * 512 * 512 + var3 * 512 + var4);
        var5.name = name;
        var5.type = IsoObjectType.tree;
        var5.properties.Set('tree', '4');
        var5.properties.UnSet(IsoFlagType.solid);
        var5.properties.Set(IsoFlagType.blocksight);
    }

    /**
     * @param {int} var2
     * @param {string} var3
     * @param {int} var4
     * @param {int} var5
     * @param {int} var6
     */
    addJumboTreeTileset(var2, var3, var4, var5, var6) {
        /**
         * @type byte
         */
        const var7 = 2;

        for (let var8 = 0; var8 < var5; var8++) {
            for (let var9 = 0; var9 < var7; var9++) {

                /**
                 * @type string
                 */
                const var10 = `e_${var3}JUMBO_1`;

                /**
                 * @type int
                 */
                const var11 = var8 * var7 + var9;


                const name = `${var10}_${var11}`;
                /**
                 * @type Tile
                 */
                const var12 = IsoSpriteManager.instance.AddSprite(name, var2 * 512 * 512 + var4 * 512 + var11);
                var12.name = name;
                var12.type = IsoObjectType.tree;
                var12.properties.Set('tree', var9 == 0 ? '5' : '6');
                var12.properties.UnsetFlag(IsoFlagType.solid);
                var12.properties.SetFlag(IsoFlagType.blocksight);
                var12.properties.CreateKeySet();
                var12.moveWithWind = true;
                var12.windType = var6;
            }
        }
    }
}

const world = new IsoWorld();


/**
 * Debug: This parameter is either checked as less than 2 or >= 2 for tile ID.
 *
 * For mods: ChooseGameInfo.TileDef.fileNumber value.
 */
const files = {
    'tiledefinitions.tiles': 0,
    'newtiledefinitions.tiles': 1,
    'tiledefinitions_erosion.tiles': 2,
    'tiledefinitions_apcom.tiles': 3,
    'tiledefinitions_overlays.tiles': 4,
    // 'tiledefinitions_4.tiles': 5, // This one isn't loaded in the game. (This one has erroneous data)
    'tiledefinitions_noiseworks.patch.tiles': -1,
};

const process = function () {
    // Define relative paths for input and output
    const inputFolder = 'resources/tiles/';
    const outputFolder = 'output/json/';

    // Ensure output folder exists
    if (!fs.existsSync(outputFolder)) {
        fs.mkdirSync(outputFolder, { recursive: true });
    }

    world.tileImages.length = 0;

    // Load tile definition property strings from the input folder
    for (const key of Object.keys(files)) {
        world.loadTileDefinitionsPropertyStrings(inputFolder + key);
    }

    // Set custom property values and generate lookup tables
    world.setCustomPropertyValues();
    world.generateTilePropertyLookupTables();

    // Process each file and write the output to the JSON folder
    for (const key of Object.keys(files)) {
        const tiles = world.readTileDefinitions(inputFolder + key, files[key]);

        const tilesJSON = {};
        for (const tileKey of Object.keys(tiles)) {
            const val = tiles[tileKey];
            tilesJSON[tileKey] = val.toJSON();
        }

        // Write the JSON data to the output folder
        fs.writeFileSync(outputFolder + key + '.json', JSON.stringify(tilesJSON, null, 2));
    }

    world.jumboTreeDefinitions(5);
};

// Call the process function
process();
