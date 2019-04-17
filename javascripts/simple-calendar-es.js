
class LunarHelp {
  constructor(year,month,day) {
    this.lunarInfo = new Array(
        0x04bd8, 0x04ae0, 0x0a570, 0x054d5, 0x0d260, 0x0d950, 0x16554, 0x056a0, 0x09ad0, 0x055d2,
        0x04ae0, 0x0a5b6, 0x0a4d0, 0x0d250, 0x1d255, 0x0b540, 0x0d6a0, 0x0ada2, 0x095b0, 0x14977,
        0x04970, 0x0a4b0, 0x0b4b5, 0x06a50, 0x06d40, 0x1ab54, 0x02b60, 0x09570, 0x052f2, 0x04970,
        0x06566, 0x0d4a0, 0x0ea50, 0x06e95, 0x05ad0, 0x02b60, 0x186e3, 0x092e0, 0x1c8d7, 0x0c950,
        0x0d4a0, 0x1d8a6, 0x0b550, 0x056a0, 0x1a5b4, 0x025d0, 0x092d0, 0x0d2b2, 0x0a950, 0x0b557,
        0x06ca0, 0x0b550, 0x15355, 0x04da0, 0x0a5d0, 0x14573, 0x052d0, 0x0a9a8, 0x0e950, 0x06aa0,
        0x0aea6, 0x0ab50, 0x04b60, 0x0aae4, 0x0a570, 0x05260, 0x0f263, 0x0d950, 0x05b57, 0x056a0,
        0x096d0, 0x04dd5, 0x04ad0, 0x0a4d0, 0x0d4d4, 0x0d250, 0x0d558, 0x0b540, 0x0b5a0, 0x195a6,
        0x095b0, 0x049b0, 0x0a974, 0x0a4b0, 0x0b27a, 0x06a50, 0x06d40, 0x0af46, 0x0ab60, 0x09570,
        0x04af5, 0x04970, 0x064b0, 0x074a3, 0x0ea50, 0x06b58, 0x055c0, 0x0ab60, 0x096d5, 0x092e0,
        0x0c960, 0x0d954, 0x0d4a0, 0x0da50, 0x07552, 0x056a0, 0x0abb7, 0x025d0, 0x092d0, 0x0cab5,
        0x0a950, 0x0b4a0, 0x0baa4, 0x0ad50, 0x055d9, 0x04ba0, 0x0a5b0, 0x15176, 0x052b0, 0x0a930,
        0x07954, 0x06aa0, 0x0ad50, 0x05b52, 0x04b60, 0x0a6e6, 0x0a4e0, 0x0d260, 0x0ea65, 0x0d530,
        0x05aa0, 0x076a3, 0x096d0, 0x04bd7, 0x04ad0, 0x0a4d0, 0x1d0b6, 0x0d250, 0x0d520, 0x0dd45,
        0x0b5a0, 0x056d0, 0x055b2, 0x049b0, 0x0a577, 0x0a4b0, 0x0aa50, 0x1b255, 0x06d20, 0x0ada0)

    this.nStr1 = new Array('日', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十');
    this.nStr2 = new Array('初', '十', '廿', '三');

    let date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))

    let i, leap = 0,
        temp = 0;//天数
    let baseDate = new Date(1900, 0, 31);
    let offset = (date - baseDate) / 86400000;


    //计算年数
    for (i = 1900; i < 2050 && (offset-this.lYearDays(i)) > 0; i++) {
      offset -= this.lYearDays(i)
    }

    this.year = i
    leap = this.leapMonth(i) //闰哪个月
    this.isLeap = false


    //计算月数
    for (i = 1; i < 13 && offset > 0; i++) {
      //闰月
      if (leap > 0 && i == (leap + 1) && this.isLeap == false) {
        --i;
        temp = this.leapDays(this.year);
      } else {
        temp = this.monthDays(this.year, i);
      }

      //解除闰月
      if (this.isLeap == true && i == (leap + 1)) this.isLeap = false

      offset -= temp
    }

