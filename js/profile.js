/* 我的：收藏 + 历史 */
(function () {
  let activeTab = 'fav';

  // 统计
  document.getElementById('statTotal').textContent = DATA.total;
  document.getElementById('statFav').textContent = getFavorites().length;
  document.getElementById('statHist').textContent = getHistory().length;

  // Tab 切换
  const tabs = document.querySelectorAll('.tab');
  tabs.forEach(t => {
    t.onclick = () => {
      tabs.forEach(x => x.className = 'tab');
      t.className = 'tab active';
      activeTab = t.dataset.tab;
      render();
    };
  });

  function render() {
    const list = document.getElementById('exList');
    list.innerHTML = '';
    document.getElementById('clearHistBtn').style.display = activeTab === 'hist' ? 'inline-block' : 'none';

    const ids = activeTab === 'fav' ? getFavorites() : getHistory().slice(0, 30);
    const exercises = ids
      .map(id => DATA.exercises.find(e => e.id === id))
      .filter(Boolean);

    if (exercises.length === 0) {
      const msg = activeTab === 'fav'
        ? '<span class="ico">❤️</span>还没有收藏，去收藏喜欢的动作吧'
        : '<span class="ico">🕘</span>还没有浏览记录';
      list.innerHTML = '<div class="empty">' + msg + '</div>';
      return;
    }

    exercises.forEach(ex => {
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
      list.appendChild(item);
    });
  }

  // 清除历史
  document.getElementById('clearHistBtn').onclick = () => {
    if (confirm('确定清除所有浏览历史吗？')) {
      localStorage.setItem('fitness_history', '[]');
      document.getElementById('statHist').textContent = '0';
      render();
    }
  };

  render();
})();
