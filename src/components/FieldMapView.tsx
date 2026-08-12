import React, { useState } from 'react';
import { FieldPlot, Farmer, UserProfile, GPSLatLng } from '../types';
import { readKMLOrKMZFile, ParsedKMLResult, calculateGeodesicArea, calculateCenterCoordinates } from '../utils/kmlParser';
import { parseFarmersText, generateFarmerCSVTemplate, ParsedFarmerRow } from '../utils/farmerImportUtils';
import {
  MapPin,
  Navigation,
  Users,
  Scale,
  ExternalLink,
  Plus,
  Map as MapIcon,
  ChevronRight,
  Layers,
  Edit2,
  Trash2,
  Upload,
  FileSpreadsheet,
  Download,
  Search,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  FileText
} from 'lucide-react';

interface FieldMapViewProps {
  currentUser: UserProfile;
  plots: FieldPlot[];
  farmers: Farmer[];
  onUpdatePlots: (plots: FieldPlot[]) => void;
  onUpdateFarmers: (farmers: Farmer[]) => void;
  onNavigateWeighing: (farmerId: string) => void;
}

export const FieldMapView: React.FC<FieldMapViewProps> = ({
  currentUser,
  plots,
  farmers,
  onUpdatePlots,
  onUpdateFarmers,
  onNavigateWeighing
}) => {
  const [selectedPlotId, setSelectedPlotId] = useState<string>(plots[0]?.id || 'fp-1');
  const [farmerSearchText, setFarmerSearchText] = useState('');
  const [showPolygonOverlay, setShowPolygonOverlay] = useState(true);
  const [showBoundaryModal, setShowBoundaryModal] = useState(false);

  // Selected plot object or fallback
  const selectedPlot = plots.find((p) => p.id === selectedPlotId) || plots[0] || {
    id: 'fp-1',
    field_name: 'Xứ đồng An Trạch 1',
    plot_no: 'Lô A2',
    address: 'Thôn An Trạch, Xã Hòa Tiến, Đà Nẵng',
    lat: 15.9625,
    lng: 108.2045,
    area_total_sao: 22.5,
    area_total_ha: 1.125,
    main_variety: 'HT1',
    status: 'harvesting',
    polygon_coords: [
      { lat: 15.9632, lng: 108.2040 },
      { lat: 15.9636, lng: 108.2052 },
      { lat: 15.9619, lng: 108.2058 },
      { lat: 15.9614, lng: 108.2043 }
    ]
  };

  // Farmers belonging to current selected plot
  const plotFarmers = farmers.filter(
    (f) => f.plot_id === selectedPlot.id || (f.field_name === selectedPlot.field_name && f.plot_no === selectedPlot.plot_no)
  );

  const filteredPlotFarmers = plotFarmers.filter((f) => {
    if (!farmerSearchText.trim()) return true;
    const q = farmerSearchText.toLowerCase();
    return (
      f.name.toLowerCase().includes(q) ||
      f.phone.includes(q) ||
      f.cccd.includes(q) ||
      (f.variety_code || '').toLowerCase().includes(q)
    );
  });

  // KPI calculations
  const totalAreaSao = plots.reduce((sum, p) => sum + (p.area_total_sao || 0), 0);
  const totalFarmersCount = farmers.length;
  const polygonPoints = selectedPlot.polygon_coords || [];

  // ==========================================
  // MODAL STATES FOR PLOT CRUD & KML IMPORT
  // ==========================================
  const [showPlotFormModal, setShowPlotFormModal] = useState(false);
  const [plotFormMode, setPlotFormMode] = useState<'create' | 'edit'>('create');
  const [editingPlotId, setEditingPlotId] = useState<string | null>(null);

  // Plot Form Fields
  const [plotFieldName, setPlotFieldName] = useState('');
  const [plotNo, setPlotNo] = useState('');
  const [plotAddress, setPlotAddress] = useState('');
  const [plotAreaSao, setPlotAreaSao] = useState('20');
  const [plotVariety, setPlotVariety] = useState('HT1');
  const [plotStatus, setPlotStatus] = useState<'harvesting' | 'waiting' | 'completed'>('harvesting');
  const [plotLat, setPlotLat] = useState('15.9625');
  const [plotLng, setPlotLng] = useState('108.2045');
  const [plotDescription, setPlotDescription] = useState('');
  const [plotVerticesText, setPlotVerticesText] = useState('');

  // Delete Plot Modal State
  const [deletingPlot, setDeletingPlot] = useState<FieldPlot | null>(null);

  // KML/KMZ Import Modal State
  const [showKmlModal, setShowKmlModal] = useState(false);
  const [kmlParseResult, setKmlParseResult] = useState<ParsedKMLResult | null>(null);
  const [kmlImportTargetMode, setKmlImportTargetMode] = useState<'new_plot' | 'update_current'>('new_plot');
  const [kmlFileError, setKmlFileError] = useState<string | null>(null);
  const [isParsingKml, setIsParsingKml] = useState(false);
  const [rawKmlTextInput, setRawKmlTextInput] = useState('');

  // ==========================================
  // MODAL STATES FOR FARMER CRUD & CSV IMPORT
  // ==========================================
  const [showFarmerFormModal, setShowFarmerFormModal] = useState(false);
  const [farmerFormMode, setFarmerFormMode] = useState<'create' | 'edit'>('create');
  const [editingFarmerId, setEditingFarmerId] = useState<string | null>(null);

  // Farmer Form Fields
  const [farmerName, setFarmerName] = useState('');
  const [farmerPhone, setFarmerPhone] = useState('');
  const [farmerCccd, setFarmerCccd] = useState('');
  const [farmerCccdDate, setFarmerCccdDate] = useState('15/05/2021');
  const [farmerCccdPlace, setFarmerCccdPlace] = useState('Công an TP Đà Nẵng');
  const [farmerAreaSao, setFarmerAreaSao] = useState('10');
  const [farmerVariety, setFarmerVariety] = useState('HT1');
  const [farmerEstimatedYield, setFarmerEstimatedYield] = useState('6.0');

  // Delete Farmer Modal State
  const [deletingFarmer, setDeletingFarmer] = useState<Farmer | null>(null);

  // Import Farmers File Modal State
  const [showImportFarmersModal, setShowImportFarmersModal] = useState(false);
  const [importFarmersText, setImportFarmersText] = useState('');
  const [parsedImportFarmers, setParsedImportFarmers] = useState<ParsedFarmerRow[]>([]);

  // ==========================================
  // PLOT CRUD HANDLERS
  // ==========================================
  const handleOpenAddPlotModal = () => {
    setPlotFormMode('create');
    setEditingPlotId(null);
    setPlotFieldName('');
    setPlotNo('');
    setPlotAddress('Thôn An Trạch, Xã Hòa Tiến, Đà Nẵng');
    setPlotAreaSao('20');
    setPlotVariety('HT1');
    setPlotStatus('harvesting');
    setPlotLat('15.9625');
    setPlotLng('108.2045');
    setPlotDescription('');
    setPlotVerticesText(
      '15.9632, 108.2040\n15.9636, 108.2052\n15.9619, 108.2058\n15.9614, 108.2043'
    );
    setShowPlotFormModal(true);
  };

  const handleOpenEditPlotModal = (plot: FieldPlot, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setPlotFormMode('edit');
    setEditingPlotId(plot.id);
    setPlotFieldName(plot.field_name);
    setPlotNo(plot.plot_no);
    setPlotAddress(plot.address || '');
    setPlotAreaSao(String(plot.area_total_sao || 20));
    setPlotVariety(plot.main_variety || 'HT1');
    setPlotStatus(plot.status || 'harvesting');
    setPlotLat(String(plot.lat || 15.9625));
    setPlotLng(String(plot.lng || 108.2045));
    setPlotDescription(plot.description || '');

    const verticesStr = (plot.polygon_coords || [])
      .map((pt) => `${pt.lat}, ${pt.lng}`)
      .join('\n');
    setPlotVerticesText(verticesStr);
    setShowPlotFormModal(true);
  };

  const handleSavePlotForm = (e: React.FormEvent) => {
    e.preventDefault();

    if (!plotFieldName.trim() || !plotNo.trim()) {
      alert('Vui lòng nhập Tên Xứ đồng và Số Lô!');
      return;
    }

    // Parse vertices text into GPSLatLng[]
    const vertices: GPSLatLng[] = plotVerticesText
      .trim()
      .split('\n')
      .map((line) => {
        const parts = line.split(',').map((p) => parseFloat(p.trim()));
        if (parts.length >= 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
          return { lat: parts[0], lng: parts[1] };
        }
        return null;
      })
      .filter((pt): pt is GPSLatLng => pt !== null);

    const areaSaoNum = parseFloat(plotAreaSao) || 10;
    const areaHaNum = Number((areaSaoNum / 20).toFixed(2));
    const centerLatNum = parseFloat(plotLat) || 15.9625;
    const centerLngNum = parseFloat(plotLng) || 108.2045;

    if (plotFormMode === 'create') {
      const newPlot: FieldPlot = {
        id: 'fp-' + Date.now(),
        field_name: plotFieldName.trim(),
        plot_no: plotNo.trim(),
        address: plotAddress.trim(),
        area_total_sao: areaSaoNum,
        area_total_ha: areaHaNum,
        main_variety: plotVariety,
        status: plotStatus,
        lat: centerLatNum,
        lng: centerLngNum,
        description: plotDescription.trim(),
        polygon_coords: vertices,
        farmers_count: 0
      };

      const updatedPlots = [...plots, newPlot];
      onUpdatePlots(updatedPlots);
      setSelectedPlotId(newPlot.id);
    } else if (editingPlotId) {
      const updatedPlots = plots.map((p) => {
        if (p.id === editingPlotId) {
          return {
            ...p,
            field_name: plotFieldName.trim(),
            plot_no: plotNo.trim(),
            address: plotAddress.trim(),
            area_total_sao: areaSaoNum,
            area_total_ha: areaHaNum,
            main_variety: plotVariety,
            status: plotStatus,
            lat: centerLatNum,
            lng: centerLngNum,
            description: plotDescription.trim(),
            polygon_coords: vertices
          };
        }
        return p;
      });
      onUpdatePlots(updatedPlots);
    }

    setShowPlotFormModal(false);
  };

  const handleDeletePlotConfirm = () => {
    if (!deletingPlot) return;
    const updatedPlots = plots.filter((p) => p.id !== deletingPlot.id);
    onUpdatePlots(updatedPlots);

    // Also update current selected plot if deleted
    if (selectedPlotId === deletingPlot.id) {
      const nextPlot = updatedPlots[0];
      if (nextPlot) setSelectedPlotId(nextPlot.id);
    }

    setDeletingPlot(null);
  };

  // ==========================================
  // KML/KMZ IMPORT HANDLERS
  // ==========================================
  const handleKmlFileUpload = async (file: File) => {
    setIsParsingKml(true);
    setKmlFileError(null);
    try {
      const res = await readKMLOrKMZFile(file);
      setKmlParseResult(res);
    } catch (err: any) {
      setKmlFileError(err.message || 'Lỗi khi đọc file KML/KMZ. Vui lòng kiểm tra lại định dạng file!');
    } finally {
      setIsParsingKml(false);
    }
  };

  const handleParseRawKmlText = () => {
    if (!rawKmlTextInput.trim()) {
      setKmlFileError('Vui lòng dán nội dung XML của file .kml vào ô bên dưới!');
      return;
    }
    setIsParsingKml(true);
    setKmlFileError(null);
    try {
      const parserResult = readKMLOrKMZFile(
        new File([rawKmlTextInput], 'pasted.kml', { type: 'text/xml' })
      );
      parserResult.then((res) => {
        setKmlParseResult(res);
      }).catch((e) => {
        setKmlFileError('Không thể phân tích dữ liệu XML dán vào. Vui lòng kiểm tra lại.');
      }).finally(() => {
        setIsParsingKml(false);
      });
    } catch (e: any) {
      setKmlFileError('Lỗi phân tích cú pháp KML: ' + e.message);
      setIsParsingKml(false);
    }
  };

  const handleConfirmKmlImport = () => {
    if (!kmlParseResult || kmlParseResult.polygonCoords.length === 0) {
      alert('Chưa có dữ liệu ranh giới tọa độ KML hợp lệ!');
      return;
    }

    if (kmlImportTargetMode === 'new_plot') {
      const titleClean = kmlParseResult.title || 'Vùng Trồng KML';
      const newPlot: FieldPlot = {
        id: 'fp-kml-' + Date.now(),
        field_name: titleClean.includes('-') ? titleClean.split('-')[0].trim() : titleClean,
        plot_no: titleClean.includes('-') ? titleClean.split('-')[1].trim() : 'Lô KML',
        address: 'Bản đồ khoanh vùng KML/KMZ nhập tự động',
        lat: kmlParseResult.centerLat,
        lng: kmlParseResult.centerLng,
        area_total_sao: kmlParseResult.areaSao || 15,
        area_total_ha: kmlParseResult.areaHa || 0.75,
        area_m2: kmlParseResult.areaM2,
        main_variety: 'HT1',
        status: 'harvesting',
        description: kmlParseResult.description || 'Nạp trực tiếp từ file bản đồ KML/KMZ',
        polygon_coords: kmlParseResult.polygonCoords,
        farmers_count: 0
      };

      const updatedPlots = [...plots, newPlot];
      onUpdatePlots(updatedPlots);
      setSelectedPlotId(newPlot.id);
      alert(`✅ Đã khởi tạo thành công Vùng trồng mới từ bản đồ KML (${kmlParseResult.areaSao} sào / ${kmlParseResult.areaM2.toLocaleString()} m²)!`);
    } else {
      // Update coordinates of current selected plot
      const updatedPlots = plots.map((p) => {
        if (p.id === selectedPlot.id) {
          return {
            ...p,
            lat: kmlParseResult.centerLat,
            lng: kmlParseResult.centerLng,
            area_total_sao: kmlParseResult.areaSao || p.area_total_sao,
            area_total_ha: kmlParseResult.areaHa || p.area_total_ha,
            area_m2: kmlParseResult.areaM2,
            polygon_coords: kmlParseResult.polygonCoords
          };
        }
        return p;
      });
      onUpdatePlots(updatedPlots);
      alert(`✅ Đã cập nhật ranh giới khoanh vùng bản đồ KML cho Lô ${selectedPlot.plot_no} thành công!`);
    }

    setShowKmlModal(false);
    setKmlParseResult(null);
  };

  // ==========================================
  // FARMER CRUD HANDLERS
  // ==========================================
  const handleOpenAddFarmerModal = () => {
    setFarmerFormMode('create');
    setEditingFarmerId(null);
    setFarmerName('');
    setFarmerPhone('');
    setFarmerCccd('');
    setFarmerCccdDate('15/05/2021');
    setFarmerCccdPlace('Cục CSQLHC về TTXH');
    setFarmerAreaSao('10');
    setFarmerVariety(selectedPlot.main_variety || 'HT1');
    setFarmerEstimatedYield('6.0');
    setShowFarmerFormModal(true);
  };

  const handleOpenEditFarmerModal = (f: Farmer) => {
    setFarmerFormMode('edit');
    setEditingFarmerId(f.id);
    setFarmerName(f.name);
    setFarmerPhone(f.phone);
    setFarmerCccd(f.cccd);
    setFarmerCccdDate(f.cccd_issue_date || '15/05/2021');
    setFarmerCccdPlace(f.cccd_issue_place || 'Công an TP Đà Nẵng');
    setFarmerAreaSao(String(f.area_sao || 10));
    setFarmerVariety(f.variety_code || selectedPlot.main_variety || 'HT1');
    setFarmerEstimatedYield(String(f.estimated_yield_ton || 6.0));
    setShowFarmerFormModal(true);
  };

  const handleSaveFarmerForm = (e: React.FormEvent) => {
    e.preventDefault();

    if (!farmerName.trim() || !farmerPhone.trim()) {
      alert('Vui lòng nhập Họ tên Chủ hộ và Số điện thoại!');
      return;
    }

    const areaSaoNum = parseFloat(farmerAreaSao) || 10;
    const estYieldNum = parseFloat(farmerEstimatedYield) || Number((areaSaoNum * 0.6).toFixed(1));

    if (farmerFormMode === 'create') {
      const newFarmer: Farmer = {
        id: 'f-' + Date.now(),
        name: farmerName.trim(),
        phone: farmerPhone.trim(),
        cccd: farmerCccd.trim() || '04809' + Math.floor(10000000 + Math.random() * 90000000),
        cccd_issue_date: farmerCccdDate,
        cccd_issue_place: farmerCccdPlace,
        field_name: selectedPlot.field_name,
        plot_no: selectedPlot.plot_no,
        plot_id: selectedPlot.id,
        area_sao: areaSaoNum,
        variety_code: farmerVariety,
        estimated_yield_ton: estYieldNum,
        harvest_status: 'harvesting'
      };

      const updatedFarmers = [...farmers, newFarmer];
      onUpdateFarmers(updatedFarmers);
    } else if (editingFarmerId) {
      const updatedFarmers = farmers.map((f) => {
        if (f.id === editingFarmerId) {
          return {
            ...f,
            name: farmerName.trim(),
            phone: farmerPhone.trim(),
            cccd: farmerCccd.trim(),
            cccd_issue_date: farmerCccdDate,
            cccd_issue_place: farmerCccdPlace,
            area_sao: areaSaoNum,
            variety_code: farmerVariety,
            estimated_yield_ton: estYieldNum
          };
        }
        return f;
      });
      onUpdateFarmers(updatedFarmers);
    }

    setShowFarmerFormModal(false);
  };

  const handleDeleteFarmerConfirm = () => {
    if (!deletingFarmer) return;
    const updatedFarmers = farmers.filter((f) => f.id !== deletingFarmer.id);
    onUpdateFarmers(updatedFarmers);
    setDeletingFarmer(null);
  };

  // ==========================================
  // BULK FARMERS IMPORT HANDLERS
  // ==========================================
  const handleFarmerFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    setImportFarmersText(text);
    const parsed = parseFarmersText(text);
    setParsedImportFarmers(parsed);
  };

  const handleFarmerTextChange = (txt: string) => {
    setImportFarmersText(txt);
    const parsed = parseFarmersText(txt);
    setParsedImportFarmers(parsed);
  };

  const handleDownloadSampleTemplate = () => {
    const csvContent = generateFarmerCSVTemplate();
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Mau_Danh_Sach_Ho_Dan_${selectedPlot.plot_no}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleConfirmImportFarmers = () => {
    if (parsedImportFarmers.length === 0) {
      alert('Chưa có danh sách hộ dân hợp lệ để nhập!');
      return;
    }

    const newFarmers: Farmer[] = parsedImportFarmers.map((pf, idx) => ({
      id: 'f-imp-' + Date.now() + '-' + idx,
      name: pf.name,
      phone: pf.phone,
      cccd: pf.cccd || '04809' + Math.floor(10000000 + Math.random() * 90000000),
      cccd_issue_date: pf.cccd_issue_date || '15/05/2021',
      cccd_issue_place: pf.cccd_issue_place || 'Công an TP Đà Nẵng',
      field_name: selectedPlot.field_name,
      plot_no: selectedPlot.plot_no,
      plot_id: selectedPlot.id,
      area_sao: pf.area_sao || 10,
      variety_code: pf.variety_code || selectedPlot.main_variety || 'HT1',
      estimated_yield_ton: pf.estimated_yield_ton || Number(((pf.area_sao || 10) * 0.6).toFixed(1)),
      harvest_status: 'harvesting'
    }));

    const updatedFarmers = [...farmers, ...newFarmers];
    onUpdateFarmers(updatedFarmers);
    setShowImportFarmersModal(false);
    setImportFarmersText('');
    setParsedImportFarmers([]);
    alert(`✅ Đã nhập thành công ${newFarmers.length} hộ sản xuất vào Vùng trồng ${selectedPlot.plot_no}!`);
  };

  const handleOpenGoogleMapsNav = (plot: FieldPlot) => {
    const lat = plot.lat || 15.9625;
    const lng = plot.lng || 108.2045;
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    window.open(googleMapsUrl, '_blank');
  };

  return (
    <div className="panel-grid-container">
      {/* Header Command Bar - Enterprise ERP Style */}
      <div className="panel-header" style={{ flexWrap: 'wrap', gap: 10 }}>
        <div className="panel-title">
          <MapPin size={20} color="#059669" />
          <span>BẢN ĐỒ VÙNG TRỒNG GIS & DANH SÁCH HỘ SẢN XUẤT (KML/KMZ INTEGRATED)</span>
        </div>
        <div className="misa-command-group">
          {currentUser.role === 'admin' && (
            <button className="misa-btn-cmd primary" onClick={handleOpenAddPlotModal}>
              <Plus size={14} /> Thêm Vùng Trồng Mới
            </button>
          )}

          <button className="misa-btn-cmd success" onClick={() => setShowKmlModal(true)}>
            <Upload size={14} /> Nhập Bản Đồ KML/KMZ
          </button>

          <button className="misa-btn-cmd primary" onClick={handleOpenAddFarmerModal}>
            <Plus size={14} /> Thêm Hộ Dân Vùng Này
          </button>

          <button className="misa-btn-cmd" onClick={() => setShowImportFarmersModal(true)}>
            <FileSpreadsheet size={14} /> Nhập Excel/CSV Hộ Dân
          </button>

          <button
            className={`misa-btn-cmd ${showPolygonOverlay ? 'success' : ''}`}
            onClick={() => setShowPolygonOverlay(!showPolygonOverlay)}
          >
            <Layers size={14} /> {showPolygonOverlay ? 'Hiển thị Ranh giới Lô' : 'Ẩn Ranh giới Lô'}
          </button>

          <button className="misa-btn-cmd" onClick={() => setShowBoundaryModal(true)}>
            <Edit2 size={14} /> Tọa độ đỉnh ({polygonPoints.length})
          </button>

          <button className="misa-btn-cmd success" onClick={() => handleOpenGoogleMapsNav(selectedPlot)}>
            <Navigation size={14} /> Google Maps Nav
          </button>
        </div>
      </div>

      {/* KPI Overview Summary */}
      <div className="kpi-row" style={{ padding: '16px 16px 0 16px' }}>
        <div className="kpi-box">
          <div className="kpi-icon green"><MapIcon size={20} /></div>
          <div>
            <div className="kpi-num" style={{ color: '#059669' }}>{plots.length} Vùng trồng</div>
            <div className="kpi-text">Tổng số vùng & lô ruộng</div>
          </div>
        </div>

        <div className="kpi-box">
          <div className="kpi-icon blue"><Users size={20} /></div>
          <div>
            <div className="kpi-num" style={{ color: '#0284c7' }}>{totalFarmersCount} Hộ dân</div>
            <div className="kpi-text">Tổng hộ sản xuất liên kết</div>
          </div>
        </div>

        <div className="kpi-box">
          <div className="kpi-icon amber"><Scale size={20} /></div>
          <div>
            <div className="kpi-num" style={{ color: '#d97706' }}>
              {totalAreaSao} Sào ({(totalAreaSao / 20).toFixed(2)} ha)
            </div>
            <div className="kpi-text">Tổng diện tích khoanh vùng</div>
          </div>
        </div>
      </div>

      {/* Main 2-Column Workspace Layout */}
      <div style={{ padding: 16, display: 'grid', gridTemplateColumns: '340px 1fr', gap: 16 }}>
        {/* LEFT COLUMN: List of Growing Zones (Field Plots) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h4 style={{ fontSize: 13, fontWeight: 700, color: '#0e1e25', display: 'flex', alignItems: 'center', gap: 6 }}>
              📍 DANH SÁCH VÙNG TRỒNG ({plots.length})
            </h4>
            {currentUser.role === 'admin' && (
              <button
                className="misa-btn-cmd primary"
                style={{ fontSize: 11, padding: '2px 8px' }}
                onClick={handleOpenAddPlotModal}
              >
                + Thêm mới
              </button>
            )}
          </div>

          {plots.map((plot) => {
            const isSelected = plot.id === selectedPlot.id;
            const count = farmers.filter(
              (f) => f.plot_id === plot.id || (f.field_name === plot.field_name && f.plot_no === plot.plot_no)
            ).length;

            return (
              <div
                key={plot.id}
                style={{
                  backgroundColor: isSelected ? '#f0f9ff' : '#ffffff',
                  border: isSelected ? '2px solid #0284c7' : '1px solid #e2e8f0',
                  borderRadius: 8,
                  padding: 12,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  position: 'relative',
                  boxShadow: isSelected ? '0 4px 12px rgba(2, 132, 199, 0.15)' : '0 1px 3px rgba(0,0,0,0.03)'
                }}
                onClick={() => setSelectedPlotId(plot.id)}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 13, fontWeight: 800, color: isSelected ? '#0369a1' : '#0e1e25' }}>
                    {plot.field_name} - {plot.plot_no}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span
                      style={{
                        backgroundColor: plot.status === 'harvesting' ? '#d1fae5' : '#fef3c7',
                        color: plot.status === 'harvesting' ? '#047857' : '#b45309',
                        fontSize: 10,
                        fontWeight: 700,
                        padding: '2px 6px',
                        borderRadius: 10
                      }}
                    >
                      {plot.status === 'harvesting' ? '🌾 Đang thu hoạch' : '⏳ Chờ thu hoạch'}
                    </span>

                    {/* Action buttons for plot edit/delete */}
                    {currentUser.role === 'admin' && (
                      <div style={{ display: 'flex', gap: 2, marginLeft: 4 }}>
                        <button
                          title="Sửa vùng trồng này"
                          style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 2, color: '#0284c7' }}
                          onClick={(e) => handleOpenEditPlotModal(plot, e)}
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          title="Xóa vùng trồng"
                          style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 2, color: '#ef4444' }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeletingPlot(plot);
                          }}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ fontSize: 11, color: '#64748b', marginBottom: 6, lineHeight: 1.4 }}>
                  📍 {plot.address || 'Hòa Tiến, Hòa Vang, Đà Nẵng'}
                </div>

                <div style={{ fontSize: 11, display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#334155' }}>
                  <span>• Giống: <strong>{plot.main_variety || 'HT1'}</strong></span>
                  <span>• Diện tích: <strong>{plot.area_total_sao || 10} sào</strong></span>
                  <span style={{ color: '#0b6bbf', fontWeight: 700 }}>{count} Hộ dân</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* RIGHT COLUMN: Google Maps & Interactive Satellite GIS View + Farmers DataGrid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Map Viewer Box */}
          <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <div style={{ padding: '10px 14px', backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#0e1e25', display: 'flex', alignItems: 'center', gap: 6 }}>
                🗺️ KHOANH VÙNG BẢN ĐỒ VỆ TINH GIS - {selectedPlot.field_name.toUpperCase()} ({selectedPlot.plot_no})
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 11, color: '#059669', fontWeight: 700 }}>
                  🟢 Diện tích khoanh vùng: {selectedPlot.area_total_sao || 22.5} sào ({( (selectedPlot.area_total_sao || 22.5) / 20).toFixed(3)} ha)
                </span>
                <button className="misa-btn-cmd primary" style={{ fontSize: 11, padding: '3px 8px' }} onClick={() => handleOpenGoogleMapsNav(selectedPlot)}>
                  <ExternalLink size={12} /> Mở Google Maps
                </button>
              </div>
            </div>

            {/* Embedded Satellite Map View */}
            <div style={{ position: 'relative', width: '100%', height: 350, backgroundColor: '#0f172a' }}>
              <iframe
                title="Google Maps Satellite Plot Boundary"
                width="100%"
                height="100%"
                frameBorder="0"
                style={{ border: 0 }}
                src={`https://maps.google.com/maps?q=${selectedPlot.lat || 15.9625},${selectedPlot.lng || 108.2045}&hl=vi&t=k&z=17&output=embed`}
                allowFullScreen
              />

              {/* Dynamic KML Boundary Graphic HUD Overlay */}
              {showPolygonOverlay && (
                <div
                  style={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    backgroundColor: 'rgba(15, 23, 42, 0.88)',
                    backdropFilter: 'blur(8px)',
                    border: '2px solid #10b981',
                    borderRadius: 10,
                    padding: 12,
                    color: 'white',
                    width: 270,
                    boxShadow: '0 8px 24px rgba(0,0,0,0.4)'
                  }}
                >
                  <div style={{ fontSize: 12, fontWeight: 800, color: '#10b981', marginBottom: 6, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Layers size={14} /> KHU VỰC KHOANH VÙNG GIS
                    </span>
                    {selectedPlot.kml_file_name && (
                      <span style={{ fontSize: 9, backgroundColor: '#059669', padding: '1px 5px', borderRadius: 4 }}>KML</span>
                    )}
                  </div>
                  <div style={{ fontSize: 11, display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <div>• Vùng / Lô: <strong>{selectedPlot.field_name} - {selectedPlot.plot_no}</strong></div>
                    <div>• Diện tích thửa: <strong>{selectedPlot.area_total_sao} sào ({( (selectedPlot.area_total_sao || 0) * 500 ).toLocaleString()} m²)</strong></div>
                    <div>• Số đỉnh GPS ranh giới: <strong>{polygonPoints.length} đỉnh</strong></div>
                    <div>• Giống lúa chủ đạo: <strong style={{ color: '#00d2d3' }}>{selectedPlot.main_variety || 'HT1'}</strong></div>
                  </div>
                </div>
              )}

              {/* Lat/Lng Center Marker Box */}
              <div
                style={{
                  position: 'absolute',
                  bottom: 12,
                  left: 12,
                  backgroundColor: 'rgba(15, 23, 42, 0.88)',
                  backdropFilter: 'blur(6px)',
                  color: 'white',
                  padding: '8px 12px',
                  borderRadius: 8,
                  fontSize: 11,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                }}
              >
                <MapPin size={22} color="#10b981" />
                <div>
                  <div style={{ fontWeight: 800, color: '#00d2d3' }}>{selectedPlot.field_name} - {selectedPlot.plot_no}</div>
                  <div style={{ fontSize: 10, color: '#cbd5e1' }}>Tọa độ tâm GPS: {selectedPlot.lat || 15.9625}, {selectedPlot.lng || 108.2045}</div>
                </div>
              </div>
            </div>
          </div>

          {/* PRODUCING HOUSEHOLDS (HỘ SẢN XUẤT) DATAGRID SECTION */}
          <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
              <h4 style={{ fontSize: 13, fontWeight: 700, color: '#0b6bbf', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Users size={16} /> DANH SÁCH HỘ SẢN XUẤT THUỘC VÙNG {selectedPlot.plot_no.toUpperCase()} ({plotFarmers.length} HỘ)
              </h4>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {/* Search input for table */}
                <div style={{ position: 'relative' }}>
                  <Search size={14} style={{ position: 'absolute', left: 8, top: 7, color: '#94a3b8' }} />
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Tìm hộ dân, SĐT, CCCD..."
                    style={{ paddingLeft: 28, height: 28, fontSize: 11, width: 180 }}
                    value={farmerSearchText}
                    onChange={(e) => setFarmerSearchText(e.target.value)}
                  />
                </div>

                <button className="misa-btn-cmd primary" style={{ fontSize: 11, padding: '3px 8px' }} onClick={handleOpenAddFarmerModal}>
                  <Plus size={12} /> Thêm Hộ Dân
                </button>
                <button className="misa-btn-cmd" style={{ fontSize: 11, padding: '3px 8px' }} onClick={() => setShowImportFarmersModal(true)}>
                  <FileSpreadsheet size={12} /> Nhập Excel
                </button>
              </div>
            </div>

            {filteredPlotFarmers.length === 0 ? (
              <div style={{ padding: 24, textAlign: 'center', color: '#94a3b8', fontSize: 12, border: '1px dashed #cbd5e1', borderRadius: 8 }}>
                Chưa có thông tin hộ sản xuất nào thuộc vùng trồng này. Nhấn nút <strong>"+ Thêm Hộ Dân"</strong> hoặc <strong>"Nhập Excel"</strong> để bổ sung bản ghi.
              </div>
            ) : (
              <table className="datagrid">
                <thead>
                  <tr>
                    <th>Họ và tên Chủ hộ</th>
                    <th>Số điện thoại</th>
                    <th>Số CCCD / Nơi cấp</th>
                    <th>Diện tích (sào)</th>
                    <th>Giống lúa</th>
                    <th>Sản lượng ước tính</th>
                    <th>Trạng thái thu hoạch</th>
                    <th style={{ textAlign: 'center' }}>Thao tác & Cân lúa</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPlotFarmers.map((f) => (
                    <tr key={f.id}>
                      <td><strong>{f.name}</strong></td>
                      <td>{f.phone}</td>
                      <td>
                        <div>{f.cccd}</div>
                        <div style={{ fontSize: 10, color: '#64748b' }}>Cấp: {f.cccd_issue_date || '15/05/2021'}</div>
                      </td>
                      <td><strong>{f.area_sao} sào</strong></td>
                      <td>
                        <span style={{ backgroundColor: '#e0f2fe', color: '#0284c7', padding: '2px 6px', borderRadius: 4, fontWeight: 700 }}>
                          {f.variety_code || selectedPlot.main_variety || 'HT1'}
                        </span>
                      </td>
                      <td><strong style={{ color: '#059669' }}>{f.estimated_yield_ton || 7.5} tấn</strong></td>
                      <td>
                        <span style={{ backgroundColor: '#d1fae5', color: '#047857', padding: '2px 8px', borderRadius: 12, fontWeight: 700, fontSize: 11 }}>
                          🌾 Đang thu hoạch
                        </span>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                          <button
                            className="misa-btn-cmd primary"
                            style={{ fontSize: 11, padding: '2px 8px' }}
                            onClick={() => onNavigateWeighing(f.id)}
                            title="Tạo phiên cân lúa cho hộ này"
                          >
                            Cân lúa <ChevronRight size={12} />
                          </button>
                          <button
                            title="Sửa hộ dân"
                            style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 2, color: '#0284c7' }}
                            onClick={() => handleOpenEditFarmerModal(f)}
                          >
                            <Edit2 size={13} />
                          </button>
                          <button
                            title="Xóa hộ dân"
                            style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 2, color: '#ef4444' }}
                            onClick={() => setDeletingFarmer(f)}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* ==========================================
          MODAL 1: PLOT FORM (ADD / EDIT VÙNG TRỒNG)
         ========================================== */}
      {showPlotFormModal && (
        <div className="modal-overlay active">
          <div className="modal-box" style={{ maxWidth: 540 }}>
            <div className="modal-header">
              <span className="modal-title">
                {plotFormMode === 'create' ? '➕ THÊM VÙNG TRỒNG / LÔ RUỘNG MỚI' : '✏️ CHỈNH SỬA THÔNG TIN VÙNG TRỒNG'}
              </span>
              <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 16 }} onClick={() => setShowPlotFormModal(false)}>✕</button>
            </div>
            <form onSubmit={handleSavePlotForm}>
              <div className="modal-body">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                  <div className="form-group">
                    <label className="form-label">Tên Xứ Đồng / Vùng Trồng *</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="VD: Xứ đồng An Trạch 1"
                      value={plotFieldName}
                      onChange={(e) => setPlotFieldName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Số Lô / Mã Vùng *</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="VD: Lô A2"
                      value={plotNo}
                      onChange={(e) => setPlotNo(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: 12 }}>
                  <label className="form-label">Địa chỉ chi tiết</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="VD: Thôn An Trạch, Xã Hòa Tiến, Huyện Hòa Vang, Đà Nẵng"
                    value={plotAddress}
                    onChange={(e) => setPlotAddress(e.target.value)}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 12 }}>
                  <div className="form-group">
                    <label className="form-label">Diện tích (sào)</label>
                    <input
                      type="number"
                      step="0.1"
                      className="form-control"
                      value={plotAreaSao}
                      onChange={(e) => setPlotAreaSao(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Giống lúa chủ đạo</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="VD: HT1, J02, HG12"
                      value={plotVariety}
                      onChange={(e) => setPlotVariety(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Trạng thái</label>
                    <select
                      className="form-control"
                      value={plotStatus}
                      onChange={(e) => setPlotStatus(e.target.value as any)}
                    >
                      <option value="harvesting">🌾 Đang thu hoạch</option>
                      <option value="waiting">⏳ Chờ thu hoạch</option>
                      <option value="completed">✅ Đã hoàn thành</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                  <div className="form-group">
                    <label className="form-label">Vĩ độ GPS Tâm (Lat)</label>
                    <input type="text" className="form-control" value={plotLat} onChange={(e) => setPlotLat(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Kinh độ GPS Tâm (Lng)</label>
                    <input type="text" className="form-control" value={plotLng} onChange={(e) => setPlotLng(e.target.value)} />
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: 12 }}>
                  <label className="form-label">Tọa độ các đỉnh ranh giới GPS (mỗi dòng: Lat, Lng)</label>
                  <textarea
                    rows={4}
                    className="form-control"
                    style={{ fontFamily: 'monospace', fontSize: 11 }}
                    placeholder={'15.9632, 108.2040\n15.9636, 108.2052\n15.9619, 108.2058'}
                    value={plotVerticesText}
                    onChange={(e) => setPlotVerticesText(e.target.value)}
                  />
                  <div style={{ fontSize: 10, color: '#64748b', marginTop: 4 }}>
                    💡 Gợi ý: Có thể dùng chức năng <strong>"Nhập Bản Đồ KML/KMZ"</strong> để tự động đọc ranh giới từ file bản đồ.
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="misa-btn-cmd" onClick={() => setShowPlotFormModal(false)}>Hủy bỏ</button>
                <button type="submit" className="misa-btn-cmd primary">
                  {plotFormMode === 'create' ? 'Tạo Vùng Trồng' : 'Lưu Thay Đổi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==========================================
          MODAL 2: KML/KMZ MAP FILE IMPORT
         ========================================== */}
      {showKmlModal && (
        <div className="modal-overlay active">
          <div className="modal-box" style={{ maxWidth: 640 }}>
            <div className="modal-header">
              <span className="modal-title">🗺️ NHẬP BẢN ĐỒ VÙNG TRỒNG BẰNG FILE .KML / .KMZ (GIS SPATIAL DATA)</span>
              <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 16 }} onClick={() => setShowKmlModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <p style={{ fontSize: 12, color: '#64748b', marginBottom: 12 }}>
                Tải lên file bản đồ định dạng <strong>.kml</strong> hoặc <strong>.kmz</strong> từ Google Earth / QGIS. Hệ thống tự động phân tích tọa độ ranh giới polygon, tính toán diện tích sào/ha và tọa độ tâm.
              </p>

              {/* Upload Input & Dropzone */}
              <div style={{ border: '2px dashed #0284c7', borderRadius: 8, padding: 20, textAlign: 'center', backgroundColor: '#f0f9ff', marginBottom: 16 }}>
                <Upload size={32} color="#0284c7" style={{ marginBottom: 8 }} />
                <div style={{ fontWeight: 700, fontSize: 13, color: '#0369a1', marginBottom: 4 }}>
                  Chọn file .KML hoặc .KMZ từ máy tính
                </div>
                <input
                  type="file"
                  accept=".kml,.kmz,text/xml"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleKmlFileUpload(f);
                  }}
                  style={{ display: 'none' }}
                  id="kml-file-input"
                />
                <label htmlFor="kml-file-input" className="misa-btn-cmd primary" style={{ cursor: 'pointer', display: 'inline-flex', marginTop: 8 }}>
                  <FileText size={14} /> Chọn File KML/KMZ
                </label>
              </div>

              {/* Direct Raw KML XML Text Input fallback */}
              <div className="form-group" style={{ marginBottom: 16 }}>
                <label className="form-label">Hoặc dán nội dung XML (.kml) trực tiếp vào đây:</label>
                <textarea
                  rows={3}
                  className="form-control"
                  style={{ fontFamily: 'monospace', fontSize: 11 }}
                  placeholder="<kml xmlns='http://www.opengis.net/kml/2.2'><Document>...<coordinates>108.204,15.963,0 108.205,15.963,0</coordinates>...</kml>"
                  value={rawKmlTextInput}
                  onChange={(e) => setRawKmlTextInput(e.target.value)}
                />
                <button type="button" className="misa-btn-cmd" style={{ fontSize: 11, marginTop: 6 }} onClick={handleParseRawKmlText}>
                  Parse Nội Dung XML
                </button>
              </div>

              {/* Parsing status / errors */}
              {isParsingKml && <div style={{ color: '#0284c7', fontSize: 12, fontWeight: 700 }}>⏳ Đang đọc và phân tích tọa độ KML/KMZ...</div>}
              {kmlFileError && <div style={{ color: '#ef4444', fontSize: 12, fontWeight: 700, marginTop: 8 }}>❌ {kmlFileError}</div>}

              {/* Parsed Result Visual Preview */}
              {kmlParseResult && (
                <div style={{ backgroundColor: '#f8fafc', border: '1px solid #10b981', borderRadius: 8, padding: 14, marginTop: 12 }}>
                  <div style={{ fontWeight: 800, color: '#047857', fontSize: 13, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <CheckCircle size={16} /> ĐÃ ĐỌC THÀNH CÔNG DỮ LIỆU KML BAN BẢN ĐỒ!
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, fontSize: 11, marginBottom: 12 }}>
                    <div>• Tên vùng trích xuất: <strong>{kmlParseResult.title}</strong></div>
                    <div>• Số đỉnh ranh giới GPS: <strong>{kmlParseResult.polygonCoords.length} đỉnh</strong></div>
                    <div>• Tọa độ trung tâm: <strong>{kmlParseResult.centerLat}, {kmlParseResult.centerLng}</strong></div>
                    <div>• Diện tích mét vuông: <strong>{kmlParseResult.areaM2.toLocaleString()} m²</strong></div>
                    <div>• Quy đổi sào Trung/Nam Bộ: <strong style={{ color: '#059669', fontSize: 12 }}>{kmlParseResult.areaSao} sào</strong></div>
                    <div>• Quy đổi Hécta: <strong>{kmlParseResult.areaHa} ha</strong></div>
                  </div>

                  {/* Target Mode Choice */}
                  <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: 10 }}>
                    <label className="form-label" style={{ fontWeight: 700 }}>Tùy chọn nạp vào hệ thống:</label>
                    <div style={{ display: 'flex', gap: 16, fontSize: 12, marginTop: 4 }}>
                      <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                        <input
                          type="radio"
                          name="kmlMode"
                          checked={kmlImportTargetMode === 'new_plot'}
                          onChange={() => setKmlImportTargetMode('new_plot')}
                        />
                        Tạo Vùng Trồng Mới từ KML
                      </label>
                      <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                        <input
                          type="radio"
                          name="kmlMode"
                          checked={kmlImportTargetMode === 'update_current'}
                          onChange={() => setKmlImportTargetMode('update_current')}
                        />
                        Cập nhật ranh giới Lô đang chọn ({selectedPlot.plot_no})
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button type="button" className="misa-btn-cmd" onClick={() => setShowKmlModal(false)}>Đóng</button>
              {kmlParseResult && (
                <button type="button" className="misa-btn-cmd primary" onClick={handleConfirmKmlImport}>
                  <CheckCircle size={14} /> Xác Nhận Nạp Bản Đồ Vùng Trồng
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          MODAL 3: FARMER FORM (ADD / EDIT HỘ DÂN)
         ========================================== */}
      {showFarmerFormModal && (
        <div className="modal-overlay active">
          <div className="modal-box" style={{ maxWidth: 520 }}>
            <div className="modal-header">
              <span className="modal-title">
                {farmerFormMode === 'create'
                  ? `➕ THÊM HỘ SẢN XUẤT VÀO ${selectedPlot.field_name.toUpperCase()} (${selectedPlot.plot_no})`
                  : '✏️ CHỈNH SỬA THÔNG TIN HỘ SẢN XUẤT'}
              </span>
              <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 16 }} onClick={() => setShowFarmerFormModal(false)}>✕</button>
            </div>
            <form onSubmit={handleSaveFarmerForm}>
              <div className="modal-body">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                  <div className="form-group">
                    <label className="form-label">Họ và tên Chủ hộ *</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="VD: Nguyễn Văn Bình"
                      value={farmerName}
                      onChange={(e) => setFarmerName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Số điện thoại *</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="VD: 0914123456"
                      value={farmerPhone}
                      onChange={(e) => setFarmerPhone(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 12 }}>
                  <div className="form-group">
                    <label className="form-label">Số CCCD</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="VD: 048092001234"
                      value={farmerCccd}
                      onChange={(e) => setFarmerCccd(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Ngày cấp</label>
                    <input type="text" className="form-control" value={farmerCccdDate} onChange={(e) => setFarmerCccdDate(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Nơi cấp</label>
                    <input type="text" className="form-control" value={farmerCccdPlace} onChange={(e) => setFarmerCccdPlace(e.target.value)} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 12 }}>
                  <div className="form-group">
                    <label className="form-label">Diện tích (sào)</label>
                    <input
                      type="number"
                      step="0.5"
                      className="form-control"
                      value={farmerAreaSao}
                      onChange={(e) => {
                        setFarmerAreaSao(e.target.value);
                        const s = parseFloat(e.target.value) || 0;
                        setFarmerEstimatedYield(String(Number((s * 0.6).toFixed(1))));
                      }}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Giống lúa</label>
                    <input
                      type="text"
                      className="form-control"
                      value={farmerVariety}
                      onChange={(e) => setFarmerVariety(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Sản lượng dự kiến (tấn)</label>
                    <input
                      type="number"
                      step="0.1"
                      className="form-control"
                      value={farmerEstimatedYield}
                      onChange={(e) => setFarmerEstimatedYield(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="misa-btn-cmd" onClick={() => setShowFarmerFormModal(false)}>Hủy bỏ</button>
                <button type="submit" className="misa-btn-cmd primary">
                  {farmerFormMode === 'create' ? 'Lưu Hộ Sản Xuất' : 'Lưu Thay Đổi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==========================================
          MODAL 4: BULK FARMERS EXCEL / CSV IMPORT
         ========================================== */}
      {showImportFarmersModal && (
        <div className="modal-overlay active">
          <div className="modal-box" style={{ maxWidth: 680 }}>
            <div className="modal-header">
              <span className="modal-title">📥 NHẬP DANH SÁCH HỘ SẢN XUẤT HÀNG LOẠT BẰNG FILE EXCEL/CSV</span>
              <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 16 }} onClick={() => setShowImportFarmersModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ fontSize: 12, color: '#64748b' }}>
                  Vùng trồng mục tiêu: <strong>{selectedPlot.field_name} - {selectedPlot.plot_no}</strong>
                </span>
                <button className="misa-btn-cmd" style={{ fontSize: 11 }} onClick={handleDownloadSampleTemplate}>
                  <Download size={12} /> Tải File CSV Mẫu
                </button>
              </div>

              {/* Upload input */}
              <div style={{ border: '1px dashed #0b6bbf', padding: 12, borderRadius: 8, backgroundColor: '#f0f9ff', marginBottom: 12 }}>
                <label htmlFor="farmer-csv-input" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, fontWeight: 700, color: '#0b6bbf' }}>
                  <FileSpreadsheet size={16} /> Chọn File CSV / Excel (.csv, .txt):
                </label>
                <input
                  id="farmer-csv-input"
                  type="file"
                  accept=".csv,.txt"
                  onChange={handleFarmerFileSelect}
                  style={{ fontSize: 11, marginTop: 6 }}
                />
              </div>

              {/* Textarea Paste */}
              <div className="form-group" style={{ marginBottom: 12 }}>
                <label className="form-label">Hoặc dán trực tiếp danh sách (Copy từ Excel):</label>
                <textarea
                  rows={4}
                  className="form-control"
                  style={{ fontFamily: 'monospace', fontSize: 11 }}
                  placeholder="Họ và tên,SĐT,CCCD,Diện tích sào,Giống lúa,Sản lượng tấn&#10;Nguyễn Văn An,0914123456,048092001234,12.5,HT1,7.5"
                  value={importFarmersText}
                  onChange={(e) => handleFarmerTextChange(e.target.value)}
                />
              </div>

              {/* Parsed Preview Table */}
              {parsedImportFarmers.length > 0 && (
                <div style={{ border: '1px solid #10b981', borderRadius: 8, padding: 10, backgroundColor: '#f8fafc' }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#047857', marginBottom: 8 }}>
                    ✅ Đã nhận diện {parsedImportFarmers.length} hộ dân hợp lệ từ dữ liệu:
                  </div>
                  <div style={{ maxHeight: 160, overflowY: 'auto' }}>
                    <table className="datagrid" style={{ fontSize: 11 }}>
                      <thead>
                        <tr>
                          <th>Chủ hộ</th>
                          <th>SĐT</th>
                          <th>CCCD</th>
                          <th>Diện tích (sào)</th>
                          <th>Giống lúa</th>
                          <th>Sản lượng</th>
                        </tr>
                      </thead>
                      <tbody>
                        {parsedImportFarmers.map((pf, i) => (
                          <tr key={i}>
                            <td>{pf.name}</td>
                            <td>{pf.phone}</td>
                            <td>{pf.cccd}</td>
                            <td>{pf.area_sao} sào</td>
                            <td>{pf.variety_code}</td>
                            <td>{pf.estimated_yield_ton} tấn</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button type="button" className="misa-btn-cmd" onClick={() => setShowImportFarmersModal(false)}>Hủy bỏ</button>
              {parsedImportFarmers.length > 0 && (
                <button type="button" className="misa-btn-cmd primary" onClick={handleConfirmImportFarmers}>
                  <CheckCircle size={14} /> Nạp {parsedImportFarmers.length} Hộ Dân Vào Vùng
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          MODAL 5: CONFIRM DELETE PLOT
         ========================================== */}
      {deletingPlot && (
        <div className="modal-overlay active">
          <div className="modal-box" style={{ maxWidth: 420 }}>
            <div className="modal-header">
              <span className="modal-title" style={{ color: '#ef4444' }}>⚠️ XÁC NHẬN XÓA VÙNG TRỒNG</span>
              <button style={{ background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => setDeletingPlot(null)}>✕</button>
            </div>
            <div className="modal-body">
              <p style={{ fontSize: 13, color: '#1e293b' }}>
                Bạn có chắc chắn muốn xóa Vùng trồng <strong>{deletingPlot.field_name} ({deletingPlot.plot_no})</strong> khỏi hệ thống?
              </p>
              <p style={{ fontSize: 11, color: '#ef4444', marginTop: 8 }}>
                Lưu ý: Thao tác này không thể hoàn tác.
              </p>
            </div>
            <div className="modal-footer">
              <button className="misa-btn-cmd" onClick={() => setDeletingPlot(null)}>Hủy bỏ</button>
              <button className="misa-btn-cmd danger" onClick={handleDeletePlotConfirm}>Xóa Vùng Trồng</button>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          MODAL 6: CONFIRM DELETE FARMER
         ========================================== */}
      {deletingFarmer && (
        <div className="modal-overlay active">
          <div className="modal-box" style={{ maxWidth: 420 }}>
            <div className="modal-header">
              <span className="modal-title" style={{ color: '#ef4444' }}>⚠️ XÁC NHẬN XÓA HỘ SẢN XUẤT</span>
              <button style={{ background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => setDeletingFarmer(null)}>✕</button>
            </div>
            <div className="modal-body">
              <p style={{ fontSize: 13, color: '#1e293b' }}>
                Bạn có chắc chắn muốn xóa thông tin hộ sản xuất <strong>{deletingFarmer.name}</strong> ({deletingFarmer.phone}) khỏi vùng trồng này?
              </p>
            </div>
            <div className="modal-footer">
              <button className="misa-btn-cmd" onClick={() => setDeletingFarmer(null)}>Hủy bỏ</button>
              <button className="misa-btn-cmd danger" onClick={handleDeleteFarmerConfirm}>Xóa Hộ Dân</button>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          MODAL 7: BOUNDARY VERTICES LIST VIEW
         ========================================== */}
      {showBoundaryModal && (
        <div className="modal-overlay active">
          <div className="modal-box" style={{ maxWidth: 540 }}>
            <div className="modal-header">
              <span className="modal-title">📐 DANH SÁCH TỌA ĐỘ ĐỈNH RANH GIỚI KHOANH VÙNG ({selectedPlot.plot_no})</span>
              <button style={{ background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => setShowBoundaryModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <p style={{ fontSize: 12, color: '#64748b', marginBottom: 10 }}>
                Tọa độ GPS các điểm ghim cấu thành đường ranh giới khoanh vùng thửa đất / lô ruộng:
              </p>
              <table className="datagrid" style={{ marginBottom: 12 }}>
                <thead>
                  <tr>
                    <th style={{ width: 50, textAlign: 'center' }}>Đỉnh</th>
                    <th>Vĩ độ GPS (Lat)</th>
                    <th>Kinh độ GPS (Lng)</th>
                  </tr>
                </thead>
                <tbody>
                  {polygonPoints.map((pt, idx) => (
                    <tr key={idx}>
                      <td style={{ textAlign: 'center', fontWeight: 700 }}>P{idx + 1}</td>
                      <td>{pt.lat}</td>
                      <td>{pt.lng}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="modal-footer">
              <button className="misa-btn-cmd primary" onClick={() => setShowBoundaryModal(false)}>Đóng</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