    //如果恰好减完了，不是闰月的话月数减1
    if (offset == 0 && leap > 0 && i == leap + 1)
      if (this.isLeap) {
        this.isLeap = false;
      } else {
        this.isLeap = true;
        --i;
      }

    if (offset < 0) {
      offset += temp;
      --i;
    }

    this.month = i
    //最后剩余的就是日期
    this.day = offset + 1
  }

  // 获取y年的总天数
  lYearDays(year) {
    let i, sum = 0 ;
    for (i = 0x8000; i > 0x8; i >>= 1)
      sum += (this.lunarInfo[year - 1900] & i) ? 30 : 29
    return (sum + this.leapDays(year)) //最后在加上可能有的闰年的闰月
  }

  //获取闰年闰月的天数 闰大月还是小月
  leapDays(year) {
    if (this.leapMonth(year))
      return ((this.lunarInfo[year - 1900] & 0x10000) ? 30 : 29)
    else
      return 0;
  }

  //获取闰年闰哪个月1-12 ,没闰传回 0
  leapMonth(year) {
    return (this.lunarInfo[year - 1900] & 0xf)
  }

  //获取y年m月的总天数 正常月
  monthDays(year, month) {
    return ((this.lunarInfo[year - 1900] & (0x10000 >> month)) ? 30 : 29)
  }

  //中文日期
  cDay(d) {
    let s;

    d = Math.round(d);
    switch (d) {
      case 10:
        s = '初十';
        break;
      case 20:
        s = '二十';
        break;
        break;
      case 30:
        s = '三十';
        break;
        break;
      default:
        s = this.nStr2[Math.floor(d / 10)];
        s += this.nStr1[d % 10];
    }
    return (s);
  }
  //中文月份
  cMonth(m) {
    let s;

    switch (m) {
      case 1:
        s = '正月';
        break;
      case 2:
        s = '二月';
        break;
      case 3:
        s = '三月';
        break;
      case 4:
        s = '四月';
        break;
      case 5:
        s = '五月';
        break;
      case 6:
        s = '六月';
        break;
      case 7:
        s = '七月';
        break;
      case 8:
        s = '八月';
        break;
      case 9:
        s = '九月';
        break;
      case 10:
        s = '十月';
        break;
      case 11:
        s = '十一月';
        break;
      case 12:
        s = '十二月';
        break;
      default:
        break;
    }
    return (s);
  }

  //获得阴历日期 字符串
  getLunarDay() {
    return cMonth(this.month) + cDay(this.day);
  }
  //获得阴历日期某一天的中文
  getLunarDayName() {

    if (this.day == 1)
      return this.cMonth(this.month);
    return this.cDay(this.day);
  }
  //获取阴历日期的数字
  getLunarDayNum() {
    return {
      day: Math.round(this.day),
      month: this.month
    };
  }


}


class SimpleCalendar {
  //构造函数
  constructor(query, options) {
    //默认配置
    this._defaultOptions = {
      width: '500px',
      height: '500px',
      language: 'CH', //语言
      showLunarCalendar: true, //阴历
      showHoliday: true, //休假
      showFestival: true, //节日
      showLunarFestival: true, //农历节日
      showSolarTerm: true, //节气
      showMark: true, //标记
      timeRange: {
        startYear: 1900,
        endYear: 2049
      },
      timeZone: "", //时区
      mark: {
        '2019-6-6': 'Go'
      },
      theme: {
        changeAble: false,
        weeks: {
          backgroundColor: '#FBEC9C',
          fontColor: '#4A4A4A',
          fontSize: '20px',
        },
        days: {
          backgroundColor: '#ffffff',
          fontColor: '#565555',
          fontSize: '24px'
        },
        todaycolor: 'orange',
        activeSelectColor: 'orange',
        invalidDays: '#C1C0C0',
      }
    }

    //容器
    this.container = document.querySelector(query);

    this._defaultOptions.width = this.container.style.offsetWidth;
    this._defaultOptions.height = this.container.style.offsetHeight;

    //this._options = Object.assign({}, this._defaultOptions, options);

    //得到最终配置
    this._options = this.optionAssign(this._defaultOptions, options);

    this.create();
  }

