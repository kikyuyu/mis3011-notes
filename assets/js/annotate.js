/* ============================================================
   MIS3011 学习站 · 「我的标记」插件
   选中文字 → 高亮 + 备注 → localStorage 持久化
   右下角面板按页面分组查看、跳转、导出/导入
   ============================================================ */
(function () {
  var STORE_KEY = 'mis3011_marks_v1';
  var marks = load();
  var pendingFlash = sessionStorage.getItem('mis3011_flash');
  sessionStorage.removeItem('mis3011_flash');

  function load() {
    try { return JSON.parse(localStorage.getItem(STORE_KEY)) || []; }
    catch (e) { return []; }
  }
  function save() {
    localStorage.setItem(STORE_KEY, JSON.stringify(marks));
    updateBadge();
  }
  function route() { return location.hash.slice(1) || '/'; }
  function esc(s) {
    return s.replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }
  function uid() { return 'm' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }

  /* ---------- DOM：悬浮按钮 + 面板 + 工具条 + 备注弹窗 ---------- */
  function buildUI() {
    if (document.getElementById('my-marks-btn')) return;

    var btn = document.createElement('button');
    btn.id = 'my-marks-btn';
    btn.innerHTML = '✏️ 我的标记 <span class="badge">0</span>';
    btn.onclick = togglePanel;
    document.body.appendChild(btn);

    var panel = document.createElement('div');
    panel.id = 'marks-panel';
    panel.innerHTML =
      '<div class="mp-head"><b>我的标记</b>' +
      '<div class="mp-actions">' +
      '<button id="mp-export">导出</button>' +
      '<button id="mp-import">导入</button>' +
      '<button id="mp-close">✕</button>' +
      '</div></div>' +
      '<div class="mp-body" id="mp-body"></div>';
    document.body.appendChild(panel);

    panel.querySelector('#mp-close').onclick = togglePanel;
    panel.querySelector('#mp-export').onclick = exportJSON;
    panel.querySelector('#mp-import').onclick = importJSON;

    var toolbar = document.createElement('div');
    toolbar.id = 'hl-toolbar';
    toolbar.innerHTML =
      '<span class="hl-btn" data-c="hl-yellow" style="background:#f2c56c"></span>' +
      '<span class="hl-btn" data-c="hl-green" style="background:#6dd9a4"></span>' +
      '<span class="hl-btn" data-c="hl-blue" style="background:#56ccf2"></span>' +
      '<span class="hl-btn" data-c="hl-pink" style="background:#f27dc4"></span>' +
      '<span class="hl-note-btn">📝 备注</span>';
    document.body.appendChild(toolbar);

    var modal = document.createElement('div');
    modal.id = 'hl-note-modal';
    modal.innerHTML =
      '<div class="modal-box">' +
      '<div style="color:#fff;font-weight:600;margin-bottom:10px">📝 添加备注（可选）</div>' +
      '<textarea placeholder="写点你自己的理解…"></textarea>' +
      '<div class="modal-actions">' +
      '<button class="btn-del" style="display:none">删除标记</button>' +
      '<button class="btn-cancel">取消</button>' +
      '<button class="btn-save">保存</button>' +
      '</div></div>';
    document.body.appendChild(modal);

    // 点击工具条颜色
    toolbar.querySelectorAll('.hl-btn').forEach(function (b) {
      b.onclick = function () { applyHighlight(b.dataset.c, null); };
    });
    toolbar.querySelector('.hl-note-btn').onclick = function () { openNoteModal(); };
    modal.querySelector('.btn-cancel').onclick = closeNoteModal;
    modal.querySelector('.btn-save').onclick = saveNote;
    modal.addEventListener('mousedown', function (e) {
      if (e.target === modal) closeNoteModal();
    });
    // 点击已有高亮 → 编辑备注/删除
    document.addEventListener('click', function (e) {
      var span = e.target.closest && e.target.closest('.hl');
      if (span && !document.getElementById('hl-toolbar').contains(e.target)) {
        e.stopPropagation();
        editMark(span);
      }
    }, true);

    // 选中文字 → 显示工具条
    document.addEventListener('mouseup', function (e) {
      setTimeout(function () {
        if (modal.classList.contains('open')) return;
        var sel = window.getSelection();
        var toolbarEl = document.getElementById('hl-toolbar');
        if (!sel || sel.isCollapsed || !sel.toString().trim()) { hideToolbar(); return; }
        var node = sel.anchorNode;
        if (!node || !node.parentNode || !node.parentNode.closest('.markdown-section')) { hideToolbar(); return; }
        if (node.parentNode.closest('.hl')) { hideToolbar(); return; } // 已在高亮内
        var rect = sel.getRangeAt(0).getBoundingClientRect();
        toolbarEl.style.display = 'flex';
        toolbarEl.style.top = (rect.top + window.scrollY - 46) + 'px';
        toolbarEl.style.left = (rect.left + window.scrollX) + 'px';
      }, 10);
    });
    document.addEventListener('mousedown', function (e) {
      var t = document.getElementById('hl-toolbar');
      if (t.style.display === 'flex' && !t.contains(e.target)) hideToolbar();
    });
  }

  function hideToolbar() { document.getElementById('hl-toolbar').style.display = 'none'; }
  function togglePanel() {
    var p = document.getElementById('marks-panel');
    p.classList.toggle('open');
    if (p.classList.contains('open')) renderPanel();
  }

  /* ---------- 高亮逻辑 ---------- */
  var currentRange = null;

  document.addEventListener('mouseup', function () {
    var sel = window.getSelection();
    if (sel && !sel.isCollapsed && sel.rangeCount) {
      var node = sel.anchorNode;
      if (node && node.parentNode && node.parentNode.closest('.markdown-section') && !node.parentNode.closest('.hl')) {
        currentRange = sel.getRangeAt(0).cloneRange();
      }
    }
  });

  function applyHighlight(color, note, existingId) {
    var toolbar = document.getElementById('hl-toolbar');
    var range = currentRange;
    if (!range) return;
    var text = range.toString();
    if (!text.trim()) return;
    try {
      var span = document.createElement('span');
      span.className = 'hl ' + color;
      span.dataset.id = existingId || uid();
      try { range.surroundContents(span); }
      catch (err) { // 跨节点时取纯文本包裹
        span.textContent = text;
        range.deleteContents();
        range.insertNode(span);
      }
      marks.push({
        id: span.dataset.id, route: route(), color: color,
        text: text.slice(0, 200), note: note || '', ts: Date.now()
      });
      save();
      hideToolbar();
      window.getSelection().removeAllRanges();
    } catch (e) { /* ignore */ }
  }

  /* ---------- 备注弹窗 ---------- */
  var editingId = null;
  function openNoteModal(id) {
    editingId = id || null;
    var modal = document.getElementById('hl-note-modal');
    var ta = modal.querySelector('textarea');
    var delBtn = modal.querySelector('.btn-del');
    if (id) {
      var m = marks.find(function (x) { return x.id === id; });
      ta.value = m ? (m.note || '') : '';
      delBtn.style.display = 'inline-block';
    } else {
      ta.value = '';
      delBtn.style.display = 'none';
    }
    modal.classList.add('open');
    ta.focus();
  }
  function closeNoteModal() {
    document.getElementById('hl-note-modal').classList.remove('open');
    editingId = null;
    hideToolbar();
  }
  function saveNote() {
    var note = document.getElementById('hl-note-modal').querySelector('textarea').value.trim();
    if (editingId) {
      var m = marks.find(function (x) { return x.id === editingId; });
      if (m) { m.note = note; save(); reapply(); renderPanel(); }
    } else {
      // 工具条打开期间先保存的临时高亮？——此分支仅在编辑既有标记时使用
      applyHighlight('hl-yellow', note);
    }
    closeNoteModal();
  }
  // 删除按钮
  document.addEventListener('click', function (e) {
    if (e.target && e.target.id === 'hl-note-modal' && e.target.classList.contains('btn-del')) return;
  });
  // bind del inside modal
  var _observer = new MutationObserver(function () {
    var del = document.querySelector('#hl-note-modal .btn-del');
    if (del && !del.dataset.bound) {
      del.dataset.bound = '1';
      del.onclick = function () {
        if (editingId) { deleteMark(editingId); closeNoteModal(); }
      };
    }
  });
  _observer.observe(document.body, { childList: true, subtree: true });

  function editMark(span) {
    var id = span.dataset.id;
    var m = marks.find(function (x) { return x.id === id; });
    if (!m) return;
    openNoteModal(id);
  }

  function deleteMark(id) {
    marks = marks.filter(function (x) { return x.id !== id; });
    save();
    reapply();
    renderPanel();
  }

  /* ---------- 重新应用当前页的高亮 ---------- */
  function reapply() {
    var root = document.querySelector('.markdown-section');
    if (!root) return;
    // 先清理旧高亮（还原为纯文本）
    root.querySelectorAll('span.hl').forEach(function (s) {
      s.replaceWith(document.createTextNode(s.textContent));
    });
    root.normalize();
    var pageMarks = marks.filter(function (m) { return m.route === route(); });
    pageMarks.forEach(function (m) {
      wrapText(root, m);
    });
    if (pendingFlash) {
      var el = document.querySelector('.hl[data-id="' + pendingFlash + '"]');
      if (el) {
        setTimeout(function () {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          el.classList.add('hl-flash');
        }, 300);
      }
      pendingFlash = null;
    }
  }

  // 在 DOM 树中找到 mark.text 的首次出现并包裹 span
  function wrapText(root, m) {
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
    var node;
    while (node = walker.nextNode()) {
      if (node.parentNode.closest('.hl')) continue;
      var idx = node.nodeValue.indexOf(m.text);
      if (idx === -1) continue;
      var range = document.createRange();
      range.setStart(node, idx);
      range.setEnd(node, idx + m.text.length);
      var span = document.createElement('span');
      span.className = 'hl ' + m.color;
      span.dataset.id = m.id;
      try { range.surroundContents(span); } catch (e) { return; }
      if (m.note) {
        var flag = document.createElement('span');
        flag.className = 'hl-note-flag';
        flag.textContent = '📝';
        flag.title = m.note;
        span.after(flag);
      }
      return;
    }
  }

  /* ---------- 面板 ---------- */
  function groupTitle(r) {
    var map = {
      '/': '首页 · 课程导览',
      '/modules/wk1-overview': 'WK1 · 课程导览',
      '/modules/wk2-foundations': 'WK2 · AI 系统基础',
      '/modules/wk3-decision-ai': 'WK3 · Decision AI',
      '/modules/wk4-neural-networks': 'WK4 · 神经网络与深度学习',
      '/modules/wk6-language-ai-1': 'WK6 · Language AI (1)',
      '/modules/wk7-language-ai-2': 'WK7 · Language AI (2)',
      '/modules/wk8-building-llm-systems': 'WK8 · Building LLM Systems',
      '/modules/wk9-grounding-llms': 'WK9 · Grounding LLMs',
      '/modules/labs-assignments': 'Lab & 作业考点',
      '/modules/exam-sprint': '考前冲刺',
      '/modules/checklist': '知识点总清单'
    };
    return map[r] || r;
  }

  function renderPanel() {
    var body = document.getElementById('mp-body');
    if (!marks.length) {
      body.innerHTML = '<div class="mp-empty">还没有标记<br>选中文字即可高亮 ✨</div>';
      return;
    }
    var byRoute = {};
    marks.forEach(function (m) { (byRoute[m.route] = byRoute[m.route] || []).push(m); });
    var html = '';
    Object.keys(byRoute).forEach(function (r) {
      html += '<div class="mp-group-title">' + esc(groupTitle(r)) + '（' + byRoute[r].length + '）</div>';
      byRoute[r].forEach(function (m) {
        html += '<div class="mp-item" data-id="' + m.id + '" data-route="' + esc(m.route) + '">' +
          '<span class="mp-del" data-del="' + m.id + '">✕</span>' +
          '<span class="mp-text" style="border-bottom:3px solid ' + colorOf(m.color) + '">' + esc(m.text) + '</span>' +
          (m.note ? '<span class="mp-note">📝 ' + esc(m.note) + '</span>' : '') +
          '</div>';
      });
    });
    body.innerHTML = html;
    body.querySelectorAll('.mp-item').forEach(function (item) {
      item.onclick = function (e) {
        if (e.target.dataset.del) return;
        var r = item.dataset.route, id = item.dataset.id;
        if (r === route()) {
          var el = document.querySelector('.hl[data-id="' + id + '"]');
          if (el) { el.scrollIntoView({ behavior: 'smooth', block: 'center' }); el.classList.add('hl-flash'); }
        } else {
          sessionStorage.setItem('mis3011_flash', id);
          location.hash = '#' + r;
        }
      };
    });
    body.querySelectorAll('.mp-del').forEach(function (d) {
      d.onclick = function (e) { e.stopPropagation(); deleteMark(d.dataset.del); };
    });
  }
  function colorOf(c) {
    return { 'hl-yellow': '#f2c56c', 'hl-green': '#6dd9a4', 'hl-blue': '#56ccf2', 'hl-pink': '#f27dc4' }[c] || '#4f8cff';
  }

  function updateBadge() {
    var b = document.querySelector('#my-marks-btn .badge');
    if (b) b.textContent = marks.length;
  }

  function exportJSON() {
    var blob = new Blob([JSON.stringify(marks, null, 2)], { type: 'application/json' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'mis3011_marks.json';
    a.click();
  }
  function importJSON() {
    var inp = document.createElement('input');
    inp.type = 'file'; inp.accept = '.json';
    inp.onchange = function () {
      var f = inp.files[0];
      if (!f) return;
      var rd = new FileReader();
      rd.onload = function () {
        try {
          var data = JSON.parse(rd.result);
          if (Array.isArray(data)) { marks = marks.concat(data); save(); reapply(); renderPanel(); }
        } catch (e) { alert('导入失败：文件格式不正确'); }
      };
      rd.readAsText(f);
    };
    inp.click();
  }

  /* ---------- 挂载到 docsify ---------- */
  var plugin = function (hook) {
    hook.doneEach(function () {
      buildUI();
      updateBadge();
      reapply();
    });
  };
  window.$docsify = window.$docsify || {};
  window.$docsify.plugins = [].concat(window.$docsify.plugins || [], plugin);
})();
