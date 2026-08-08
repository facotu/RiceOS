import React, { useState } from 'react';
import { Camera, Play, Video, Scan, CheckCircle, RefreshCw } from 'lucide-react';

export const AICameraView: React.FC = () => {
  const [count, setCount] = useState(142);
  const [isRunning, setIsRunning] = useState(true);

  const handleSimulateCount = () => {
    setCount(prev => prev + 2);
  };

  return (
    <div class="panel-grid-container">
      <div class="panel-header">
        <div class="panel-title">
          <Camera size={20} color="#8b5cf6" />
          <span>MODULE AI CAMERA - ĐẾM BAO LÚA TỰ ĐỘNG & OCR BIỂN SỐ XE</span>
        </div>
        <button class="misa-btn-cmd primary" onClick={handleSimulateCount}>
          <Play size={14} /> Thử nghiệm AI đếm bao (+2)
        </button>
      </div>

      <div style={{ padding: 20, display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
        <div style={{
          backgroundColor: '#0f172a',
          borderRadius: 12,
          height: 360,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: 12,
            left: 12,
            background: 'rgba(0,0,0,0.7)',
            color: '#00d2d3',
            padding: '6px 12px',
            borderRadius: 6,
            fontSize: 11,
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: 6
          }}>
            <Video size={14} color="#ef4444" /> LIVE STREAM: AI CAMERA CẦU CÂN #1 (ONLINE)
          </div>

          {/* AI Bounding Box Overlay */}
          <div style={{
            position: 'absolute',
            border: '2px dashed #00d2d3',
            width: 150,
            height: 95,
            top: 120,
            left: 180,
            borderRadius: 6,
            display: 'flex',
            alignItems: 'flex-start',
            padding: 4,
            color: '#00d2d3',
            fontWeight: 800,
            fontSize: 11,
            background: 'rgba(0,210,211,0.15)'
          }}>
            Bao lúa #{count} [98.6%]
          </div>

          <div style={{ textAlign: 'center', color: '#94a3b8' }}>
            <Scan size={54} color="#475569" style={{ margin: '0 auto 12px auto' }} />
            <div>Camera AI đang hoạt động phát hiện tự động bao lúa qua băng chuyền...</div>
          </div>
        </div>

        <div style={{
          backgroundColor: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: 12,
          padding: 16
        }}>
          <h4 style={{ fontSize: 13, fontWeight: 700, color: '#0e1e25', marginBottom: 12 }}>
            📊 KẾT QUẢ AI RECOGNITION TỰ ĐỘNG
          </h4>
          <div style={{ fontSize: 12, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div>
              Đếm bao tự động: <br />
              <strong style={{ fontSize: 22, color: '#10b981' }}>{count} bao lúa</strong>
            </div>
            <div>
              Nhận diện biển số xe nhận: <br />
              <strong style={{ color: '#0b6bbf', fontSize: 14 }}>43C-123.45 (Độ chính xác 99.1%)</strong>
            </div>
            <div>
              Tốc độ qua cầu: <strong>1.2 bao / giây</strong>
            </div>
            <div>
              Nhận diện OCR CCCD Chủ lúa: <br />
              <span style={{ color: '#059669', fontWeight: 600 }}>Tự động điền Nguyễn Văn Bình - 048092001234</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
