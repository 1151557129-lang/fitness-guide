/* 首页 */
(function () {
  // 渲染部位宫格
  const grid = document.getElementById('bodyPartGrid');
  DATA.bodyParts.forEach(bp => {
    const card = document.createElement('div');
    card.className = 'grid-card';
    card.innerHTML =
      '<span class="ico">' + getBodyPartIcon(bp) + '</span>' +
      '<div class="name">' + getBodyPartName(bp) + '</div>' +
      '<div class="count">' + DATA.bodyPartIndex[bp].length + ' 个动作</div>';
    card.onclick = () => { location.href = 'exercises.html?bodyPart=' + encodeURIComponent(bp); };
    grid.appendChild(card);
  });

  // 渲染热门推荐（随机 8 个）
  const hotList = document.getElementById('hotList');
  const shuffled = DATA.exercises.slice().sort(() => 0.5 - Math.random());
  shuffled.slice(0, 8).forEach(ex => {
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
    hotList.appendChild(item);
  });

  // 搜索
  const searchInput = document.getElementById('searchInput');
  function doSearch() {
    const kw = searchInput.value.trim();
    if (!kw) return;
    location.href = 'exercises.html?search=' + encodeURIComponent(kw);
  }
  document.getElementById('searchBtn').onclick = doSearch;
  searchInput.addEventListener('keyup', e => { if (e.key === 'Enter') doSearch(); });
})();
