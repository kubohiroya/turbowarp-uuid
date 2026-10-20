interface TurboWarpExtension {
  getInfo(): Record<string, unknown>;
}

interface ScratchApi {
  extensions: {
    unsandboxed: boolean;
    register(extension: TurboWarpExtension): void;
  };
  BlockType: Record<'REPORTER' | 'BOOLEAN', string>;
  ArgumentType: Record<'STRING', string>;
  Cast: {toString(value: unknown): string};
  translate: {
    (message: string): string;
    setup(translations: Record<string, Record<string, string>>): void;
  };
}

declare const Scratch: ScratchApi;
