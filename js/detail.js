/* 动作详情 */
(function () {
  const id = getQueryParam('id');
  const el = document.getElementById('detail');

  if (!id) {
    el.innerHTML = '<div class="empty"><span class="ico">❓</span>缺少动作参数</div>';
    return;
  }

  const ex = DATA.exercises.find(e => e.id === id);
  if (!ex) {
    el.innerHTML = '<div class="empty"><span class="ico">❓</span>动作不存在</div>';
    return;
  }

  addHistory(id);

  const steps = (ex.instructions || []).map((s, i) =>
    '<div class="step"><span class="num">' + (i + 1) + '</span><p>' + s + '</p></div>'
  ).join('');

  const secondary = (ex.secondaryMuscles || []).map(getBodyPartName).join('、') || '无';

  const gifHtml = ex.mediaId
    ? '<img class="gif" src="https://static.exercisedb.dev/media/' + ex.mediaId + '.gif" ' +
      'alt="' + ex.name + '" loading="lazy" ' +
      'onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'flex\';" ' +
      'onload="this.style.display=\'block\';">' +
      '<div class="gif-fallback" style="display:none;">' + getBodyPartIcon(ex.bodyPart) + '</div>'
    : '<div class="gif-fallback">' + getBodyPartIcon(ex.bodyPart) + '</div>';

  el.innerHTML =
    gifHtml +
    '<h2>' + ex.name + '</h2>' +
    '<div class="tags">' +
      '<span class="tag">' + getBodyPartName(ex.bodyPart) + '</span>' +
      '<span class="tag">' + getEquipmentName(ex.equipment) + '</span>' +
      '<span class="tag secondary">目标：' + (ex.target || '—') + '</span>' +
      '<span class="tag secondary">肌群：' + (ex.muscleGroup || '—') + '</span>' +
      '<span class="tag secondary">辅助：' + secondary + '</span>' +
    '</div>' +
    '<button id="favBtn" class="fav-btn' + (isFavorite(id) ? ' active' : '') + '">' +
      (isFavorite(id) ? '❤️ 已收藏' : '🤍 收藏') +
    '</button>' +
    '<div class="steps"><h3>📋 动作步骤</h3>' +
      (steps || '<p style="color:#8e8e93;">暂无步骤说明</p>') +
    '</div>' +
    '<div class="section-title" style="padding-left:0;">相关动作</div>' +
    '<div class="ex-list" id="relatedList" style="padding-left:0;"></div>';

  // 收藏按钮
  document.getElementById('favBtn').onclick = function () {
    const added = toggleFavorite(id);
    this.textContent = added ? '❤️ 已收藏' : '🤍 收藏';
    this.className = 'fav-btn' + (added ? ' active' : '');
  };

  // 相关动作（同部位）
  const ids = DATA.bodyPartIndex[ex.bodyPart] || [];
  const relatedList = document.getElementById('relatedList');
  ids.filter(x => x !== id).slice(0, 6).forEach(rid => {
    const r = DATA.exercises.find(e => e.id === rid);
    if (!r) return;
    const item = document.createElement('div');
    item.className = 'ex-card';
    item.innerHTML =
      '<div class="thumb">' + getBodyPartIcon(r.bodyPart) + '</div>' +
      '<div class="info">' +
        '<div class="name">' + r.name + '</div>' +
        '<div class="meta">' + getBodyPartName(r.bodyPart) + ' · ' + getEquipmentName(r.equipment) + '</div>' +
      '</div>' +
      '<span class="arrow">›</span>';
    item.onclick = () => { location.href = 'detail.html?id=' + encodeURIComponent(r.id); };
    relatedList.appendChild(item);
  });
})();
