function toISO(d){
      var tz = d.getTimezoneOffset()*60000;
      return new Date(d - tz).toISOString().slice(0,10);
    }
    function parseISO(s){
      var p = s.split('-');
      return new Date(parseInt(p[0]), parseInt(p[1])-1, parseInt(p[2]));
    }
    function addDays(d,n){ var x=new Date(d); x.setDate(d.getDate()+n); return x }
    function startOfWeek(d){
      if(!d) d = new Date();
      var base = new Date(d.getFullYear(), d.getMonth(), d.getDate());
      var day = base.getDay(); // 0=Sun
      base.setDate(base.getDate()-day);
      return base;
    }

    // Week start kept in localStorage so "Next Week (Reset)" moves everyone together
    var WEEK_KEY = 'habits-weekStart';
    function getWeekStart(){
      var v = localStorage.getItem(WEEK_KEY);
      if(v){ return parseISO(v); }
      var s = startOfWeek(new Date());
      localStorage.setItem(WEEK_KEY, toISO(s));
      return s;
    }
    function setWeekStart(date){ localStorage.setItem(WEEK_KEY, toISO(date)); }

    function weekDates(){
      var dates = [];
      var s = getWeekStart();
      for(var i=0;i<7;i++){ dates.push(toISO(addDays(s,i))); }
      return dates;
    }

    // Basic localStorage layer (novice)
    var KEY='habits-v1';
    function load(){
      var raw = localStorage.getItem(KEY);
      if(!raw) return [];
      try{ return JSON.parse(raw); }catch(e){ return []; }
    }
    function save(list){ localStorage.setItem(KEY, JSON.stringify(list)); }

    // DOM refs
    var els = {
      form:document.getElementById('newHabitForm'),
      name:document.getElementById('habitName'),
      target:document.getElementById('habitTarget'),
      list:document.getElementById('habitList'),
      daysHeader:document.getElementById('daysHeader'),
      weekLabel:document.getElementById('weekLabel'),
      resetBtn:document.getElementById('resetBtn'),
      tpl:document.getElementById('habitRowTpl'),
      historyDlg:document.getElementById('historyDialog'),
      historyBody:document.getElementById('historyContent')
    };

    function renderDaysHeader(){
      var days = weekDates();
      var grid = document.createElement('div');
      grid.className = 'grid grid-cols-7 gap-2';
      for(var i=0;i<days.length;i++){
        var d = days[i];
        var div = document.createElement('div');
        div.className='text-center';
        div.textContent = parseISO(d).toLocaleDateString(undefined,{weekday:'short'});
        grid.appendChild(div);
      }
      els.daysHeader.innerHTML='';
      els.daysHeader.appendChild(document.createElement('div'));
      els.daysHeader.appendChild(grid);
      els.daysHeader.appendChild(document.createElement('div'));
    }

    function setWeekLabel(){
      var s = getWeekStart();
      els.weekLabel.textContent = 'Week of ' + s.toLocaleDateString();
    }

    function weeklyCount(h){
      var sISO = toISO(getWeekStart());
      var eISO = toISO(addDays(getWeekStart(),6));
      var cnt = 0;
      var arr = h.datesCompleted || [];
      for(var i=0;i<arr.length;i++){
        var d = arr[i];
        if(d>=sISO && d<=eISO) cnt++;
      }
      return cnt;
    }

    function render(){
      renderDaysHeader();
      setWeekLabel();
      var habits = load();
      els.list.innerHTML='';

      if(habits.length===0){
        var p=document.createElement('p');
        p.className='text-slate-400';
        p.textContent='No habits yet';
        els.list.appendChild(p);
        els.resetBtn.classList.add('hidden');
        return;
      }

      var days = weekDates();
      var anyMet = false;

      for(var hIndex=0; hIndex<habits.length; hIndex++){
        var h = habits[hIndex];
        if(typeof h.streak !== 'number') h.streak = 0;
        if(typeof h.perWeekTarget !== 'number') h.perWeekTarget = parseInt(h.perWeekTarget||1,10);
        if(!h.datesCompleted) h.datesCompleted = [];

        var node = els.tpl.content.cloneNode(true);
        var row = node.firstElementChild;
        row.querySelector('.habit-title').textContent = h.name;

        var w = weeklyCount(h);
        row.querySelector('.habit-stats').textContent = 'Weekly: ' + w + '/' + h.perWeekTarget + ' • Max Streak: ' + h.streak;

        if(w >= h.perWeekTarget){
          row.classList.remove('bg-slate-800','border-slate-800');
          row.classList.add('bg-emerald-900/40','border-emerald-700');
          anyMet = true;
        }

        var grid = row.querySelector('.habit-grid');
        for(var dIndex=0; dIndex<days.length; dIndex++){
          var dayISO = days[dIndex];
          var cell = document.createElement('div');
          cell.className = 'flex flex-col items-center gap-1';
          var cb = document.createElement('input');
          cb.type='checkbox';
          cb.className='w-6 h-6 rounded-md border border-slate-600 bg-slate-900';
          cb.checked = h.datesCompleted.indexOf(dayISO) !== -1;
          (function(hid, iso){
            cb.addEventListener('change', function(){
              var list = load();
              var me = null;
              for(var j=0;j<list.length;j++){ if(list[j].id===hid){ me=list[j]; break; } }
              if(!me.datesCompleted) me.datesCompleted=[];
              var k = me.datesCompleted.indexOf(iso);
              if(k>=0) me.datesCompleted.splice(k,1); else me.datesCompleted.push(iso);
              save(list);
              render();
            });
          })(h.id, dayISO);

          var label = document.createElement('span');
          label.className='text-[10px] text-slate-400';
          label.textContent = parseISO(dayISO).toLocaleDateString(undefined,{month:'numeric',day:'numeric'});
          cell.appendChild(cb);
          cell.appendChild(label);
          grid.appendChild(cell);
        }

        // actions
        row.querySelector('[data-action="delete"]').addEventListener('click', (function(hid){ return function(){
          if(confirm('Delete habit?')){
            var list = load();
            var next=[]; for(var ii=0; ii<list.length; ii++){ if(list[ii].id!==hid) next.push(list[ii]); }
            save(next); render();
          }
        }})(h.id));

        row.querySelector('[data-action="edit"]').addEventListener('click', (function(hid){ return function(){
          var name = prompt('Rename habit:', h.name);
          if(name===null) return;
          var t = prompt('Target per week (1-7):', h.perWeekTarget);
          if(t===null) return;
          var list = load();
          for(var jj=0;jj<list.length;jj++){
            if(list[jj].id===hid){
              list[jj].name = (name.trim()? name.trim(): list[jj].name);
              var num = parseInt(t,10); if(isNaN(num)) num=list[jj].perWeekTarget; num=Math.max(1,Math.min(7,num));
              list[jj].perWeekTarget = num;
              break;
            }
          }
          save(list); render();
        }})(h.id));

        row.querySelector('[data-action="history"]').addEventListener('click', (function(hid){ return function(){
          var list = load(); var me=null; for(var x=0;x<list.length;x++){ if(list[x].id===hid){ me=list[x]; break; } }
          var arr = (me && me.datesCompleted)? me.datesCompleted.slice(0) : [];
          arr.sort();
          if(arr.length===0){ els.historyBody.innerHTML='<div>No history</div>'; }
          else{
            var html='';
            for(var t2=0;t2<arr.length;t2++){ html += '<div>' + parseISO(arr[t2]).toLocaleDateString() + '</div>'; }
            els.historyBody.innerHTML = html;
          }
          els.historyDlg.showModal();
        }})(h.id));

        els.list.appendChild(row);
      }

      if(anyMet) els.resetBtn.classList.remove('hidden'); else els.resetBtn.classList.add('hidden');
    }

    // Add habit
    els.form.addEventListener('submit', function(ev){
      ev.preventDefault();
      var name = els.name.value.trim(); if(!name) return;
      var t = parseInt(els.target.value,10); if(isNaN(t)) t=1;
      var list = load();
      list.push({ id: String(Date.now()), name: name, perWeekTarget: t, datesCompleted: [], streak: 0 });
      save(list);
      els.form.reset();
      render();
    });

    // Reset week
    els.resetBtn.addEventListener('click', function(){
      var list = load();
      var sISO = toISO(getWeekStart());
      var eISO = toISO(addDays(getWeekStart(),6));
      for(var i=0;i<list.length;i++){
        var h = list[i];
        var done = 0;
        for(var j=0;j<h.datesCompleted.length;j++){
          var d = h.datesCompleted[j];
          if(d>=sISO && d<=eISO) done++;
        }
        if(done >= h.perWeekTarget){ h.streak = (h.streak||0) + 1; }
        h.datesCompleted = [];
      }
      setWeekStart(addDays(getWeekStart(),7));
      save(list);
      render();
    });

    // Initial render
    render();