  //用B更新A的属性 并返回结果
  optionAssign(optionsA, optionsB) {
    for (let key in optionsB) {
      if (typeof(optionsA[key]) !== 'object')
        optionsA[key] = optionsB[key];
      else {
        optionsA[key] = this.optionAssign(optionsA[key], optionsB[key])
      }
    }
    return optionsA;
  }

  //生成日历样式
  create() {
    let root = this.container;
    root.innerHTML = '<div class="sc-header"> </div> <div class="sc-body"> </div>';
    root.style.width = this._options.width;
    root.style.height = this._options.height;
    root.className = 'sc-calendar';
    let header = root.querySelector('.sc-header');
    let scbody = root.querySelector('.sc-body');
    //actions
    header.innerHTML = header.innerHTML + '<div class="sc-actions">' +
        '      <div class="sc-yleft">' +
        '        &lsaquo;</div>' +
        '      <select class="sc-select-year" name="">' +
        '      </select>' +
        '      <div class="sc-yright">&rsaquo;</div>' +
        '  </div>';
    header.innerHTML = header.innerHTML + '<div class="sc-actions">' +
        '    <div class="sc-mleft">' +
        '      &lsaquo;</div>' +
        '    <select class="sc-select-month" name="">' +
        '    </select>' +
        '    <div class="sc-mright">&rsaquo;</div>' +
        '</div>';
    header.innerHTML = header.innerHTML + '<div class="sc-actions"><span class="sc-return-today ">返回今天</span></div>';
    header.innerHTML = header.innerHTML + '<div class="sc-actions"><span class="sc-time"></span></div>';
    scbody.innerHTML = ' <div class="sc-week"> </div> <div class="sc-days"> </div>';
    let week = scbody.querySelector('.sc-week');
    let days = scbody.querySelector('.sc-days');
    for (let i = 0; i < 7; i++) {
      week.innerHTML = week.innerHTML + ' <div class="sc-week-item"></div>';
    }
    for (let i = 0; i < 35; i++) {
      days.innerHTML = days.innerHTML + '<div class="sc-item"><div class="day"></div><div class="lunar-day"></div></div>';
    }
    //添加下拉框数据
    this.updateSelect(this.tyear, this.tmonth);
    //刷新日历
    this.update();
    //时间刷新
    self.setInterval('SimpleCalendar.timeupdate()', 200);
  }

  //刷新日历
  update(month = this.tmonth, year = this.tyear) {
    this.updateSize()
    this.updateWeek();
    this.addData(year, month);
    this.updateHoliday(year, month);
    this.updateMark(year, month);
    this.updateFestival(year, month);
    this.updateEvent();
    this.updateTheme(this._options.theme);
  }

  //调整大小
  updateSize(width = this._options.width, height = this._options.height) {
    //将大小赋值给option
    this._options.width = width;
    this._options.height = height;

    this.container.style.width = width;
    this.container.style.height = height;

    //根据长度和宽度大小调整适合的样式
    if (parseInt(width) < 500) {
      let actions = this.arrayfrom(this.container.querySelectorAll('.sc-actions'));
      actions.forEach(function(v, i) {
        v.classList.add('sc-actions-big');
      })
    } else {
      let actions = this.arrayfrom(this.container.querySelectorAll('.sc-actions'));
      actions.forEach(function(v, i) {
        v.classList.remove('sc-actions-big');
      })
    }
    if (parseInt(height) < 400) {
      let items = this.arrayfrom(this.container.querySelectorAll('.sc-item'));
      let weeks = this.arrayfrom(this.container.querySelectorAll('.sc-week-item'));
      items.forEach(function(v, i) {
        v.querySelector('.day').classList.add('sc-item-small');
      })
      weeks.forEach(function(v, i) {
        v.classList.add('sc-item-small');
      })
    } else {
      let items = this.arrayfrom(this.container.querySelectorAll('.sc-item'));
      let weeks = this.arrayfrom(this.container.querySelectorAll('.sc-week-item'));
      items.forEach(function(v, i) {
        v.querySelector('.day').classList.remove('sc-item-small');
      })
      weeks.forEach(function(v, i) {
        v.classList.remove('sc-item-small');
      })
    }
  }

