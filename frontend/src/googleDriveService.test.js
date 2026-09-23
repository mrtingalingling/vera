import { describe, it, expect } from 'vitest';
import {
  extractFileIdAndType,
  getDriveExportUrl,
  fetchGoogleDriveContent
} from './googleDriveService.js';

describe('Google Drive Service Unit Tests', () => {
  it('test_extract_doc_id_from_url', () => {
    const url = 'https://docs.google.com/document/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit?usp=sharing';
    const result = extractFileIdAndType(url);
    expect(result).not.toBeNull();
    expect(result.id).toBe('1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms');
    expect(result.type).toBe('doc');
  });

  it('test_extract_sheet_id_from_url', () => {
    const url = 'https://docs.google.com/spreadsheets/d/1qpyC0X95HpM609ZZUReQ42Bf28x3tS_123456789abc/edit#gid=0';
    const result = extractFileIdAndType(url);
    expect(result).not.toBeNull();
    expect(result.id).toBe('1qpyC0X95HpM609ZZUReQ42Bf28x3tS_123456789abc');
    expect(result.type).toBe('sheet');
  });

  it('test_extract_raw_id', () => {
    const rawId = '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms';
    const result = extractFileIdAndType(rawId);
    expect(result).not.toBeNull();
    expect(result.id).toBe(rawId);
    expect(result.type).toBe('doc');
  });

  it('test_invalid_url_returns_null', () => {
    expect(extractFileIdAndType('https://google.com')).toBeNull();
    expect(extractFileIdAndType('')).toBeNull();
    expect(extractFileIdAndType(null)).toBeNull();
  });

  it('test_get_drive_export_url_doc', () => {
    const url = getDriveExportUrl('test-doc-123', 'doc');
    expect(url).toBe('https://www.googleapis.com/drive/v3/files/test-doc-123/export?mimeType=text/plain');
  });

  it('test_get_drive_export_url_sheet', () => {
    const url = getDriveExportUrl('test-sheet-456', 'sheet');
    expect(url).toBe('https://www.googleapis.com/drive/v3/files/test-sheet-456/export?mimeType=text/csv');
  });

  it('test_fetch_google_drive_content_fallback', async () => {
    const url = 'https://docs.google.com/document/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit';
    const result = await fetchGoogleDriveContent(url);
    expect(result.success).toBe(true);
    expect(result.isFallback).toBe(true);
    expect(result.type).toBe('doc');
    expect(result.text).toContain('Google Doc: Grounded_1BxiMVs0');
  });

  it('test_fetch_google_drive_content_invalid_throws', async () => {
    await expect(fetchGoogleDriveContent('invalid-url')).rejects.toThrow('Invalid Google Drive URL');
  });
});
