import {UuidExtension} from './extension.js';

Scratch.translate.setup({
  ja: {
    '_generate UUID v4': 'UUID v4を生成する',
    '_generate UUID v7': 'UUID v7を生成する',
    '_[UUID] is a UUID?': '[UUID] はUUID？'
  }
});

Scratch.extensions.register(new UuidExtension());
