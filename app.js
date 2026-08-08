/* ==========================================================================
   RICEOS ENTERPRISE ERP - APPLICATION INTERACTIVE LOGIC (MISA AMIS STYLE)
   ========================================================================== */

// Mock Data State
const state = {
  activeTab: 'dashboard',
  ricePrices: {
    'HT1': 8000,
    'HG12': 7500,
    'HG244': 7800,
    'ĐT100': 8200,
    'J02': 8500
  },
  tarePerBagKg: 1.2,
  
  // Current Live Session Weight Entries
  currentWeighingRows: [
    { id: 1, time: '11:05', bags: 10, freshKg: 500 },
    { id: 2, time: '11:10', bags: 12, freshKg: 600 },
    { id: 3, time: '11:15', bags: 10, freshKg: 500 }
  ],
  
  // Recent Master Sessions List
  recentSessions: [
    { code: 'PC-2026-088', time: '11:15 Today', farmer: 'Nguyễn Văn Bình', field: 'An Trạch 1 - Lô A2', variety: 'HT1', bags: 140, freshKg: 7000, dryKg: 6832, totalAmount: 54656000, officer: 'Đoàn Thị Ngọc Phương', vehicle: '43C-123.45', status: 'Đã hoàn thành' },
    { code: 'PC-2026-087', time: '10:40 Today', farmer: 'Trần Văn Cường', field: 'Hòa Tiến - Lô B', variety: 'J02', bags: 210, freshKg: 10500, dryKg: 10248, totalAmount: 87108000, officer: 'Đoàn Thị Ngọc Phương', vehicle: '92H-987.65', status: 'Đã hoàn thành' },
    { code: 'PC-2026-086', time: '09:50 Today', farmer: 'Lê Thị Mai', field: 'Đa Phước 3 - Lô C', variety: 'HG12', bags: 180, freshKg: 9000, dryKg: 8784, totalAmount: 65880000, officer: 'Trần Văn Nam', vehicle: '43C-123.45', status: 'Đã hoàn thành' },
    { code: 'PC-2026-085', time: '09:10 Today', farmer: 'Phạm Văn Hùng', field: 'An Trạch 2 - Lô D', variety: 'ĐT100', bags: 150, freshKg: 7500, dryKg: 7320, totalAmount: 60024000, officer: 'Trần Văn Nam', vehicle: '92H-987.65', status: 'Đã hoàn thành' },
    { code: 'PC-2026-084', time: '08:20 Today', farmer: 'Vũ Thị Hoa', field: 'Hòa Tiến - Lô A1', variety: 'HG244', bags: 130, freshKg: 6500, dryKg: 6344, totalAmount: 49483200, officer: 'Đoàn Thị Ngọc Phương', vehicle: '43C-123.45', status: 'Đã hoàn thành' }
  ]
};

// Initialize Application on Load
document.addEventListener('DOMContentLoaded', () => {
  renderDashboardGrid();
  renderWeighingTable();
});

// Tab Switcher
function switchTab(tabId) {
  state.activeTab = tabId;
  
  // Hide all tabs
  document.querySelectorAll('.tab-view').forEach(view => {
    view.style.display = 'none';
    view.classList.remove('active');
  });
  
  // Remove active class from nav items
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.remove('active');
  });
  
  // Show target view
  const targetView = document.getElementById(`view-${tabId}`);
  if (targetView) {
    targetView.style.display = 'block';
    targetView.classList.add('active');
  }
  
  // Highlight active sidebar item
  const activeNav = document.getElementById(`nav-${tabId}`);
  if (activeNav) {
    activeNav.classList.add('active');
  }
  
  // Update Breadcrumb Path
  updateBreadcrumb(tabId);
}

// Toggle Sidebar Collapse
function toggleSidebar() {
  const sidebar = document.getElementById('appSidebar');
  sidebar.classList.toggle('collapsed');
}

// Update Breadcrumb Text
function updateBreadcrumb(tabId) {
  const breadcrumb = document.getElementById('breadcrumbPath');
  const titles = {
    'dashboard': 'Phân hệ Tổng quan Dashboard (MISA AMIS ERP)',
    'weighing': 'Nghiệp vụ Thu mua > Cân Lúa Tươi Thực Địa (Phiên Cân)',
    'settlement': 'Tài chính > Quyết Toán Tiền Lúa Hộ Dân',
    'vehicles': 'Vận tải > Quản lý Xe Nhận & Tải Trọng Cầu Cân',
    'history': 'Tra cứu > Lịch sử Phiên Cân Đa Tiêu Chí',
    'reports': 'Báo cáo > Phân tích Sản lượng & Doanh thu Thu mua',
    'aicamera': 'Công nghệ AI > Module Camera Đếm Bao & OCR Biển Số',
    'settings': 'Hệ thống > Cài đặt Đơn giá & Định mức Trừ bì'
  };
  
  breadcrumb.innerHTML = `<span>RiceOS Enterprise</span> <i class="ph ph-caret-right"></i> <strong>${titles[tabId] || 'Phân hệ Quản trị'}</strong>`;
}

// Render Dashboard DataGrid
function renderDashboardGrid() {
  const tbody = document.getElementById('dashboardGridBody');
  if (!tbody) return;
  
  tbody.innerHTML = state.recentSessions.map(s => `
    <tr>
      <td><strong style="color: #0b6bbf;">${s.code}</strong></td>
      <td>${s.time}</td>
      <td><strong>${s.farmer}</strong></td>
      <td>${s.field}</td>
      <td><span style="background: #e0f2fe; color: #0284c7; padding: 2px 6px; border-radius: 4px; font-weight: 700;">${s.variety}</span></td>
      <td>${s.bags} bao</td>
      <td>${s.freshKg.toLocaleString()} kg</td>
      <td><strong style="color: #0284c7;">${s.dryKg.toLocaleString()} kg</strong></td>
      <td><strong style="color: #059669;">${s.totalAmount.toLocaleString()} đ</strong></td>
      <td>${s.officer}</td>
      <td>${s.vehicle}</td>
      <td><span style="background: #d1fae5; color: #047857; padding: 2px 8px; border-radius: 12px; font-weight: 600; font-size: 11px;">${s.status}</span></td>
    </tr>
  `).join('');
}