  //刷新下拉框 只有在初始化和设置语言后才会更新
  updateSelect(year, month) {
    //下拉框
    let selectYear = this.container.querySelector('.sc-select-year');
    let selectMonth = this.container.querySelector('.sc-select-month');
    selectYear.innerHTML = '';
    for (let i = this._options.timeRange.startYear; i < this._options.timeRange.endYear+1; i++) {
      selectYear.innerHTML += '<option value="' + i + '">' + i + '</option>';
    }
    selectMonth.innerHTML = '';
    for (let i = 0; i < 12; i++) {
      let data = this.languageData['months_' + this._options.language];
      selectMonth.innerHTML += '<option value="' + (i + 1) + '">' + data[i] + '</option>';
    }

    selectYear.value = year;
    selectMonth.value = month;

  }

  //刷新星期
  updateWeek() {
    let weeks = this.arrayfrom(this.container.querySelectorAll('.sc-week-item'));
    let data = this.languageData['days_' + this._options.language];
    if (!data) {
      console.error('language error!');
    }
    weeks.forEach(function(v, i) {
      v.innerHTML = data[i];
    })
  }

  //添加阳历阴历数据
  addData(year, month) {
    let daysElement = this.arrayfrom(this.container.querySelectorAll('.sc-item'));
    let day = new Date(year, month - 1, 1);
    let week = day.getDay();
    if (week == 0) week = 7;

    //计算得到第一个格子的日期
    let thispageStart = new Date(Date.parse(day) - (week - 1) * 24 * 3600 * 1000);

    //对每一个格子遍历
    for (let i = 0; i < 35; i++) {
      daysElement[i].className = 'sc-item';
      let theday = new Date(Date.parse(thispageStart) + (i-1) * 24 * 3600 * 1000);
      let writeyear = theday.getFullYear();
      let writeday = theday.getDate();
      let writemonth = theday.getMonth() + 1;
      if (writemonth != month) {
        daysElement[i].classList.add('sc-othermenth');
      }
      daysElement[i].querySelector('.day').innerHTML = writeday;
      //判断是否添加阴历
      if (this._options.showLunarCalendar) {
        daysElement[i].querySelector('.lunar-day').innerHTML = (new LunarHelp(writeyear, writemonth, writeday)).getLunarDayName();
      } else {
        daysElement[i].querySelector('.lunar-day').innerHTML = '';
        daysElement[i].classList.add('item-nolunar');
      }

      //添加today样式
      if (this.tyear == writeyear && this.tday == writeday && this.tmonth == writemonth) {
        this.selectDay = daysElement[i];
        daysElement[i].classList.add("sc-today");
      }

    }
  }

  //刷新标记日期
  updateMark(year, month) {
    let options = this._options;
    if (options.showMark) {
      let daysElement = this.arrayfrom(this.container.querySelectorAll('.sc-item'));
      let currentmonth = month - 1;
      //取得节日数据
      let data = options.mark;
      if (data) {
        daysElement.forEach(function(v, i) {

          let day = +(v.querySelector('.day').innerHTML);
          if (day == 1) currentmonth++;


          if (data[year + '-' + currentmonth + '-' + day]) {
            v.classList.add('sc-mark');
            v.title = data[year + '-' + currentmonth + '-' + day];
          } else {
            v.classList.remove('sc-mark');
            v.title = '';
          }

        });
      }


    }

  }

