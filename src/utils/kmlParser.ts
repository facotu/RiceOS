import { GPSLatLng } from '../types';

export interface ParsedKMLResult {
  title?: string;
  description?: string;
  polygonCoords: GPSLatLng[];
  centerLat: number;
  centerLng: number;
  areaM2: number;
  areaSao: number;
  areaHa: number;
}

/**
 * Calculates the approximate area of a geodesic polygon in square meters using the Shoelace formula adapted for Lat/Lng.
 */
export function calculateGeodesicArea(coords: GPSLatLng[]): number {
  if (!coords || coords.length < 3) return 0;

  const EARTH_RADIUS = 6378137; // Earth's radius in meters (WGS84)
  let area = 0;

  for (let i = 0; i < coords.length; i++) {
    const j = (i + 1) % coords.length;
    const p1 = coords[i];
    const p2 = coords[j];

    const lat1Rad = (p1.lat * Math.PI) / 180;
    const lat2Rad = (p2.lat * Math.PI) / 180;
    const dLngRad = ((p2.lng - p1.lng) * Math.PI) / 180;

    area += (dLngRad) * (2 + Math.sin(lat1Rad) + Math.sin(lat2Rad));
  }

  area = (area * EARTH_RADIUS * EARTH_RADIUS) / 4.0;
  return Math.abs(area);
}

/**
 * Calculates the center Lat/Lng of a set of coordinates.
 */
export function calculateCenterCoordinates(coords: GPSLatLng[]): { lat: number; lng: number } {
  if (!coords || coords.length === 0) {
    return { lat: 15.9625, lng: 108.2045 };
  }

  let totalLat = 0;
  let totalLng = 0;

  coords.forEach((pt) => {
    totalLat += pt.lat;
    totalLng += pt.lng;
  });

  return {
    lat: Number((totalLat / coords.length).toFixed(6)),
    lng: Number((totalLng / coords.length).toFixed(6)),
  };
}

/**
 * Extracts coordinates string from KML element text like "108.2040,15.9632,0 108.2052,15.9636,0 ..."
 * Note: KML format is longitude,latitude,altitude.
 */
export function parseKMLCoordinatesString(coordString: string): GPSLatLng[] {
  if (!coordString) return [];

  const points: GPSLatLng[] = [];
  const rawPairs = coordString.trim().split(/\s+/);

  rawPairs.forEach((pairStr) => {
    const parts = pairStr.split(',');
    if (parts.length >= 2) {
      const lng = parseFloat(parts[0]);
      const lat = parseFloat(parts[1]);

      if (!isNaN(lat) && !isNaN(lng)) {
        points.push({
          lat: Number(lat.toFixed(6)),
          lng: Number(lng.toFixed(6)),
        });
      }
    }
  });

  return points;
}

/**
 * Parses raw KML text string into structured spatial data.
 */
export function parseKMLText(kmlText: string): ParsedKMLResult {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(kmlText, 'text/xml');

  // Try extracting Placemark name & description
  const nameNode = xmlDoc.querySelector('Placemark > name') || xmlDoc.querySelector('Document > name') || xmlDoc.querySelector('name');
  const descNode = xmlDoc.querySelector('Placemark > description') || xmlDoc.querySelector('description');

  const title = nameNode?.textContent?.trim() || 'Vùng Trồng KML';
  const description = descNode?.textContent?.trim() || '';

  // Locate polygon coordinates or line coordinates
  const coordsNode =
    xmlDoc.querySelector('Polygon coordinates') ||
    xmlDoc.querySelector('LinearRing coordinates') ||
    xmlDoc.querySelector('LineString coordinates') ||
    xmlDoc.querySelector('Point coordinates') ||
    xmlDoc.querySelector('coordinates');

  const coordText = coordsNode?.textContent || '';
  const polygonCoords = parseKMLCoordinatesString(coordText);

  const center = calculateCenterCoordinates(polygonCoords);
  const areaM2 = calculateGeodesicArea(polygonCoords);

  // 1 sào Trung Bộ / Nam Bộ ≈ 500 m2
  const areaSao = Number((areaM2 / 500).toFixed(1));
  const areaHa = Number((areaM2 / 10000).toFixed(2));

  return {
    title,
    description,
    polygonCoords,
    centerLat: center.lat,
    centerLng: center.lng,
    areaM2: Math.round(areaM2),
    areaSao: areaSao || 10,
    areaHa: areaHa || 0.5,
  };
}

/**
 * Helper to extract KML from a .kmz (ZIP archive) or .kml file.
 */
export async function readKMLOrKMZFile(file: File): Promise<ParsedKMLResult> {
  const filename = file.name.toLowerCase();

  if (filename.endsWith('.kmz')) {
    // Basic KMZ reader using text decoding search for xml content if uncompressed or simple text extraction
    const arrayBuffer = await file.arrayBuffer();
    const textDecoder = new TextDecoder('utf-8');
    const fullText = textDecoder.decode(arrayBuffer);

    // Look for <kml or <coordinates in the decoded text stream
    const kmlStartIdx = fullText.indexOf('<kml');
    const kmlEndIdx = fullText.lastIndexOf('</kml>');

    if (kmlStartIdx !== -1 && kmlEndIdx !== -1) {
      const extractedKml = fullText.substring(kmlStartIdx, kmlEndIdx + 6);
      return parseKMLText(extractedKml);
    }

    // Fallback: search for <coordinates> tag directly
    const coordStart = fullText.indexOf('<coordinates>');
    const coordEnd = fullText.lastIndexOf('</coordinates>');

    if (coordStart !== -1 && coordEnd !== -1) {
      const coordText = fullText.substring(coordStart + 13, coordEnd);
      const coords = parseKMLCoordinatesString(coordText);
      const center = calculateCenterCoordinates(coords);
      const areaM2 = calculateGeodesicArea(coords);

      return {
        title: file.name.replace(/\.[^/.]+$/, ''),
        description: 'Đã nạp dữ liệu ranh giới từ file KMZ',
        polygonCoords: coords,
        centerLat: center.lat,
        centerLng: center.lng,
        areaM2: Math.round(areaM2),
        areaSao: Number((areaM2 / 500).toFixed(1)) || 10,
        areaHa: Number((areaM2 / 10000).toFixed(2)) || 0.5,
      };
    }

    throw new Error('Không thể tự động giải nạp cấu trúc KML trong file .kmz. Vui lòng thử file .kml tiêu chuẩn.');
  } else {
    // Standard .kml file text
    const text = await file.text();
    return parseKMLText(text);
  }
}