// Render Live Weighing Table
function renderWeighingTable() {
  const tbody = document.getElementById('weighingTableBody');
  if (!tbody) return;
  
  const selectedVariety = document.getElementById('selectRiceVariety')?.value || 'HT1';
  const unitPrice = state.ricePrices[selectedVariety] || 8000;
  
  tbody.innerHTML = state.currentWeighingRows.map((r, index) => {
    const tareKg = r.bags * state.tarePerBagKg;
    const dryKg = Math.max(0, r.freshKg - tareKg);
    const amount = dryKg * unitPrice;
    
    return `
      <tr>
        <td style="text-align: center; font-weight: 700;">${index + 1}</td>
        <td>${r.time}</td>
        <td>
          <input type="number" class="form-control" value="${r.bags}" onchange="updateWeighingRow(${r.id}, 'bags', this.value)" style="width: 80px; text-align: center; font-weight: 700;">
        </td>
        <td>
          <input type="number" class="form-control" value="${r.freshKg}" onchange="updateWeighingRow(${r.id}, 'freshKg', this.value)" style="width: 120px; font-weight: 700; color: #0284c7;">
        </td>
        <td style="color: #64748b;">${tareKg.toFixed(1)} kg</td>
        <td><strong style="color: #059669;">${dryKg.toFixed(1)} kg</strong></td>
        <td>${unitPrice.toLocaleString()} đ</td>
        <td><strong style="color: #d97706;">${amount.toLocaleString()} đ</strong></td>
        <td style="text-align: center;">
          <button style="background: none; border: none; color: #ef4444; cursor: pointer;" onclick="deleteWeighingRow(${r.id})" title="Xóa mã cân">
            <i class="ph ph-trash" style="font-size: 16px;"></i>
          </button>
        </td>
      </tr>
    `;
  }).join('');
  
  calculateSessionTotals();
}

// Update Weighing Row State
function updateWeighingRow(id, field, value) {
  const row = state.currentWeighingRows.find(r => r.id === id);
  if (row) {
    row[field] = parseFloat(value) || 0;
    renderWeighingTable();
  }
}

// Add New Weight Entry Row
function addWeighingRow() {
  const newId = Date.now();
  const now = new Date();
  const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  
  state.currentWeighingRows.push({
    id: newId,
    time: timeStr,
    bags: 10,
    freshKg: 500
  });
  
  renderWeighingTable();
}

// Delete Weight Entry Row
function deleteWeighingRow(id) {
  state.currentWeighingRows = state.currentWeighingRows.filter(r => r.id !== id);
  renderWeighingTable();
}

// Calculate Session Totals
function calculateSessionTotals() {
  const selectedVariety = document.getElementById('selectRiceVariety')?.value || 'HT1';
  const unitPrice = state.ricePrices[selectedVariety] || 8000;
  
  let totalBags = 0;
  let totalFresh = 0;
  let totalTare = 0;
  
  state.currentWeighingRows.forEach(r => {
    totalBags += r.bags;
    totalFresh += r.freshKg;
    totalTare += r.bags * state.tarePerBagKg;
  });
  
  const totalDry = Math.max(0, totalFresh - totalTare);
  const totalAmount = totalDry * unitPrice;
  
  document.getElementById('lblTotalBags').innerText = totalBags.toLocaleString();
  document.getElementById('lblTotalFresh').innerText = totalFresh.toLocaleString();
  document.getElementById('lblTotalTare').innerText = totalTare.toFixed(1);
  document.getElementById('lblTotalDry').innerText = `${totalDry.toLocaleString()} kg Khô`;
  document.getElementById('lblTotalAmount').innerText = `${totalAmount.toLocaleString()} đ`;
}

// Save Weighing Session
function saveWeighingSession() {
  alert('✅ Đã ghi nhập thành công Phiên cân lúa! Số liệu đã được đưa vào hệ thống báo cáo & tài chính.');
  switchTab('dashboard');
}

// Refresh Data Trigger
function refreshData() {
  renderDashboardGrid();
  renderWeighingTable();
  alert('🔄 Đã nạp lại dữ liệu thu mua thời gian thực mới nhất!');
}

// Modal Handlers
function openZaloExportModal() {
  const modal = document.getElementById('modalZalo');
  if (modal) modal.classList.add('active');
}

function printTicket() {
  const modal = document.getElementById('modalPrintTicket');
  if (modal) modal.classList.add('active');
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove('active');
}

function copyZaloText() {
  const txt = document.getElementById('txtZaloMessage');
  txt.select();
  document.execCommand('copy');
  alert('📋 Đã sao chép nội dung tin nhắn Zalo vào bộ nhớ tạm!');
}

function openZaloApp() {
  alert('🚀 Đã mở ứng dụng Zalo để gửi trực tiếp thông tin cho chủ lúa!');
  closeModal('modalZalo');
}

// AI Camera Simulation Handler
let aiSimCount = 142;
function toggleAICameraSim() {
  aiSimCount += 2;
  document.getElementById('lblAICount').innerText = `${aiSimCount} bao`;
  const box = document.getElementById('aiBoundingBox');
  if (box) {
    box.style.left = (Math.random() * 100 + 100) + 'px';
  }
}