  //刷新节日数据
  updateFestival(year, month) {
    let options = this._options;
    let daysElement = this.arrayfrom(this.container.querySelectorAll('.sc-item'));
    let currentmonth = month - 1;
    //取得节日数据
    let data =this.languageData['feativals_' + this._options.language];
    // console.log(data);
    let lunardata = this.languageData['lunarFeatival_' + this._options.language];
    // console.log(lunardata);
    let solarTermdata = this.languageData['solarTerm'];
    // console.log(solarTermdata);
    if (!data) {
      console.error('language error!');
    }
    // console.log(daysElement);
    daysElement.forEach(function(v, i) {
      // console.log(v);
      let day = +(v.querySelector('.day').innerHTML);
      // console.log(v.querySelector('.day').innerHTML);
      if (day === 1) currentmonth++;

      //24节气
      if (options.showSolarTerm) {
        if (solarTermdata[currentmonth + '-' + day]) {
            v.querySelector('.lunar-day').innerHTML = solarTermdata[currentmonth + '-' + day];
          v.classList.add('sc-festival');
        }
      }

      //国际节日
      if (options.showFestival) {
        if (data[currentmonth + '-' + day]) {
          v.querySelector('.lunar-day').innerHTML = data[currentmonth + '-' + day];
          v.classList.add('sc-festival');
        }

      }


      //阴历节日
      if (lunardata && options.showLunarFestival) {
        let lunar =(new LunarHelp(year, currentmonth, day)).getLunarDayNum();

        if (lunardata[lunar.month + '-' + lunar.day]) {
          v.querySelector('.lunar-day').innerHTML = lunardata[lunar.month + '-' + lunar.day];
          v.classList.add('sc-festival');
        }
      }

    });


  }

  //刷新假期 休假
  updateHoliday(year, month) {

    let options = this._options;
    if (options.showHoliday) {
      let daysElement = this.arrayfrom(this.container.querySelectorAll('.sc-item'));
      let currentmonth = month - 1;
      //取得节日数据
      let data = this.languageData.vocation['data_' + year];
      if (data) {
        daysElement.forEach(function(v, i) {
          let day = +(v.querySelector('.day').innerHTML);
          if (day == 1) currentmonth++;
          //国际节日
          if (data.indexOf(currentmonth + '-' + day) > 0) {
            v.classList.add('sc-vocation');
          }
        });
      }


    }

  }

  //刷新主题
  updateTheme(theme) {
    if (this._options.theme.changeAble) {
      let daytheme = theme.days;
      let weektheme = theme.weeks;
      let weeks = this.arrayfrom(this.container.querySelectorAll('.sc-week-item'));
      let days = this.arrayfrom(this.container.querySelectorAll('.sc-item'));
      weeks.forEach(function(v, i) {
        v.style.backgroundColor = weektheme.backgroundColor;
        v.style.fontSize = weektheme.fontSize;
        v.style.color = weektheme.fontColor;
      })
      days.forEach(function(v, i) {
        if (!v.classList.contains('sc-today')) {
          v.style.backgroundColor = daytheme.backgroundColor;
          v.querySelector('.day').style.color = daytheme.fontColor;
        } else {
          v.style.backgroundColor = theme.todaycolor;
        }
        v.querySelector('.day').style.fontSize = daytheme.fontSize;
      })
      let Calendar = this;
      //active border
      days.forEach(function(v, i) {
        v.onmouseover = function(e) {
          this.style.borderColor = theme.activeSelectColor;
          this.style.borderWidth = '1px';
        }
        v.onmouseout = function(e) {
          this.style.borderColor = '#F1EBE4';
          this.style.borderWidth = '0 0 1px 1px';
        }

      })
    }
  }

