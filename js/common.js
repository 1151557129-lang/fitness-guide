/**
 * 健身动作 H5 - 共享工具与中文映射
 */

const APP = {
  bodyPartMap: {
    'back': '背部', 'cardio': '有氧', 'chest': '胸部', 'lower arms': '小臂',
    'lower legs': '小腿', 'neck': '颈部', 'shoulders': '肩部',
    'upper arms': '上臂', 'upper legs': '大腿', 'waist': '腰部'
  },
  equipmentMap: {
    'assisted': '辅助器械', 'band': '弹力带', 'barbell': '杠铃', 'body weight': '自重',
    'bosu ball': '波速球', 'cable': '龙门架', 'dumbbell': '哑铃', 'elliptical machine': '椭圆机',
    'ez barbell': '曲杆杠铃', 'hammer': '锤子', 'kettlebell': '壶铃', 'leverage machine': '杠杆器械',
    'medicine ball': '药球', 'olympic barbell': '奥杆', 'resistance band': '弹力绳', 'roller': '滚轮',
    'rope': '绳索', 'skierg machine': '滑雪机', 'sled machine': '雪橇机', 'smith machine': '史密斯机',
    'stability ball': '瑞士球', 'stationary bike': '动感单车', 'stepmill machine': '台阶机', 'tire': '轮胎',
    'trap bar': '六角杠', 'upper body ergometer': '上肢训练器', 'weighted': '负重', 'wheel roller': '健腹轮'
  },
  bodyPartIcon: {
    'back': '🔙', 'cardio': '🏃', 'chest': '💪', 'lower arms': '🤚',
    'lower legs': '🦵', 'neck': '🦒', 'shoulders': '🏋️',
    'upper arms': '💪', 'upper legs': '🦿', 'waist': '🧘'
  }
};

const DATA = window.EXERCISES_DATA;

function getBodyPartName(bp) { return APP.bodyPartMap[bp] || bp; }
function getEquipmentName(eq) { return APP.equipmentMap[eq] || eq; }
function getBodyPartIcon(bp) { return APP.bodyPartIcon[bp] || '💪'; }

/* ===== 收藏 ===== */
function getFavorites() {
  try { return JSON.parse(localStorage.getItem('fitness_favorites') || '[]'); } catch (e) { return []; }
}
function isFavorite(id) { return getFavorites().indexOf(id) > -1; }
function toggleFavorite(id) {
  const favs = getFavorites();
  const i = favs.indexOf(id);
  if (i > -1) favs.splice(i, 1); else favs.unshift(id);
  localStorage.setItem('fitness_favorites', JSON.stringify(favs));
  return i === -1;
}

/* ===== 浏览历史 ===== */
function getHistory() {
  try { return JSON.parse(localStorage.getItem('fitness_history') || '[]'); } catch (e) { return []; }
}
function addHistory(id) {
  let h = getHistory();
  const i = h.indexOf(id);
  if (i > -1) h.splice(i, 1);
  h.unshift(id);
  if (h.length > 100) h.length = 100;
  localStorage.setItem('fitness_history', JSON.stringify(h));
}

/* ===== URL 参数 ===== */
function getQueryParam(name) {
  return new URLSearchParams(location.search).get(name);
}

/* ===== 动作格式化（列表项通用）===== */
function formatExercise(ex) {
  return {
    ...ex,
    bodyPartName: getBodyPartName(ex.bodyPart),
    equipmentName: getEquipmentName(ex.equipment)
  };
}
