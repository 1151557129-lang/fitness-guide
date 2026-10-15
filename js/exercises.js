/* 动作库：筛选 + 搜索 + 分批加载 */
(function () {
  const state = {
    bodyPart: getQueryParam('bodyPart') || '',
    equipment: '',
    search: getQueryParam('search') || '',
    filtered: [],
    shown: 0,
    pageSize: 50
  };

  const searchInput = document.getElementById('searchInput');
  const bpChips = document.getElementById('bodyPartChips');
  const eqChips = document.getElementById('equipmentChips');
  const exList = document.getElementById('exList');
  const resultCount = document.getElementById('resultCount');
  const loadMoreBtn = document.getElementById('loadMoreBtn');

  searchInput.value = state.search;

  // 生成一个 chip 元素
  function createChip(text, active, onClick) {
    const c = document.createElement('span');
    c.className = 'chip' + (active ? ' active' : '');
    c.textContent = text;
    c.onclick = onClick;
    return c;
  }

  // 渲染筛选 chips（同时刷新高亮状态）
  function renderChips() {
    bpChips.innerHTML = '';
    bpChips.appendChild(createChip('全部部位', state.bodyPart === '', () => {
      state.bodyPart = '';
      applyFilter();
    }));
    DATA.bodyParts.forEach(bp => {
      bpChips.appendChild(createChip(getBodyPartName(bp), state.bodyPart === bp, () => {
        state.bodyPart = bp;
        applyFilter();
      }));
    });

    eqChips.innerHTML = '';
    eqChips.appendChild(createChip('全部器械', state.equipment === '', () => {
      state.equipment = '';
      applyFilter();
    }));
    DATA.equipments.forEach(eq => {
      eqChips.appendChild(createChip(getEquipmentName(eq), state.equipment === eq, () => {
        state.equipment = eq;
        applyFilter();
      }));
    });
  }

  // 过滤 + 重新渲染
  function applyFilter() {
    let result = DATA.exercises;

    if (state.bodyPart) {
      const ids = new Set(DATA.bodyPartIndex[state.bodyPart] || []);
      result = result.filter(ex => ids.has(ex.id));
    }
    if (state.equipment) {
      result = result.filter(ex => ex.equipment === state.equipment);
    }
    if (state.search) {
      const kw = state.search.toLowerCase();
      result = result.filter(ex =>
        (ex.name && ex.name.toLowerCase().indexOf(kw) > -1) ||
        (ex.target && ex.target.toLowerCase().indexOf(kw) > -1) ||
        (ex.muscleGroup && ex.muscleGroup.toLowerCase().indexOf(kw) > -1) ||
        (ex.equipment && ex.equipment.toLowerCase().indexOf(kw) > -1) ||
        (ex.originalName && ex.originalName.toLowerCase().indexOf(kw) > -1)
      );
    }

    state.filtered = result;
    state.shown = 0;
    exList.innerHTML = '';
    resultCount.textContent = '共 ' + result.length + ' 个动作';
    renderChips();
    renderList();
  }

  // 分批渲染
  function renderList() {
    if (state.filtered.length === 0) {
      exList.innerHTML = '<div class="empty"><span class="ico">🔍</span>没有找到匹配的动作</div>';
      loadMoreBtn.style.display = 'none';
      return;
    }

    const next = state.filtered.slice(state.shown, state.shown + state.pageSize);
    state.shown += next.length;

    next.forEach(ex => {
      const item = document.createElement('div');
      item.className = 'ex-card';
      item.innerHTML =
        '<div class="thumb">' + getBodyPartIcon(ex.bodyPart) + '</div>' +
        '<div class="info">' +
          '<div class="name">' + ex.name + '</div>' +
          '<div class="meta">' + getBodyPartName(ex.bodyPart) + ' · ' + getEquipmentName(ex.equipment) + '</div>' +
        '</div>' +
        '<span class="arrow">›</span>';
      item.onclick = () => { location.href = 'detail.html?id=' + encodeURIComponent(ex.id); };
      exList.appendChild(item);
    });

    if (state.shown >= state.filtered.length) {
      loadMoreBtn.style.display = 'none';
    } else {
      loadMoreBtn.style.display = 'inline-block';
      loadMoreBtn.textContent = '加载更多（已显示 ' + state.shown + ' / ' + state.filtered.length + '）';
    }
  }

  loadMoreBtn.onclick = () => renderList();

  function doSearch() {
    state.search = searchInput.value.trim();
    applyFilter();
  }
  document.getElementById('searchBtn').onclick = doSearch;
  searchInput.addEventListener('keyup', e => { if (e.key === 'Enter') doSearch(); });

  // 初始化
  renderChips();
  applyFilter();
})();