  //刷新事件
  updateEvent() {
    let daysElement = this.arrayfrom(this.container.querySelectorAll('.sc-item'));
    let container = this.container;
    let calendar = this;
    daysElement.forEach(function(v, i) {
      v.onmouseover = function(e) {
        this.classList.add('sc-active-day');
      }
      v.onmouseout = function(e) {
        this.classList.remove('sc-active-day');
      }
      v.onclick = function() {
        calendar.selectDay = v;
        let pre = container.querySelector('.sc-selected');
        if (pre) pre.classList.remove('sc-selected');
        this.classList.add('sc-selected');
      }
    })

    let selectYear = container.querySelector('.sc-select-year');
    let selectMonth = container.querySelector('.sc-select-month');
    selectYear.onchange = function() {
      let m = selectMonth.value;
      let y = this.value;
      calendar.update(m, y)
    }

    selectMonth.onchange = function() {
      let y = selectYear.value;
      let m = this.value;
      calendar.update(m, y)
    };

    /*-----------------------------------------------------click 事件------------------------------------*/
    let yearadd = container.querySelector('.sc-yright');
    let yearsub = container.querySelector('.sc-yleft');
    let monthadd = container.querySelector('.sc-mright');
    let monthsub = container.querySelector('.sc-mleft');

    yearadd.onclick = function() { //点击切换年份
      let currentyear = selectYear.value; //获取年份
      let currentmonth = selectMonth.value;//获取月份
      if (currentyear < 2099) currentyear++;
      selectYear.value = currentyear;
      calendar.update(currentmonth, currentyear);
    };
    yearsub.onclick = function() {
      let currentyear = selectYear.value;
      let currentmonth = selectMonth.value;
      if (currentyear > 1900) currentyear--;
      selectYear.value = currentyear;
      calendar.update(currentmonth, currentyear);
    };
    monthadd.onclick = function() {
      let currentmonth = selectMonth.value;
      let currentyear = selectYear.value;
      if (currentmonth < 12) currentmonth++;
      else {
        currentmonth = 1;
        selectYear.value = ++currentyear;
      };
      selectMonth.value = currentmonth;
      calendar.update(currentmonth, currentyear);
    };
    monthsub.onclick = function() {
      let currentmonth = selectMonth.value;
      let currentyear = selectYear.value;
      if (currentmonth > 1) currentmonth--;
      else {
        currentmonth = 12;
        selectYear.value = --currentyear;
      }
      selectMonth.value = currentmonth;
      calendar.update(currentmonth, currentyear);
    }

    let returntoday = container.querySelector('.sc-return-today');
    returntoday.onclick = function() {
      selectYear.value = calendar.tyear;
      selectMonth.value = calendar.tmonth;
      calendar.update();
    }
  }

  //添加标记
  addMark(day, info) {
    this._options.mark[day] = info;
    this.update();
  }

  //获取用户点击的日期
  getSelectedDay() {
    let selectYear = this.container.querySelector('.sc-select-year').value;
    let selectMonth = this.container.querySelector('.sc-select-month').value;
    let selectDay = this.selectDay.querySelector('.day').innerHTML;
    return new Date(selectYear, selectMonth - 1, selectDay);
  }

  //设置语言
  setLenguage(language) {
    this._options.language = language;
    let selectYear = this.container.querySelector('.sc-select-year');
    let selectMonth = this.container.querySelector('.sc-select-month');
    this.updateSelect(selectYear.value, selectMonth.value);
    this.update();
  }

  //设置是否显示节日
  showFestival(s) {
    this._options.showFestival = s;
    this.update();
  }

  //设置是否显示假期
  showHoliday(s) {
    this._options.showHoliday = s;
    this.update();
  }

  //设置是否显示节气
  showSolarTerm(s) {
    this._options.showSolarTerm = s;
    this.update();
  }

  //设置是否显示阴历节日
  showLunarFestival(s) {
    this._options.showLunarFestival = s;
    this.update();
  }

  //设置是否显示阴历日期
  showLunarCalendar(s) {
    this._options.showLunarCalendar = s;
    this.update();
  }

  //设置是否显示标记日期
  showMark(s) {
    this._options.showMark = s;
    this.update();
  }
  //将nodelist转为数组

  //nodelist转数组
  arrayfrom(nidelist) {
    let array = [];
    [].forEach.call(nidelist, function(v) {
      array.push(v);
    });
    return array;
  }

