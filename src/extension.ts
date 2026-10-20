import {extensionConfig} from './config.js';
import definitions from './block-definitions.json';
import {generateUuidV4, generateUuidV7, isUuid} from './uuid.js';

export class UuidExtension implements TurboWarpExtension {
  public getInfo(): Record<string, unknown> {
    return {
      id: extensionConfig.id,
      name: Scratch.translate(definitions.extensionName),
      docsURI: extensionConfig.docsURI,
      blockIconURI: extensionConfig.blockIconURI,
      color1: '#0f766e',
      color2: '#115e59',
      color3: '#134e4a',
      blocks: definitions.blocks.map((block) => ({
        opcode: block.opcode,
        blockType: Scratch.BlockType[block.blockType as 'REPORTER' | 'BOOLEAN'],
        text: Scratch.translate(block.text),
        ...('disableMonitor' in block ? {disableMonitor: block.disableMonitor} : {}),
        arguments: Object.fromEntries(
          Object.entries(block.arguments).map(([name, argument]) => [
            name,
            {type: Scratch.ArgumentType.STRING, defaultValue: argument.defaultValue}
          ])
        )
      }))
    };
  }

  public generateV4(): string {
    return generateUuidV4();
  }

  public generateV7(): string {
    return generateUuidV7();
  }

  public isUuid(args: {UUID: unknown}): boolean {
    return isUuid(Scratch.Cast.toString(args.UUID));
  }
}
