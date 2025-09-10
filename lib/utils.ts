// lib/utils.ts
import { mkdir } from 'fs/promises';
import { dirname } from 'path';

/**
 * 确保目录存在
 */
export async function ensureDir(filePath: string) {
  try {
    await mkdir(dirname(filePath), { recursive: true });
  } catch (err: any) {
    if (err.code !== 'EEXIST') throw err;
  }
}