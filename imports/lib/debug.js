import { default as debugLibraryLogFactory } from 'debug';

export const logFactory = (
  name = '',
  filename = '',
  prefix = '@',
  postfix = ''
) => debugLibraryLogFactory(`${prefix}${name}${filename}${postfix}`);
