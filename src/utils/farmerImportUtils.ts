export interface ParsedFarmerRow {
  name: string;
  phone: string;
  cccd: string;
  cccd_issue_date?: string;
  cccd_issue_place?: string;
  area_sao: number;
  variety_code?: string;
  estimated_yield_ton?: number;
}

/**
 * Parses CSV or tab-separated text content into an array of Farmer objects for a plot.
 */
export function parseFarmersText(text: string): ParsedFarmerRow[] {
  if (!text || !text.trim()) return [];

  const lines = text.trim().split(/\r?\n/);
  const farmers: ParsedFarmerRow[] = [];

  // Skip header if line 0 looks like column names
  let startIdx = 0;
  const firstLine = lines[0].toLowerCase();
  if (firstLine.includes('tên') || firstLine.includes('name') || firstLine.includes('cccd') || firstLine.includes('sđt')) {
    startIdx = 1;
  }

  for (let i = startIdx; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Detect delimiter: comma, tab, or semicolon
    const delimiter = line.includes('\t') ? '\t' : line.includes(';') ? ';' : ',';
    const cols = line.split(delimiter).map(c => c.trim().replace(/^"(.*)"$/, '$1'));

    if (cols.length >= 2) {
      const name = cols[0] || 'Hộ nông dân';
      const phone = cols[1] || '';
      const cccd = cols[2] || '';
      const area_sao = parseFloat(cols[3]) || 10;
      const variety_code = cols[4] || 'HT1';
      const estimated_yield_ton = parseFloat(cols[5]) || Number((area_sao * 0.6).toFixed(1));
      const cccd_issue_date = cols[6] || '15/05/2021';
      const cccd_issue_place = cols[7] || 'Công an TP Đà Nẵng';

      farmers.push({
        name,
        phone,
        cccd,
        area_sao,
        variety_code,
        estimated_yield_ton,
        cccd_issue_date,
        cccd_issue_place
      });
    }
  }

  return farmers;
}

/**
 * Generates sample CSV file string for downloading import template.
 */
export function generateFarmerCSVTemplate(): string {
  const header = "Họ và tên Chủ hộ,Số điện thoại,Số CCCD,Diện tích (sào),Giống lúa,Sản lượng ước tính (tấn),Ngày cấp CCCD,Nơi cấp CCCD\n";
  const row1 = "Nguyễn Văn An,0914123456,048092001234,12.5,HT1,7.5,15/05/2021,Cục CSQLHC về TTXH\n";
  const row2 = "Trần Thị Bình,0988765432,048095005678,18.0,J02,11.0,20/10/2020,Công an TP Đà Nẵng\n";
  const row3 = "Lê Văn Cường,0905888999,048188009999,15.0,HG12,9.0,10/01/2022,Cục CSQLHC về TTXH\n";

  return header + row1 + row2 + row3;
}
