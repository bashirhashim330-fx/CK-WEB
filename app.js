/**
 * ============================================================================
 * CK CAPITAL — CLIENT-SIDE STATE ENGINE & TRADER CONTROL ROOM CONTROLLER
 * Complete Vanilla JavaScript implementation.
 * Zero external frameworks. Full LocalStorage persistence & precision math.
 * ============================================================================
 */

(function () {
  'use strict';

  // ==========================================================================
  // 1. DATA LAYER & LOCALSTORAGE PERSISTENCE ENGINE
  // ==========================================================================
  const STORAGE_KEY = 'CK_CAPITAL_V1_STATE';

  const DEFAULT_INITIAL_STATE = {
    theme: 'dark',
    session: {
      isLoggedIn: true,
      user: {
        firstName: 'Marcus',
        lastName: 'Kramer',
        email: 'trader@ckcapital.com',
        country: 'United Kingdom',
        memberSince: 'January 2026',
        isVerified: true
      }
    },
    accounts: [
      {
        id: 'CK-10000',
        model: '2step',
        platform: 'TradeLocker',
        preference: 'Standard',
        size: 10000,
        balance: 10428.60,
        equity: 10391.20,
        startingBalance: 10000,
        status: 'ACTIVE // PHASE 1',
        step: 1,
        target: 500,
        dailyLossLimit: 200,
        maxLossLimit: 400,
        createdDate: '2026-08-28'
      },
      {
        id: 'CK-25000',
        model: '2step',
        platform: 'MT5',
        preference: 'Pro',
        size: 25000,
        balance: 25831.40,
        equity: 25831.40,
        startingBalance: 25000,
        status: 'ACTIVE // PHASE 2',
        step: 2,
        target: 625,
        dailyLossLimit: 500,
        maxLossLimit: 1000,
        createdDate: '2026-08-10'
      },
      {
        id: 'CK-100000',
        model: 'instant',
        platform: 'TradeLocker',
        preference: 'Standard',
        size: 100000,
        balance: 103450.00,
        equity: 103450.00,
        startingBalance: 100000,
        status: 'QUALIFIED ANALYST',
        step: 3,
        target: 0,
        dailyLossLimit: 3000,
        maxLossLimit: 5000,
        createdDate: '2026-07-15'
      }
    ],
    selectedAccountId: 'CK-10000',
    trades: [
      { id: 'TRD-901', accountId: 'CK-10000', symbol: 'XAUUSD', direction: 'BUY', lots: 0.50, entry: 2514.20, exit: 2522.60, pnl: 420.00, duration: '4h 12m', date: '2026-09-04', status: 'CLOSED' },
      { id: 'TRD-902', accountId: 'CK-10000', symbol: 'EURUSD', direction: 'SELL', lots: 1.00, entry: 1.0845, exit: 1.0872, pnl: -27.00, duration: '1h 05m', date: '2026-09-04', status: 'CLOSED' },
      { id: 'TRD-903', accountId: 'CK-10000', symbol: 'GBPUSD', direction: 'BUY', lots: 0.75, entry: 1.2980, exit: 1.3005, pnl: 187.50, duration: '2h 40m', date: '2026-09-03', status: 'CLOSED' },
      { id: 'TRD-904', accountId: 'CK-10000', symbol: 'USDCAD', direction: 'SELL', lots: 1.20, entry: 1.3520, exit: 1.3545, pnl: -30.00, duration: '35m', date: '2026-09-03', status: 'CLOSED' },
      { id: 'TRD-905', accountId: 'CK-10000', symbol: 'USDJPY', direction: 'BUY', lots: 0.80, entry: 144.10, exit: 144.75, pnl: 52.00, duration: '6h 15m', date: '2026-09-02', status: 'CLOSED' },
      { id: 'TRD-906', accountId: 'CK-10000', symbol: 'XAUUSD', direction: 'SELL', lots: 0.40, entry: 2530.00, exit: 2534.50, pnl: -180.00, duration: '50m', date: '2026-09-01', status: 'CLOSED' },
      { id: 'TRD-907', accountId: 'CK-10000', symbol: 'EURUSD', direction: 'BUY', lots: 1.50, entry: 1.0810, exit: 1.0835, pnl: 37.50, duration: '1h 30m', date: '2026-09-01', status: 'CLOSED' },
      { id: 'TRD-908', accountId: 'CK-10000', symbol: 'XAUUSD', direction: 'BUY', lots: 0.30, entry: 2498.00, exit: 2505.50, pnl: 225.00, duration: '3h 10m', date: '2026-08-30', status: 'CLOSED' },
      { id: 'TRD-909', accountId: 'CK-10000', symbol: 'GBPUSD', direction: 'SELL', lots: 0.80, entry: 1.3050, exit: 1.3020, pnl: 24.00, duration: '4h 00m', date: '2026-08-29', status: 'CLOSED' }
    ],
    notifications: [
      { id: 'N1', title: 'Risk Health Status: All Clear', time: '10m ago', read: false },
      { id: 'N2', title: 'Daily loss calculation reset (00:00 UTC)', time: '3h ago', read: false },
      { id: 'N3', title: 'Approaching Phase 1 Target: 85.7%', time: '1d ago', read: true }
    ],
    payouts: [
      { id: 'PO-7701', date: '2026-08-15', amountGross: 1200.00, amountTrader: 960.00, method: 'USDT (TRC20)', status: 'PAID' }
    ],
    tickets: [
      { id: 'TCK-401', subject: 'TradeLocker TradingView Indicator Load', category: 'Platform Technical', status: 'RESOLVED', date: '2026-08-24' }
    ],
    cart: {
      model: '2step',
      platform: 'TradeLocker',
      preference: 'Standard',
      size: 10000,
      promoCode: 'CONSISTENCY',
      discountPct: 0.15
    }
  };

  function loadState() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : DEFAULT_INITIAL_STATE;
    } catch (e) {
      console.warn('LocalStorage unavailable, fallback to session memory:', e);
      return DEFAULT_INITIAL_STATE;
    }
  }

  function saveState(state) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Failed to commit state to LocalStorage:', e);
    }
  }

  let appState = loadState();

  // Apply Theme on Boot
  document.body.setAttribute('data-theme', appState.theme || 'dark');

  // ==========================================================================
  // 2. CHALLENGE SPECIFICATION PRICING MATRIX
  // ==========================================================================
  const CHALLENGE_MATRIX = {
    '2step': {
      label: '2-Step Evaluation',
      sizes: [
        { size: 5000, price: 32, target1: 250, target2: 125, dailyLoss: 100, maxLoss: 200 },
        { size: 10000, price: 53, target1: 500, target2: 250, dailyLoss: 200, maxLoss: 400 },
        { size: 25000, price: 119, target1: 1250, target2: 625, dailyLoss: 500, maxLoss: 1000 },
        { size: 50000, price: 199, target1: 2500, target2: 1250, dailyLoss: 1000, maxLoss: 2000 },
        { size: 100000, price: 349, target1: 5000, target2: 2500, dailyLoss: 2000, maxLoss: 4000 },
        { size: 200000, price: 689, target1: 10000, target2: 5000, dailyLoss: 4000, maxLoss: 8000 }
      ]
    },
    '1step': {
      label: '1-Step Fast Track',
      sizes: [
        { size: 5000, price: 44, target1: 400, target2: 0, dailyLoss: 150, maxLoss: 300 },
        { size: 10000, price: 79, target1: 800, target2: 0, dailyLoss: 300, maxLoss: 600 },
        { size: 25000, price: 165, target1: 2000, target2: 0, dailyLoss: 750, maxLoss: 1500 },
        { size: 50000, price: 279, target1: 4000, target2: 0, dailyLoss: 1500, maxLoss: 3000 },
        { size: 100000, price: 489, target1: 8000, target2: 0, dailyLoss: 3000, maxLoss: 6000 },
        { size: 200000, price: 949, target1: 16000, target2: 0, dailyLoss: 6000, maxLoss: 12000 }
      ]
    },
    'instant': {
      label: 'Instant Capital',
      sizes: [
        { size: 5000, price: 69, target1: 0, target2: 0, dailyLoss: 150, maxLoss: 250 },
        { size: 10000, price: 108, target1: 0, target2: 0, dailyLoss: 300, maxLoss: 500 },
        { size: 25000, price: 249, target1: 0, target2: 0, dailyLoss: 750, maxLoss: 1250 },
        { size: 50000, price: 469, target1: 0, target2: 0, dailyLoss: 1500, maxLoss: 2500 },
        { size: 100000, price: 899, target1: 0, target2: 0, dailyLoss: 3000, maxLoss: 5000 },
        { size: 200000, price: 1749, target1: 0, target2: 0, dailyLoss: 6000, maxLoss: 10000 }
      ]
    }
  };

  // ==========================================================================
  // 3. TOAST NOTIFICATION DISPATCHER
  // ==========================================================================
  function showToast(message) {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = 'toast font-mono';
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  // ==========================================================================
  // 4. VIEW ROUTER (SPA LOGIC)
  // ==========================================================================
  const views = {
    public: document.getElementById('public-view'),
    auth: document.getElementById('auth-view'),
    checkout: document.getElementById('checkout-view'),
    dashboard: document.getElementById('dashboard-view')
  };

  function switchView(viewName) {
    Object.keys(views).forEach(k => {
      if (views[k]) views[k].classList.remove('active');
    });

    if (views[viewName]) {
      views[viewName].classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    const header = document.getElementById('header');
    const promo = document.getElementById('promo-banner');
    if (viewName === 'dashboard') {
      if (header) header.style.display = 'none';
      if (promo) promo.style.display = 'none';
      renderDashboard();
    } else {
      if (header) header.style.display = 'block';
      if (promo) promo.style.display = document.body.classList.contains('promo-dismissed') ? 'none' : 'block';
    }
  }

  // ==========================================================================
  // 5. TERMINAL CALCULATION & SELECTOR
  // ==========================================================================
  let terminalState = {
    model: '2step',
    platform: 'TradeLocker',
    preference: 'Standard',
    size: 10000
  };

  function renderTerminalSizes() {
    const container = document.getElementById('sizes-container');
    if (!container) return;
    container.innerHTML = '';
    const tierData = CHALLENGE_MATRIX[terminalState.model].sizes;

    tierData.forEach(item => {
      const tile = document.createElement('div');
      tile.className = `size-tile ${item.size === terminalState.size ? 'active' : ''}`;
      tile.innerHTML = `
        <span class="size-tile-val font-mono">$${(item.size / 1000)}k</span>
        <span class="size-tile-lbl font-mono">Allocation</span>
      `;
      tile.addEventListener('click', () => {
        terminalState.size = item.size;
        renderTerminalSizes();
        updateTerminalSpecs();
      });
      container.appendChild(tile);
    });
  }

  function updateTerminalSpecs() {
    const tierData = CHALLENGE_MATRIX[terminalState.model].sizes;
    const match = tierData.find(s => s.size === terminalState.size) || tierData[1];

    const elTarget1 = document.getElementById('spec-target1');
    const elTarget2 = document.getElementById('spec-target2');
    const elTarget2Wrap = document.getElementById('spec-target2-wrap');
    const elDaily = document.getElementById('spec-daily');
    const elMax = document.getElementById('spec-maxloss');
    const elPrice = document.getElementById('spec-price');
    const elPeriod = document.getElementById('spec-period');

    if (elPrice) elPrice.textContent = match.price;
    if (elDaily) elDaily.textContent = `$${match.dailyLoss} (${((match.dailyLoss / match.size) * 100).toFixed(0)}%)`;
    if (elMax) elMax.textContent = `$${match.maxLoss} (${((match.maxLoss / match.size) * 100).toFixed(0)}%)`;

    if (terminalState.model === 'instant') {
      if (elTarget1) elTarget1.textContent = 'None (Immediate Split)';
      if (elTarget2Wrap) elTarget2Wrap.style.display = 'none';
      if (elPeriod) elPeriod.textContent = 'Indefinite Contract';
    } else if (terminalState.model === '1step') {
      if (elTarget1) elTarget1.textContent = `$${match.target1} (8%)`;
      if (elTarget2Wrap) elTarget2Wrap.style.display = 'none';
      if (elPeriod) elPeriod.textContent = 'Unlimited';
    } else {
      if (elTarget1) elTarget1.textContent = `$${match.target1} (5%)`;
      if (elTarget2Wrap) {
        elTarget2Wrap.style.display = 'block';
        if (elTarget2) elTarget2.textContent = `$${match.target2} (2.5%)`;
      }
      if (elPeriod) elPeriod.textContent = 'Unlimited';
    }
  }

  // ==========================================================================
  // 6. CHECKOUT SYSTEM CONTROLLER
  // ==========================================================================
  function syncCheckoutFromTerminal() {
    appState.cart.model = terminalState.model;
    appState.cart.platform = terminalState.platform;
    appState.cart.preference = terminalState.preference;
    appState.cart.size = terminalState.size;
    saveState(appState);
    updateCheckoutUI();
  }

  function updateCheckoutUI() {
    const model = appState.cart.model;
    const size = appState.cart.size;
    const tierSizes = CHALLENGE_MATRIX[model].sizes;
    const item = tierSizes.find(s => s.size === size) || tierSizes[0];

    const rawPrice = item.price;
    const discount = rawPrice * appState.cart.discountPct;
    const finalPrice = rawPrice - discount;

    const elSumScale = document.getElementById('sum-scale');
    const elSumModel = document.getElementById('sum-model');
    const elSumPlatform = document.getElementById('sum-platform');
    const elSumDaily = document.getElementById('sum-daily');
    const elSumMax = document.getElementById('sum-max');
    const elRaw = document.getElementById('sum-raw-price');
    const elDisc = document.getElementById('sum-discount');
    const elFinal = document.getElementById('sum-final-price');

    if (elSumScale) elSumScale.textContent = `$${size.toLocaleString()}`;
    if (elSumModel) elSumModel.textContent = CHALLENGE_MATRIX[model].label;
    if (elSumPlatform) elSumPlatform.textContent = appState.cart.platform;
    if (elSumDaily) elSumDaily.textContent = `$${item.dailyLoss}`;
    if (elSumMax) elSumMax.textContent = `$${item.maxLoss}`;
    if (elRaw) elRaw.textContent = `$${rawPrice.toFixed(2)}`;
    if (elDisc) elDisc.textContent = `-$${discount.toFixed(2)}`;
    if (elFinal) elFinal.textContent = `$${finalPrice.toFixed(2)}`;

    const sizeSelect = document.getElementById('co-size-select');
    if (sizeSelect) sizeSelect.value = size;

    document.querySelectorAll('#co-model-selector button').forEach(b => {
      b.classList.toggle('active', b.dataset.coModel === model);
    });
    document.querySelectorAll('#co-platform-selector button').forEach(b => {
      b.classList.toggle('active', b.dataset.coPlat === appState.cart.platform);
    });
  }

  // ==========================================================================
  // 7. DASHBOARD COMPUTATION & ANALYTICS
  // ==========================================================================
  function getActiveAccount() {
    return appState.accounts.find(a => a.id === appState.selectedAccountId) || appState.accounts[0];
  }

  function getActiveAccountTrades() {
    const acc = getActiveAccount();
    return appState.trades.filter(t => t.accountId === acc.id);
  }

  function updateDashboardGreeting() {
    const salutation = document.getElementById('overview-salutation');
    const localTime = document.getElementById('topbar-local-time');
    const eyebrow = document.getElementById('overview-greeting-eyebrow');
    const firstName = (appState.session?.user?.firstName || 'Trader').trim() || 'Trader';
    const hour = new Date().getHours();

    let greeting = 'Good morning';
    if (hour >= 12 && hour < 18) greeting = 'Good afternoon';
    else if (hour >= 18) greeting = 'Good evening';
    else if (hour < 5) greeting = 'Good night';

    if (salutation) salutation.textContent = `${greeting}, ${firstName}.`;
    if (localTime) {
      localTime.textContent = new Intl.DateTimeFormat(undefined, {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      }).format(new Date());
    }
    if (eyebrow) {
      eyebrow.textContent = 'LOCAL DESK // LIVE SESSION';
    }
  }

  function renderDashboard() {
    updateDashboardGreeting();
    const acc = getActiveAccount();
    const trades = getActiveAccountTrades();

    const elStatus = document.getElementById('sidebar-account-status');
    const elInitials = document.getElementById('dash-user-initials');
    const elUserName = document.getElementById('dash-user-name');
    if (elStatus) elStatus.textContent = acc.status;
    if (elInitials) elInitials.textContent = `${appState.session.user.firstName[0]}${appState.session.user.lastName[0]}`;
    if (elUserName) elUserName.textContent = `${appState.session.user.firstName} ${appState.session.user.lastName}`;

    const switcher = document.getElementById('dash-account-switcher');
    if (switcher) {
      switcher.innerHTML = '';
      appState.accounts.forEach(a => {
        const opt = document.createElement('option');
        opt.value = a.id;
        opt.textContent = `${a.id} ($${a.size.toLocaleString()})`;
        if (a.id === acc.id) opt.selected = true;
        switcher.appendChild(opt);
      });
    }

    const startingBal = acc.startingBalance;
    const currBal = acc.balance;
    const totalPnl = currBal - startingBal;
    const dailyUsed = 54.80;
    const maxLossUsed = startingBal - currBal > 0 ? (startingBal - currBal) : 108.80;

    const elBal = document.getElementById('kpi-balance');
    const elEq = document.getElementById('kpi-equity');
    const elDailyDD = document.getElementById('kpi-daily-dd');
    const elDailyBar = document.getElementById('kpi-daily-bar');
    const elDailyRem = document.getElementById('kpi-daily-rem');
    const elBalDelta = document.getElementById('kpi-balance-delta');

    if (elBal) elBal.textContent = `$${currBal.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
    if (elEq) elEq.textContent = `$${acc.equity.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
    if (elBalDelta) elBalDelta.textContent = `${totalPnl >= 0 ? '+' : ''}$${totalPnl.toFixed(2)} Net Growth`;

    const dailyPct = ((dailyUsed / acc.dailyLossLimit) * 100).toFixed(1);
    if (elDailyDD) elDailyDD.textContent = `${((dailyUsed / acc.size) * 100).toFixed(2)}%`;
    if (elDailyBar) elDailyBar.style.width = `${Math.min(dailyPct, 100)}%`;
    if (elDailyRem) elDailyRem.textContent = `$${(acc.dailyLossLimit - dailyUsed).toFixed(2)} remaining`;

    // Overview Risk Gauges
    const ovDailyLimit = document.getElementById('ov-daily-limit');
    const ovDailyUsed = document.getElementById('ov-daily-used');
    const barDailyUsed = document.getElementById('bar-daily-used');
    const ovMaxLimit = document.getElementById('ov-max-limit');
    const ovMaxUsed = document.getElementById('ov-max-used');
    const barMaxUsed = document.getElementById('bar-max-used');

    if (ovDailyLimit) ovDailyLimit.textContent = `$${acc.dailyLossLimit.toFixed(2)}`;
    if (ovDailyUsed) ovDailyUsed.textContent = `$${dailyUsed.toFixed(2)}`;
    if (barDailyUsed) barDailyUsed.style.width = `${dailyPct}%`;
    if (ovMaxLimit) ovMaxLimit.textContent = `$${acc.maxLossLimit.toFixed(2)}`;
    if (ovMaxUsed) ovMaxUsed.textContent = `$${maxLossUsed.toFixed(2)}`;
    if (barMaxUsed) barMaxUsed.style.width = `${((maxLossUsed / acc.maxLossLimit) * 100).toFixed(1)}%`;

    renderInteractiveChart('1M');
    calculatePerformanceStats(trades);
    renderTradingCalendar();
    renderTradesTable(trades);

    const elRiskDaily = document.getElementById('risk-big-daily');
    const elRiskMax = document.getElementById('risk-big-max');
    if (elRiskDaily) elRiskDaily.textContent = `${((dailyUsed / acc.size) * 100).toFixed(2)}%`;
    if (elRiskMax) elRiskMax.textContent = `${((maxLossUsed / acc.size) * 100).toFixed(2)}%`;

    const target = acc.target || 1;
    const objPct = acc.target === 0 ? 100 : Math.min(((totalPnl / target) * 100), 100).toFixed(1);
    const elObjPct = document.getElementById('obj-target-pct');
    const elObjFill = document.getElementById('obj-target-fill');
    const elObjCurr = document.getElementById('obj-target-curr');
    const elObjRem = document.getElementById('obj-target-rem');
    const elObjTitle = document.getElementById('obj-target-title');

    if (elObjTitle) elObjTitle.textContent = acc.target === 0 ? 'Qualified Analyst Active (No Target)' : `Profit Target Objective ($${target.toFixed(2)})`;
    if (elObjPct) elObjPct.textContent = `${objPct}%`;
    if (elObjFill) elObjFill.style.width = `${objPct}%`;
    if (elObjCurr) elObjCurr.textContent = `+$${totalPnl.toFixed(2)}`;
    if (elObjRem) elObjRem.textContent = totalPnl >= target ? '$0.00 (OBJECTIVE COMPLETE)' : `$${(target - totalPnl).toFixed(2)}`;

    const elPoAvail = document.getElementById('po-avail-bal');
    const elPoCalc = document.getElementById('po-calc-payout');
    if (elPoAvail) elPoAvail.textContent = `$${Math.max(totalPnl, 0).toFixed(2)}`;
    if (elPoCalc) elPoCalc.textContent = `$${(Math.max(totalPnl, 0) * 0.80).toFixed(2)}`;
    renderPayoutHistory();

    renderCertificates();
    renderAccountsPortfolio();
    renderSupportTickets();
    renderNotifications();
    renderProfileView();
  }

  // ==========================================================================
  // 8. INTERACTIVE SVG CHART GENERATOR
  // ==========================================================================
  function renderInteractiveChart(timeframe) {
    const container = document.getElementById('overview-chart-canvas');
    if (!container) return;

    const pointsMap = {
      '1D': [10380, 10390, 10375, 10410, 10395, 10428.60],
      '1W': [10150, 10210, 10180, 10340, 10310, 10428.60],
      '1M': [10000, 10120, 10080, 10250, 10190, 10340, 10290, 10428.60],
      'ALL': [10000, 9920, 10150, 10280, 10190, 10340, 10428.60]
    };

    const data = pointsMap[timeframe] || pointsMap['1M'];
    const minVal = Math.min(...data) - 50;
    const maxVal = Math.max(...data) + 50;
    const width = 800;
    const height = 280;
    const padding = 40;

    const stepX = (width - padding * 2) / (data.length - 1);
    const coords = data.map((val, idx) => {
      const x = padding + idx * stepX;
      const y = height - padding - ((val - minVal) / (maxVal - minVal)) * (height - padding * 2);
      return { x, y, val };
    });

    let pathD = `M ${coords[0].x} ${coords[0].y}`;
    coords.slice(1).forEach(pt => {
      pathD += ` L ${pt.x} ${pt.y}`;
    });

    const areaD = `${pathD} L ${coords[coords.length - 1].x} ${height - padding} L ${coords[0].x} ${height - padding} Z`;

    const styles = getComputedStyle(document.body);
    const chartText = styles.getPropertyValue('--text-primary').trim() || '#f5f5f7';
    const chartGrid = document.body.dataset.theme === 'light' ? 'rgba(15,23,42,0.07)' : 'rgba(255,255,255,0.05)';
    const chartBase = document.body.dataset.theme === 'light' ? 'rgba(15,23,42,0.10)' : 'rgba(255,255,255,0.08)';
    const chartNodeStroke = document.body.dataset.theme === 'light' ? '#ffffff' : '#121318';

    container.innerHTML = `
      <svg viewBox="0 0 ${width} ${height}" style="width: 100%; height: 100%; overflow: visible;">
        <defs>
          <linearGradient id="eqFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#d4af37" stop-opacity="0.25"/>
            <stop offset="100%" stop-color="#d4af37" stop-opacity="0.0"/>
          </linearGradient>
        </defs>
        <line x1="${padding}" y1="${padding}" x2="${width - padding}" y2="${padding}" stroke="${chartGrid}" stroke-dasharray="4"/>
        <line x1="${padding}" y1="${height/2}" x2="${width - padding}" y2="${height/2}" stroke="${chartGrid}" stroke-dasharray="4"/>
        <line x1="${padding}" y1="${height - padding}" x2="${width - padding}" y2="${height - padding}" stroke="${chartBase}"/>

        <path d="${areaD}" fill="url(#eqFill)"/>
        <path d="${pathD}" fill="none" stroke="#d4af37" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>

        ${coords.map(pt => `
          <g class="chart-node" style="cursor: pointer;">
            <circle cx="${pt.x}" cy="${pt.y}" r="4" fill="#d4af37" stroke="${chartNodeStroke}" stroke-width="2"/>
            <text x="${pt.x}" y="${pt.y - 12}" fill="${chartText}" font-size="11" font-family="'Geist Mono', monospace" text-anchor="middle" opacity="0.85">$${pt.val.toLocaleString()}</text>
          </g>
        `).join('')}
      </svg>
    `;
  }

  // ==========================================================================
  // 9. QUANTITATIVE PERFORMANCE STATS
  // ==========================================================================
  function calculatePerformanceStats(trades) {
    if (!trades.length) return;
    const wins = trades.filter(t => t.pnl > 0);
    const losses = trades.filter(t => t.pnl < 0);

    const winRate = ((wins.length / trades.length) * 100).toFixed(1);
    const grossProfit = wins.reduce((acc, t) => acc + t.pnl, 0);
    const grossLoss = Math.abs(losses.reduce((acc, t) => acc + t.pnl, 0)) || 1;
    const profitFactor = (grossProfit / grossLoss).toFixed(2);
    const avgWin = wins.length ? (grossProfit / wins.length).toFixed(2) : '0.00';
    const avgLoss = losses.length ? (grossLoss / losses.length).toFixed(2) : '0.00';

    const elWinRate = document.getElementById('perf-winrate');
    const elPf = document.getElementById('perf-profit-factor');
    const elAvgW = document.getElementById('perf-avg-win');
    const elAvgL = document.getElementById('perf-avg-loss');
    const elWinCounts = document.getElementById('perf-win-counts');

    if (elWinRate) elWinRate.textContent = `${winRate}%`;
    if (elPf) elPf.textContent = profitFactor;
    if (elAvgW) elAvgW.textContent = `+$${avgWin}`;
    if (elAvgL) elAvgL.textContent = `-$${avgLoss}`;
    if (elWinCounts) elWinCounts.textContent = `${wins.length} Wins / ${losses.length} Losses`;

    const distContainer = document.getElementById('dist-chart-bars');
    if (distContainer) {
      const symbols = ['XAUUSD', 'EURUSD', 'GBPUSD', 'USDJPY', 'USDCAD'];
      distContainer.innerHTML = symbols.map(sym => {
        const symTrades = trades.filter(t => t.symbol === sym);
        const symPnl = symTrades.reduce((a, b) => a + b.pnl, 0);
        const isPos = symPnl >= 0;
        return `
          <div class="dist-bar-item font-mono">
            <strong>${sym}</strong>
            <div class="kpi-bar-wrap" style="height: 8px;">
              <div class="kpi-prog-bar" style="width: ${Math.min(Math.abs(symPnl) / 5, 100)}%; background: ${isPos ? 'var(--state-success)' : 'var(--state-danger)'};"></div>
            </div>
            <span class="${isPos ? 'text-success' : 'text-danger'}" style="text-align: right;">${isPos ? '+' : ''}$${symPnl.toFixed(2)}</span>
          </div>
        `;
      }).join('');
    }
  }

  // ==========================================================================
  // 10. CALENDAR ENGINE
  // ==========================================================================
  let calDate = new Date(2026, 8, 1);

  function renderTradingCalendar() {
    const grid = document.getElementById('calendar-grid');
    const title = document.getElementById('cal-month-title');
    if (!grid || !title) return;

    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    title.textContent = `${monthNames[calDate.getMonth()]} ${calDate.getFullYear()}`;

    grid.innerHTML = '';
    const year = calDate.getFullYear();
    const month = calDate.getMonth();

    const firstDayIndex = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();

    const trades = getActiveAccountTrades();
    const dayPnlMap = {};
    trades.forEach(t => {
      const d = new Date(t.date);
      if (d.getMonth() === month && d.getFullYear() === year) {
        const dayNum = d.getDate();
        if (!dayPnlMap[dayNum]) dayPnlMap[dayNum] = { pnl: 0, count: 0, trades: [] };
        dayPnlMap[dayNum].pnl += t.pnl;
        dayPnlMap[dayNum].count += 1;
        dayPnlMap[dayNum].trades.push(t);
      }
    });

    for (let i = 0; i < firstDayIndex; i++) {
      const cell = document.createElement('div');
      cell.className = 'cal-day-cell other-month';
      grid.appendChild(cell);
    }

    for (let day = 1; day <= totalDays; day++) {
      const cell = document.createElement('div');
      cell.className = 'cal-day-cell';
      const record = dayPnlMap[day];

      let inner = `<span class="cal-day-num font-mono">${day}</span>`;
      if (record) {
        const isWin = record.pnl >= 0;
        inner += `
          <div>
            <div class="cal-day-pnl ${isWin ? 'text-success' : 'text-danger'} font-mono">${isWin ? '+' : ''}$${record.pnl.toFixed(0)}</div>
            <div class="cal-day-trades font-mono">${record.count} ${record.count === 1 ? 'pos' : 'positions'}</div>
          </div>
        `;
        cell.addEventListener('click', () => openCalendarDayModal(day, record));
      }
      cell.innerHTML = inner;
      grid.appendChild(cell);
    }
  }

  function openCalendarDayModal(day, record) {
    const modal = document.getElementById('modal-day-inspect');
    const title = document.getElementById('modal-day-title');
    const body = document.getElementById('modal-day-content');
    if (!modal || !title || !body) return;

    title.textContent = `Trading Audit: September ${day}, 2026`;
    const isWin = record.pnl >= 0;

    body.innerHTML = `
      <div style="margin-bottom: 1.5rem;" class="font-mono">
        <h4>Net Closed Result: <span class="${isWin ? 'text-success' : 'text-danger'}">${isWin ? '+' : ''}$${record.pnl.toFixed(2)}</span></h4>
        <p class="text-muted">Total Positions Executed: ${record.count}</p>
      </div>
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>Symbol</th>
              <th>Direction</th>
              <th>Lots</th>
              <th>P&L</th>
            </tr>
          </thead>
          <tbody>
            ${record.trades.map(t => `
              <tr>
                <td><strong>${t.symbol}</strong></td>
                <td><span class="${t.direction === 'BUY' ? 'text-success' : 'text-danger'} font-mono">${t.direction}</span></td>
                <td class="font-mono">${t.lots.toFixed(2)}</td>
                <td class="font-mono ${t.pnl >= 0 ? 'text-success' : 'text-danger'}">${t.pnl >= 0 ? '+' : ''}$${t.pnl.toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
    modal.classList.add('open');
  }

  // ==========================================================================
  // 11. TRADES AUDIT & FILTER TABLE
  // ==========================================================================
  function renderTradesTable(trades) {
    const tbody = document.getElementById('trades-tbody');
    const empty = document.getElementById('trades-empty');
    if (!tbody) return;

    tbody.innerHTML = '';
    if (!trades.length) {
      if (empty) empty.style.display = 'block';
      return;
    }
    if (empty) empty.style.display = 'none';

    trades.forEach(t => {
      const tr = document.createElement('tr');
      const isWin = t.pnl >= 0;
      tr.innerHTML = `
        <td><strong>${t.symbol}</strong></td>
        <td><span class="font-mono ${t.direction === 'BUY' ? 'text-success' : 'text-danger'}">${t.direction}</span></td>
        <td class="font-mono">${t.lots.toFixed(2)}</td>
        <td class="font-mono">${t.entry}</td>
        <td class="font-mono">${t.exit}</td>
        <td class="font-mono ${isWin ? 'text-success' : 'text-danger'}"><strong>${isWin ? '+' : ''}$${t.pnl.toFixed(2)}</strong></td>
        <td class="font-mono text-muted">${t.duration}</td>
        <td class="font-mono text-muted">${t.date}</td>
        <td><button class="btn btn-ghost btn-inspect-trade" data-trade-id="${t.id}" style="padding: 2px 8px; font-size: 0.75rem;">Inspect</button></td>
      `;
      tbody.appendChild(tr);
    });

    tbody.querySelectorAll('.btn-inspect-trade').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.tradeId;
        const match = trades.find(t => t.id === id);
        if (match) openTradeModal(match);
      });
    });
  }

  function openTradeModal(trade) {
    const modal = document.getElementById('modal-trade-inspect');
    const content = document.getElementById('modal-trade-content');
    if (!modal || !content) return;

    const isWin = trade.pnl >= 0;
    content.innerHTML = `
      <div class="font-mono" style="display: flex; flex-direction: column; gap: 0.75rem;">
        <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--border-subtle); padding-bottom: 0.5rem;">
          <span class="text-muted">Ticket ID:</span>
          <strong>${trade.id}</strong>
        </div>
        <div style="display: flex; justify-content: space-between;">
          <span class="text-muted">Instrument:</span>
          <strong>${trade.symbol}</strong>
        </div>
        <div style="display: flex; justify-content: space-between;">
          <span class="text-muted">Action:</span>
          <span class="${trade.direction === 'BUY' ? 'text-success' : 'text-danger'}">${trade.direction} ${trade.lots} Lots</span>
        </div>
        <div style="display: flex; justify-content: space-between;">
          <span class="text-muted">Execution Quotes:</span>
          <span>${trade.entry} &rarr; ${trade.exit}</span>
        </div>
        <div style="display: flex; justify-content: space-between;">
          <span class="text-muted">Execution Fill Latency:</span>
          <span>14ms (Direct Tier-1 Liquidity)</span>
        </div>
        <div style="display: flex; justify-content: space-between; border-top: 1px solid var(--border-subtle); padding-top: 0.75rem;">
          <span>Net Return Realized:</span>
          <strong class="${isWin ? 'text-success' : 'text-danger'} font-large">${isWin ? '+' : ''}$${trade.pnl.toFixed(2)}</strong>
        </div>
      </div>
    `;
    modal.classList.add('open');
  }

  // ==========================================================================
  // 12. PAYOUT HISTORY & MODAL ENGINE
  // ==========================================================================
  function renderPayoutHistory() {
    const tbody = document.getElementById('payout-history-tbody');
    if (!tbody) return;
    tbody.innerHTML = '';
    appState.payouts.forEach(po => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td class="font-mono"><strong>${po.id}</strong></td>
        <td class="font-mono text-muted">${po.date}</td>
        <td class="font-mono">$${po.amountGross.toFixed(2)}</td>
        <td class="font-mono text-success"><strong>$${po.amountTrader.toFixed(2)}</strong></td>
        <td class="font-mono">${po.method}</td>
        <td><span class="badge-status-sm healthy font-mono">${po.status}</span></td>
      `;
      tbody.appendChild(tr);
    });
  }

  // ==========================================================================
  // 13. CERTIFICATES ENGINE
  // ==========================================================================
  function renderCertificates() {
    const container = document.getElementById('certs-container');
    if (!container) return;

    const certList = [
      { id: 'CKC-101', title: 'Challenge Step 1 Achieved', date: '2026-08-20', desc: 'Passed evaluation metrics with disciplined risk exposure.' },
      { id: 'CKC-102', title: 'Qualified Analyst Status', date: '2026-07-28', desc: 'Verified consistency and earned access to scaled live execution.' },
      { id: 'CKC-103', title: 'Performance Payout Milestone', date: '2026-08-15', desc: 'First simulated institutional withdrawal successfully disbursed.' }
    ];

    container.innerHTML = certList.map(c => `
      <div class="cert-card-item glass-panel">
        <div>
          <div class="cert-icon-ph">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>
          </div>
          <h4>${c.title}</h4>
          <p class="text-muted">${c.desc}</p>
        </div>
        <div>
          <span class="font-mono text-muted" style="display:block; font-size:0.75rem; margin-bottom: 0.75rem;">Issued: ${c.date}</span>
          <button class="btn btn-secondary btn-block btn-view-cert" data-cert-id="${c.id}" data-cert-title="${c.title}">View Official Credential</button>
        </div>
      </div>
    `).join('');

    container.querySelectorAll('.btn-view-cert').forEach(btn => {
      btn.addEventListener('click', () => {
        openCertificateModal(btn.dataset.certId, btn.dataset.certTitle);
      });
    });
  }

  function openCertificateModal(id, title) {
    const modal = document.getElementById('modal-cert');
    const elTitle = document.getElementById('cert-modal-title');
    const elName = document.getElementById('cert-modal-name');
    const elId = document.getElementById('cert-modal-id');
    const elAcc = document.getElementById('cert-modal-acc');
    if (!modal) return;

    if (elTitle) elTitle.textContent = title.toUpperCase();
    if (elName) elName.textContent = `${appState.session.user.firstName} ${appState.session.user.lastName}`.toUpperCase();
    if (elId) elId.textContent = id;
    if (elAcc) elAcc.textContent = appState.selectedAccountId;
    modal.classList.add('open');
  }

  // ==========================================================================
  // 14. ACCOUNTS PORTFOLIO TAB
  // ==========================================================================
  function renderAccountsPortfolio() {
    const grid = document.getElementById('accounts-cards-grid');
    if (!grid) return;
    grid.innerHTML = '';

    appState.accounts.forEach(acc => {
      const card = document.createElement('div');
      const isSelected = acc.id === appState.selectedAccountId;
      card.className = `acc-card glass-panel ${isSelected ? 'active-selected' : ''}`;
      card.innerHTML = `
        <div class="acc-card-head">
          <span class="font-mono font-bold">${acc.id}</span>
          <span class="badge-status-sm healthy font-mono">${acc.status}</span>
        </div>
        <div class="acc-card-bal font-mono">$${acc.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
        <p class="text-muted font-mono" style="font-size: 0.75rem; margin-bottom: 1.25rem;">
          Platform: ${acc.platform} // Scale: $${acc.size.toLocaleString()}
        </p>
        <button class="btn ${isSelected ? 'btn-secondary' : 'btn-primary'} btn-block btn-switch-acc" data-acc-id="${acc.id}">
          ${isSelected ? 'Active Workstation' : 'Switch Terminal'}
        </button>
      `;
      grid.appendChild(card);
    });

    grid.querySelectorAll('.btn-switch-acc').forEach(b => {
      b.addEventListener('click', () => {
        appState.selectedAccountId = b.dataset.accId;
        saveState(appState);
        renderDashboard();
        showToast(`Switched active terminal to ${appState.selectedAccountId}`);
      });
    });
  }

  // ==========================================================================
  // 15. SUPPORT TICKETS
  // ==========================================================================
  function renderSupportTickets() {
    const container = document.getElementById('support-tickets-list');
    if (!container) return;
    container.innerHTML = appState.tickets.map(t => `
      <div class="ticket-item">
        <div class="ticket-item-top">
          <span class="text-gold font-mono">${t.id}</span>
          <span class="badge-status-sm healthy font-mono">${t.status}</span>
        </div>
        <div style="font-weight: 600; font-size: 0.85rem; margin-bottom: 0.2rem;">${t.subject}</div>
        <div class="text-muted font-mono" style="font-size: 0.72rem;">${t.category} // Logged: ${t.date}</div>
      </div>
    `).join('');
  }

  // ==========================================================================
  // 16. NOTIFICATIONS SYSTEM
  // ==========================================================================
  function renderNotifications() {
    const count = document.getElementById('notif-count');
    const list = document.getElementById('notif-items-list');
    if (!list) return;

    const unread = appState.notifications.filter(n => !n.read).length;
    if (count) count.textContent = unread;

    list.innerHTML = appState.notifications.map(n => `
      <div class="notif-item ${n.read ? 'read' : ''}">
        <div><strong>${n.title}</strong></div>
        <div class="text-muted font-mono" style="font-size: 0.65rem;">${n.time}</div>
      </div>
    `).join('');
  }

  // ==========================================================================
  // 17. PROFILE RENDER
  // ==========================================================================
  function renderProfileView() {
    const user = appState.session.user;
    const elName = document.getElementById('prof-display-name');
    const elEmail = document.getElementById('prof-display-email');
    const elCountry = document.getElementById('prof-display-country');
    const elBigAvatar = document.getElementById('prof-big-avatar');

    if (elName) elName.textContent = `${user.firstName} ${user.lastName}`;
    if (elEmail) elEmail.textContent = user.email;
    if (elCountry) elCountry.textContent = user.country;
    if (elBigAvatar) elBigAvatar.textContent = `${user.firstName[0]}${user.lastName[0]}`;
  }

  // ==========================================================================
  // 18. INITIALIZE ALL GLOBAL EVENT HANDLERS
  // ==========================================================================
  function initializeListeners() {

    // 1. Navigation Routing
    document.querySelectorAll('[data-nav]').forEach(el => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        const target = el.dataset.nav;
        if (target === 'home') switchView('public');
        else if (target === 'challenges') {
          switchView('public');
          document.getElementById('challenge-terminal')?.scrollIntoView({ behavior: 'smooth' });
        }
        else if (target === 'how-it-works') {
          switchView('public');
          document.getElementById('how-it-works-sec')?.scrollIntoView({ behavior: 'smooth' });
        }
        else if (target === 'objectives') {
          switchView('public');
          document.getElementById('objectives-sec')?.scrollIntoView({ behavior: 'smooth' });
        }
        else if (target === 'about') {
          switchView('public');
          document.getElementById('about-sec')?.scrollIntoView({ behavior: 'smooth' });
        }
        else if (target === 'faq') {
          switchView('public');
          document.getElementById('faq-sec')?.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });

    // 2. Smooth Scroll Anchor Buttons
    document.querySelectorAll('[data-scroll]').forEach(el => {
      el.addEventListener('click', () => {
        const id = el.dataset.scroll;
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      });
    });

    // 3. Auth Navigation Buttons
    const btnAuth = document.getElementById('nav-btn-auth');
    const mobileAuth = document.getElementById('mobile-link-auth');
    const footLogin = document.getElementById('footer-btn-login');
    [btnAuth, mobileAuth, footLogin].forEach(b => {
      b?.addEventListener('click', () => switchView('auth'));
    });

    // 4. Portal direct entry button from Hero
    document.getElementById('hero-btn-demo-portal')?.addEventListener('click', () => switchView('dashboard'));

    // 5. Drawer Controls
    const btnHam = document.getElementById('btn-hamburger');
    const drawer = document.getElementById('mobile-drawer');
    const btnCloseDrawer = document.getElementById('btn-close-drawer');
    btnHam?.addEventListener('click', () => drawer.classList.add('open'));
    btnCloseDrawer?.addEventListener('click', () => drawer.classList.remove('open'));
    drawer?.querySelectorAll('.drawer-link, .btn').forEach(l => {
      l.addEventListener('click', () => drawer.classList.remove('open'));
    });

    // 6. Announcement Bar Close
    document.getElementById('btn-close-banner')?.addEventListener('click', () => {
      const banner = document.getElementById('promo-banner');
      document.body.classList.add('promo-dismissed');
      if (banner) banner.style.display = 'none';
    });

    // 7. Terminal Interaction Listeners
    document.querySelectorAll('#model-selector button').forEach(b => {
      b.addEventListener('click', () => {
        document.querySelectorAll('#model-selector button').forEach(el => el.classList.remove('active'));
        b.classList.add('active');
        terminalState.model = b.dataset.model;
        renderTerminalSizes();
        updateTerminalSpecs();
      });
    });

    document.querySelectorAll('#platform-selector button').forEach(b => {
      b.addEventListener('click', () => {
        document.querySelectorAll('#platform-selector button').forEach(el => el.classList.remove('active'));
        b.classList.add('active');
        terminalState.platform = b.dataset.platform;
      });
    });

    document.querySelectorAll('#preference-selector button').forEach(b => {
      b.addEventListener('click', () => {
        document.querySelectorAll('#preference-selector button').forEach(el => el.classList.remove('active'));
        b.classList.add('active');
        terminalState.preference = b.dataset.pref;
      });
    });

    document.getElementById('btn-terminal-checkout')?.addEventListener('click', () => {
      syncCheckoutFromTerminal();
      switchView('checkout');
    });

    // 8. Checkout Configuration Listeners
    document.querySelectorAll('#co-model-selector button').forEach(b => {
      b.addEventListener('click', () => {
        appState.cart.model = b.dataset.coModel;
        updateCheckoutUI();
      });
    });

    document.getElementById('co-size-select')?.addEventListener('change', (e) => {
      appState.cart.size = parseInt(e.target.value, 10);
      updateCheckoutUI();
    });

    document.querySelectorAll('#co-platform-selector button').forEach(b => {
      b.addEventListener('click', () => {
        appState.cart.platform = b.dataset.coPlat;
        updateCheckoutUI();
      });
    });

    document.getElementById('btn-apply-promo')?.addEventListener('click', () => {
      const input = document.getElementById('co-promo-input');
      const code = input ? input.value.trim().toUpperCase() : '';
      const msg = document.getElementById('promo-msg');
      if (code === 'CONSISTENCY' || code === 'CK15') {
        appState.cart.discountPct = 0.15;
        if (msg) {
          msg.textContent = `Coupon ${code} applied: 15% institutional discount active`;
          msg.style.color = 'var(--state-success)';
        }
        showToast('Promo code applied (-15%)');
      } else {
        appState.cart.discountPct = 0;
        if (msg) {
          msg.textContent = 'Invalid promo code entered';
          msg.style.color = 'var(--state-danger)';
        }
        showToast('Invalid promo code');
      }
      updateCheckoutUI();
    });

    document.querySelectorAll('#co-payment-methods .pay-method-card').forEach(card => {
      card.addEventListener('click', () => {
        document.querySelectorAll('#co-payment-methods .pay-method-card').forEach(c => c.classList.remove('active'));
        card.classList.add('active');
      });
    });

    // 9. Complete Checkout Order -> Persist & Enter Dashboard
    document.getElementById('btn-complete-order')?.addEventListener('click', () => {
      const newId = `CK-${appState.cart.size}-${Math.floor(100 + Math.random() * 900)}`;
      const tierSizes = CHALLENGE_MATRIX[appState.cart.model].sizes;
      const spec = tierSizes.find(s => s.size === appState.cart.size) || tierSizes[0];

      const newAccount = {
        id: newId,
        model: appState.cart.model,
        platform: appState.cart.platform,
        preference: appState.cart.preference || 'Standard',
        size: appState.cart.size,
        balance: appState.cart.size,
        equity: appState.cart.size,
        startingBalance: appState.cart.size,
        status: 'ACTIVE // PHASE 1',
        step: 1,
        target: spec.target1,
        dailyLossLimit: spec.dailyLoss,
        maxLossLimit: spec.maxLoss,
        createdDate: new Date().toISOString().split('T')[0]
      };

      appState.accounts.unshift(newAccount);
      appState.selectedAccountId = newId;

      appState.notifications.unshift({
        id: `N-${Date.now()}`,
        title: `Account ${newId} initialized successfully`,
        time: 'Just now',
        read: false
      });

      saveState(appState);
      showToast(`Challenge order confirmed! Account ${newId} ready.`);
      switchView('dashboard');
    });

    // 10. Authentication Forms & Subtabs
    document.querySelectorAll('#auth-tabs button').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('#auth-tabs button').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        const mode = tab.dataset.tab;
        document.querySelectorAll('.auth-form-sub').forEach(f => f.classList.remove('active'));
        document.getElementById(`form-${mode}`)?.classList.add('active');

        const title = document.getElementById('auth-main-title');
        const subtitle = document.getElementById('auth-sub-title');
        if (mode === 'login') {
          if (title) title.textContent = 'Trader Cockpit Login';
          if (subtitle) subtitle.textContent = 'Enter your institutional credentials to access your control room.';
        } else if (mode === 'register') {
          if (title) title.textContent = 'Open Trader Account';
          if (subtitle) subtitle.textContent = 'Register with CK Capital to start your evaluation journey.';
        } else if (mode === 'forgot') {
          if (title) title.textContent = 'Recover Workstation Password';
          if (subtitle) subtitle.textContent = 'A recovery link will be sent to your registered email.';
        }
      });
    });

    document.getElementById('btn-show-forgot')?.addEventListener('click', () => {
      document.querySelector('#auth-tabs button[data-tab="forgot"]')?.click();
    });

    document.getElementById('btn-back-login')?.addEventListener('click', () => {
      document.querySelector('#auth-tabs button[data-tab="login"]')?.click();
    });

    // Toggle Password Visibility
    document.querySelectorAll('.btn-toggle-pw').forEach(btn => {
      btn.addEventListener('click', () => {
        const input = btn.previousElementSibling;
        if (input) {
          input.type = input.type === 'password' ? 'text' : 'password';
          btn.textContent = input.type === 'password' ? '👁' : '🔒';
        }
      });
    });

    // Form Submission: Login
    document.getElementById('form-login')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = document.getElementById('login-email');
      const pwInput = document.getElementById('login-password');
      const email = emailInput ? emailInput.value.trim() : '';
      const pw = pwInput ? pwInput.value : '';

      if (email && pw) {
        appState.session.isLoggedIn = true;
        saveState(appState);
        showToast('Workstation credentials verified. Entering Control Room.');
        switchView('dashboard');
      }
    });

    // Form Submission: Register
    document.getElementById('form-register')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const first = document.getElementById('reg-first').value.trim();
      const last = document.getElementById('reg-last').value.trim();
      const email = document.getElementById('reg-email').value.trim();
      const pw = document.getElementById('reg-password').value;
      const confirm = document.getElementById('reg-confirm').value;
      const country = document.getElementById('reg-country').value;

      if (pw !== confirm) {
        showToast('Error: Passwords do not match');
        return;
      }

      appState.session.user = {
        firstName: first || 'Trader',
        lastName: last || 'Analyst',
        email: email,
        country: country,
        memberSince: 'September 2026',
        isVerified: true
      };
      appState.session.isLoggedIn = true;
      saveState(appState);
      showToast('Registration successful. Profile authorized.');
      switchView('dashboard');
    });

    // Form Submission: Forgot Password
    document.getElementById('form-forgot')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('forgot-email').value;
      showToast(`Recovery instructions transmitted to ${email}`);
      document.querySelector('#auth-tabs button[data-tab="login"]')?.click();
    });

    // 11. Cockpit Sidebar Tabs Navigation
    document.querySelectorAll('.sb-item').forEach(item => {
      item.addEventListener('click', () => {
        const tab = item.dataset.tab;
        document.querySelectorAll('.sb-item').forEach(i => i.classList.remove('active'));
        item.classList.add('active');

        document.querySelectorAll('.dash-tab-pane').forEach(p => p.classList.remove('active'));
        document.getElementById(`pane-${tab}`)?.classList.add('active');

        // Close sidebar on mobile upon tab selection
        document.getElementById('cockpit-sidebar')?.classList.remove('open');
      });
    });

    // Cockpit Mobile Sidebar Toggle
    document.getElementById('dash-mobile-toggle')?.addEventListener('click', () => {
      document.getElementById('cockpit-sidebar')?.classList.toggle('open');
    });
    document.getElementById('btn-collapse-sidebar')?.addEventListener('click', () => {
      document.getElementById('cockpit-sidebar')?.classList.remove('open');
    });

    // Account Switcher Dropdown
    document.getElementById('dash-account-switcher')?.addEventListener('change', (e) => {
      appState.selectedAccountId = e.target.value;
      saveState(appState);
      renderDashboard();
      showToast(`Terminal updated: ${appState.selectedAccountId}`);
    });

    // Logout Button
    document.getElementById('btn-dash-logout')?.addEventListener('click', () => {
      appState.session.isLoggedIn = false;
      saveState(appState);
      showToast('Session terminated cleanly');
      switchView('public');
    });

    // Timeframe Buttons on Equity Curve
    document.querySelectorAll('#chart-tf-selector .tf-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#chart-tf-selector .tf-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderInteractiveChart(btn.dataset.tf);
      });
    });

    // Calendar Navigation
    document.getElementById('cal-btn-prev')?.addEventListener('click', () => {
      calDate.setMonth(calDate.getMonth() - 1);
      renderTradingCalendar();
    });
    document.getElementById('cal-btn-next')?.addEventListener('click', () => {
      calDate.setMonth(calDate.getMonth() + 1);
      renderTradingCalendar();
    });

    // Trade Journal Filtering & Searching
    const tradeSearch = document.getElementById('trade-search-input');
    const tradeDir = document.getElementById('trade-dir-filter');
    const tradeRes = document.getElementById('trade-result-filter');

    function applyTradeFilters() {
      const q = tradeSearch ? tradeSearch.value.trim().toUpperCase() : '';
      const dir = tradeDir ? tradeDir.value : 'ALL';
      const res = tradeRes ? tradeRes.value : 'ALL';

      let list = getActiveAccountTrades();
      if (q) list = list.filter(t => t.symbol.includes(q));
      if (dir !== 'ALL') list = list.filter(t => t.direction === dir);
      if (res === 'WIN') list = list.filter(t => t.pnl > 0);
      if (res === 'LOSS') list = list.filter(t => t.pnl < 0);

      renderTradesTable(list);
    }

    tradeSearch?.addEventListener('input', applyTradeFilters);
    tradeDir?.addEventListener('change', applyTradeFilters);
    tradeRes?.addEventListener('change', applyTradeFilters);

    // Payout Request Modal
    const modalPayout = document.getElementById('modal-payout');
    document.getElementById('btn-open-payout-modal')?.addEventListener('click', () => {
      const acc = getActiveAccount();
      const totalPnl = Math.max(acc.balance - acc.startingBalance, 0);
      const availInput = document.getElementById('modal-payout-avail');
      const reqAmountInput = document.getElementById('po-req-amount');

      if (availInput) availInput.value = `$${totalPnl.toFixed(2)}`;
      if (reqAmountInput) {
        reqAmountInput.max = totalPnl.toFixed(2);
        reqAmountInput.value = Math.min(400, totalPnl).toFixed(2);
        const traderPart = (parseFloat(reqAmountInput.value) * 0.80).toFixed(2);
        const splitLabel = document.getElementById('modal-payout-trader-split');
        if (splitLabel) splitLabel.textContent = `$${traderPart}`;
      }

      modalPayout?.classList.add('open');
    });

    // Payout Amount Dynamic Split Calculation
    document.getElementById('po-req-amount')?.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value) || 0;
      const traderPart = (val * 0.80).toFixed(2);
      const label = document.getElementById('modal-payout-trader-split');
      if (label) label.textContent = `$${traderPart}`;
    });

    document.getElementById('form-payout-request')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const reqInput = document.getElementById('po-req-amount');
      const methodInput = document.getElementById('po-req-method');
      const addressInput = document.getElementById('po-req-address');

      const amount = reqInput ? parseFloat(reqInput.value) || 0 : 0;
      const method = methodInput ? methodInput.value : 'USDT (TRC20)';
      const address = addressInput ? addressInput.value.trim() : '';

      const acc = getActiveAccount();
      const totalPnl = Math.max(acc.balance - acc.startingBalance, 0);

      if (amount <= 0 || amount > totalPnl) {
        showToast('Error: Withdrawal amount exceeds available simulated profit balance.');
        return;
      }

      if (!address) {
        showToast('Error: Destination address / account details are required.');
        return;
      }

      const traderPortion = amount * 0.80;
      const newPayout = {
        id: `PO-${Math.floor(1000 + Math.random() * 9000)}`,
        date: new Date().toISOString().split('T')[0],
        amountGross: amount,
        amountTrader: traderPortion,
        method: method,
        status: 'PROCESSING'
      };

      appState.payouts.unshift(newPayout);

      appState.notifications.unshift({
        id: `N-${Date.now()}`,
        title: `Payout request ${newPayout.id} submitted ($${traderPortion.toFixed(2)})`,
        time: 'Just now',
        read: false
      });

      saveState(appState);
      renderDashboard();
      modalPayout?.classList.remove('open');
      showToast(`Payout request for $${traderPortion.toFixed(2)} submitted successfully.`);
    });

    // 12. Support Ticket Submission
    document.getElementById('form-support-ticket')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const subjInput = document.getElementById('sup-subject');
      const catInput = document.getElementById('sup-category');
      const msgInput = document.getElementById('sup-message');

      const subject = subjInput ? subjInput.value.trim() : '';
      const category = catInput ? catInput.value : 'Platform Technical';
      const message = msgInput ? msgInput.value.trim() : '';

      if (!subject || !message) {
        showToast('Please complete all support ticket fields.');
        return;
      }

      const ticketId = `TCK-${Math.floor(100 + Math.random() * 900)}`;
      const newTicket = {
        id: ticketId,
        subject: subject,
        category: category,
        status: 'OPEN // DISPATCHED',
        date: new Date().toISOString().split('T')[0]
      };

      appState.tickets.unshift(newTicket);
      saveState(appState);
      renderSupportTickets();

      if (subjInput) subjInput.value = '';
      if (msgInput) msgInput.value = '';

      showToast(`Ticket ${ticketId} transmitted to technical risk desk.`);
    });

    // 13. Profile Settings Form Submission
    document.getElementById('form-profile-settings')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const nameInput = document.getElementById('set-name');
      const emailInput = document.getElementById('set-email');
      const countryInput = document.getElementById('set-country');

      const nameParts = nameInput ? nameInput.value.trim().split(' ') : ['Trader', 'Analyst'];
      const email = emailInput ? emailInput.value.trim() : appState.session.user.email;
      const country = countryInput ? countryInput.value.trim() : appState.session.user.country;

      appState.session.user.firstName = nameParts[0] || 'Trader';
      appState.session.user.lastName = nameParts.slice(1).join(' ') || 'Analyst';
      appState.session.user.email = email;
      appState.session.user.country = country;

      saveState(appState);
      renderDashboard();
      showToast('Profile and workstation settings saved successfully.');
    });

    // 14. Theme Switcher Controls
    document.querySelectorAll('.theme-choice-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.theme-choice-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const selectedTheme = btn.dataset.setTheme;
        appState.theme = selectedTheme;
        document.body.setAttribute('data-theme', selectedTheme);
        saveState(appState);
        showToast(`Theme switched to ${selectedTheme === 'dark' ? 'Graphite Dark' : 'Technical Light'}`);
      });
    });

    // 15. Rules Health Click Inspector Modals
    const ruleSpecs = {
      daily: {
        title: 'Maximum Daily Drawdown Guardrail',
        body: '<p>The daily drawdown threshold is fixed at <strong>2.0%</strong> (for Standard accounts) calculated against the starting equity/balance at 00:00 UTC watermark.</p><p style="margin-top: 0.75rem;">If closed losses plus floating negative equity reach or exceed this threshold at any moment during the day, the automated risk engine triggers a breach protection halt.</p>'
      },
      max: {
        title: 'Maximum Total Static Drawdown',
        body: '<p>The maximum overall loss is static and set to <strong>4.0%</strong> of the initial account allocation ($400 on a $10K account).</p><p style="margin-top: 0.75rem;">Unlike trailing drawdown models used by predatory firms, our maximum loss limit never trails floating unrealized profits upward.</p>'
      },
      target: {
        title: 'Evaluation Profit Target',
        body: '<p>Step 1 requires a <strong>5% profit target</strong> ($500 on a $10K account). Step 2 requires only <strong>2.5%</strong> ($250).</p><p style="margin-top: 0.75rem;">Upon passing both phases, you graduate to Qualified Analyst status where profit targets are removed completely.</p>'
      },
      days: {
        title: 'Minimum Trading Days',
        body: '<p>The requirement is strictly <strong>1 trading day</strong>. You are not forced to place artificial micro-lot trades for weeks simply to satisfy an outdated time lock.</p>'
      }
    };

    document.querySelectorAll('.rule-mini-row').forEach(row => {
      row.addEventListener('click', () => {
        const key = row.dataset.rule;
        const spec = ruleSpecs[key];
        if (spec) {
          const modal = document.getElementById('modal-rule-inspect');
          const title = document.getElementById('modal-rule-title');
          const body = document.getElementById('modal-rule-body');
          if (title) title.textContent = spec.title;
          if (body) body.innerHTML = spec.body;
          modal?.classList.add('open');
        }
      });
    });

    // 16. Printable Certificate Action
    document.getElementById('btn-print-cert')?.addEventListener('click', () => {
      window.print();
    });

    // 17. Notification Dropdown Toggle & Mark Read
    const notifBtn = document.getElementById('btn-toggle-notifs');
    const notifMenu = document.getElementById('notif-menu');

    notifBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      notifMenu?.classList.toggle('open');
    });

    document.addEventListener('click', (e) => {
      if (!notifMenu?.contains(e.target) && e.target !== notifBtn) {
        notifMenu?.classList.remove('open');
      }
    });

    document.getElementById('btn-mark-all-read')?.addEventListener('click', () => {
      appState.notifications.forEach(n => n.read = true);
      saveState(appState);
      renderNotifications();
      showToast('All notifications marked as read.');
    });

    // 18. FAQ Live Search & Accordion
    const faqInput = document.getElementById('faq-search-input');
    faqInput?.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      document.querySelectorAll('#faq-accordion-list .faq-item').forEach(item => {
        const text = item.textContent.toLowerCase();
        item.style.display = text.includes(query) ? 'block' : 'none';
      });
    });

    document.querySelectorAll('.faq-q').forEach(btn => {
      btn.addEventListener('click', () => {
        const parent = btn.closest('.faq-item');
        const isActive = parent?.classList.contains('active');
        document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
        if (!isActive && parent) {
          parent.classList.add('active');
        }
      });
    });

    // 19. Testimonials Slider Buttons
    const testiTrack = document.getElementById('testimonial-track');
    let testiIndex = 0;
    const totalCards = 3;

    function updateTestimonialSlider() {
      if (!testiTrack) return;
      const card = testiTrack.children[0];
      if (!card) return;
      const cardWidth = card.offsetWidth + 24;
      testiTrack.scrollTo({
        left: testiIndex * cardWidth,
        behavior: 'smooth'
      });
    }

    document.getElementById('btn-testi-prev')?.addEventListener('click', () => {
      testiIndex = Math.max(testiIndex - 1, 0);
      updateTestimonialSlider();
    });

    document.getElementById('btn-testi-next')?.addEventListener('click', () => {
      testiIndex = Math.min(testiIndex + 1, totalCards - 1);
      updateTestimonialSlider();
    });

    // 20. Modal Universal Close Actions
    document.querySelectorAll('[data-close-modal]').forEach(btn => {
      btn.addEventListener('click', () => {
        btn.closest('.modal-backdrop')?.classList.remove('open');
      });
    });

    document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) {
          backdrop.classList.remove('open');
        }
      });
    });

    // Legal / Policy Footer Modal Triggers
    document.querySelectorAll('.modal-trigger[data-modal]').forEach(btn => {
      btn.addEventListener('click', () => {
        const targetId = btn.dataset.modal;
        document.getElementById(targetId)?.classList.add('open');
      });
    });

    document.getElementById('footer-link-support')?.addEventListener('click', () => {
      switchView('dashboard');
      document.querySelector('.sb-item[data-tab="support"]')?.click();
    });

  } // End initializeListeners()

  // ==========================================================================
  // 19. BOOTSTRAP WORKSTATION
  // ==========================================================================
  function bootApplication() {
    renderTerminalSizes();
    updateTerminalSpecs();
    updateCheckoutUI();
    initializeListeners();
    updateDashboardGreeting();
    setInterval(updateDashboardGreeting, 60000);

    // Default to Public Landing View on first load
    switchView('public');
  }

  // Run on DOM Ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootApplication);
  } else {
    bootApplication();
  }

})();