// Name: TurboWarp-UUID
// ID: kubohiroyauuid
// Description: Generate UUID v4/v7 and validate UUID strings in TurboWarp.
// By: Hiroya Kubo
// License: MPL-2.0

(function (Scratch) {
  'use strict';

  //#region src/config.ts
  var extensionConfig = {
  	id: "kubohiroyauuid",
  	slug: "turbowarp-uuid",
  	name: "TurboWarp-UUID",
  	description: "Generate UUID v4/v7 and validate UUID strings in TurboWarp.",
  	author: "Hiroya Kubo",
  	license: "MPL-2.0",
  	unsandboxed: false,
  	docsURI: "https://kubohiroya.github.io/turbowarp-uuid/",
  	blockIconURI: `data:image/svg+xml,${encodeURIComponent("<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 48 48\"><rect x=\"3\" y=\"7\" width=\"42\" height=\"34\" rx=\"8\" fill=\"#0f766e\"/><text x=\"24\" y=\"30\" text-anchor=\"middle\" fill=\"white\" font-family=\"monospace\" font-size=\"17\">ID</text></svg>")}`
  };
  var block_definitions_default = {
  	extensionName: "TurboWarp-UUID",
  	blocks: [
  		{
  			"opcode": "generateV4",
  			"blockType": "REPORTER",
  			"text": "generate UUID v4",
  			"description": "Returns a new lowercase UUID v4 using cryptographically secure random bytes. Store the result in a variable to reuse it.",
  			"disableMonitor": true,
  			"arguments": {}
  		},
  		{
  			"opcode": "generateV7",
  			"blockType": "REPORTER",
  			"text": "generate UUID v7",
  			"description": "Returns a new lowercase UUID v7 containing the current Unix time in milliseconds and secure random bits. Ordering within a millisecond or after a clock rollback is not guaranteed.",
  			"disableMonitor": true,
  			"arguments": {}
  		},
  		{
  			"opcode": "isUuid",
  			"blockType": "BOOLEAN",
  			"text": "[UUID] is a UUID?",
  			"description": "Checks a complete, hyphenated UUID string, case-insensitively. Accepts versions 1–8 with the RFC variant, plus Nil and Max UUIDs. Rejects spaces, braces, URN prefixes and missing hyphens. This checks format only, not uniqueness or authenticity.",
  			"arguments": { "UUID": {
  				"type": "STRING",
  				"defaultValue": "017f22e2-79b0-7cc3-98c4-dc0c0c07398f"
  			} }
  		}
  	]
  };
  //#endregion
  //#region src/uuid.ts
  var UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  var NIL_UUID = "00000000-0000-0000-0000-000000000000";
  var MAX_UUID = "ffffffff-ffff-ffff-ffff-ffffffffffff";
  var MAX_TIMESTAMP = 0xffffffffffff;
  function randomBytes() {
  	if (typeof globalThis.crypto?.getRandomValues !== "function") throw new Error("Secure random generation is unavailable in this browser.");
  	return globalThis.crypto.getRandomValues(/* @__PURE__ */ new Uint8Array(16));
  }
  function formatUuid(bytes) {
  	const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
  	return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
  }
  function generateUuidV4() {
  	const bytes = randomBytes();
  	bytes[6] = bytes[6] & 15 | 64;
  	bytes[8] = bytes[8] & 63 | 128;
  	return formatUuid(bytes);
  }
  function generateUuidV7(timestamp = Date.now()) {
  	if (!Number.isInteger(timestamp) || timestamp < 0 || timestamp > MAX_TIMESTAMP) throw new RangeError("UUID v7 requires an integer timestamp between 0 and 281474976710655 milliseconds.");
  	const bytes = randomBytes();
  	let remaining = timestamp;
  	for (let index = 5; index >= 0; index -= 1) {
  		bytes[index] = remaining % 256;
  		remaining = Math.floor(remaining / 256);
  	}
  	bytes[6] = bytes[6] & 15 | 112;
  	bytes[8] = bytes[8] & 63 | 128;
  	return formatUuid(bytes);
  }
  function isUuid(value) {
  	if (value.length !== 36) return false;
  	return UUID_PATTERN.test(value) || value === NIL_UUID || value.toLowerCase() === MAX_UUID;
  }
  //#endregion
  //#region src/extension.ts
  var UuidExtension = class {
  	getInfo() {
  		return {
  			id: extensionConfig.id,
  			name: Scratch.translate(block_definitions_default.extensionName),
  			docsURI: extensionConfig.docsURI,
  			blockIconURI: extensionConfig.blockIconURI,
  			color1: "#0f766e",
  			color2: "#115e59",
  			color3: "#134e4a",
  			blocks: block_definitions_default.blocks.map((block) => ({
  				opcode: block.opcode,
  				blockType: Scratch.BlockType[block.blockType],
  				text: Scratch.translate(block.text),
  				..."disableMonitor" in block ? { disableMonitor: block.disableMonitor } : {},
  				arguments: Object.fromEntries(Object.entries(block.arguments).map(([name, argument]) => [name, {
  					type: Scratch.ArgumentType.STRING,
  					defaultValue: argument.defaultValue
  				}]))
  			}))
  		};
  	}
  	generateV4() {
  		return generateUuidV4();
  	}
  	generateV7() {
  		return generateUuidV7();
  	}
  	isUuid(args) {
  		return isUuid(Scratch.Cast.toString(args.UUID));
  	}
  };
  //#endregion
  //#region src/index.ts
  Scratch.translate.setup({ ja: {
  	"_generate UUID v4": "UUID v4を生成する",
  	"_generate UUID v7": "UUID v7を生成する",
  	"_[UUID] is a UUID?": "[UUID] はUUID？"
  } });
  Scratch.extensions.register(new UuidExtension());
  //#endregion

})(Scratch);