  // get options() {
  //   console.log(this._options);
  // }
}
//时间刷新函数
SimpleCalendar.timeupdate = function() {
  let timespan = document.querySelectorAll('.sc-time');
  let now = new Date();
  let nh = now.getHours();
  let nm = now.getMinutes();
  let ns = now.getSeconds();
  if (nh < 10) nh = '0' + nh;
  if (nm < 10) nm = '0' + nm;
  if (ns < 10) ns = '0' + ns;
  [].forEach.call(timespan, function(v) {
    v.innerHTML = '时间：' + nh + ":" + nm + ':' + ns;
  })
}
//国际化，和一些节日数据，标记数据
SimpleCalendar.prototype.languageData = {
  feativals_CH: {
    '1-1': '元旦',
    '2-14': '情人节',
    '3-8': '妇女节',
    '3-12': '植树节',
    '4-1': '愚人节',
      '4-23':'读书日',
      '4-26':'知识产权',
    '4-22': '地球日',
    '5-1': '劳动节',
    '5-4': '青年节',
    '5-31': '无烟日',
    '6-1': '儿童节',
    '6-5': '环境日',
    '6-16': '父亲节',
    '7-1': '建党节',
    '8-1': '建军节',
    '9-10': '教师节',
    '10-1': '国庆节',
    '12-25': '圣诞节',
  },
  feativals_EN: {
    '1-1': "new year’s day",
    '2-14': "Saint Valentine's Day",
    '3-8': 'international women’s day',
    '3-12': "Arbor Day",
    '4-1': "April Fool's Day",
    '4-22': "Earth Day",
    '5-1': "international labour day",
    '5-4': "Chinese Youth Day",
    '6-1': "Children's Day",
    '7-1': "The party's Day",
    '8-1': "the Army's Day",
    '9-10': "Teachers' Day",
    '10-1': 'National Day',
    '12-25': 'Christmas Day',
  },
  lunarFeatival_CH: {
    '1-1': '春节',
    '2-2': '龙抬头',
    '1-15': '元宵节',
    '4-4': '寒食节',
    '4-5': '清明节',
    '5-5': '端午节',
    '8-15': '中秋节',
    '9-9': '重阳节',
    '12-30': '除夕',
  },
  //节气
  solarTerm: {
    '2-4': '立春',
    '5-6': '立夏',
    '8-8': '立秋',
    '11-8': '立冬',
    '2-19': '雨水',
    '5-21': '小满',
    '8-23': '处暑',
    '11-23': '小雪',
    '3-6': '惊蛰',
    '6-6': '芒种',
    '9-8': '白露',
    '12-7': '大雪',
    '3-21': '春分',
    '6-22': '夏至',
    '9-23': '秋分',
    '12-22': '冬至',
    '4-5': '清明',
    '7-7': '小暑',
    '10-9': '寒露',
    '1-6': '小寒',
    '4-20': '谷雨',
    '7-23': '大暑',
    '10-24': '霜降',
    '1-21': '大寒',

  },
  solarTermt: {
        '2-3': '立春',
        '5-5': '立夏',
        '8-7': '立秋',
        '11-7': '立冬',
        '2-18': '雨水',
        '5-20': '小满',
        '8-22': '处暑',
        '11-22': '小雪',
        '3-5': '惊蛰',
        '6-5': '芒种',
        '9-7': '白露',
        '12-6': '大雪',
        '3-20': '春分',
        '6-21': '夏至',
        '9-22': '秋分',
        '12-21': '冬至',
        '4-4': '清明',
        '7-6': '小暑',
        '10-8': '寒露',
        '1-5': '小寒',
        '4-19': '谷雨',
        '7-22': '大暑',
        '10-23': '霜降',
        '1-20': '大寒',

    },
  days_EN: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  days_CH: ["日","一", "二", "三", "四", "五", "六"],
  months_EN: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  months_CH: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
  vocation: {
    data_2019: ['1-1', '2-4','2-5','2-6','2-7', '2-8', '2-9', '2-10','4-5', '4-6', '4-7', '5-1', '5-2',  '5-3', '5-4','6-7', '6-8', '6-9', '9-13', '9-14', '9-15', '10-1', '10-2', '10-3', '10-4', '10-5', '10-6', '10-7']
  },
}

SimpleCalendar.prototype.tyear = (new Date()).getFullYear();
SimpleCalendar.prototype.tmonth = (new Date()).getMonth() + 1;
SimpleCalendar.prototype.tday = (new Date()).getDate();
