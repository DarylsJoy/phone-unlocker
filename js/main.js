'use strict';

// 将得到结果转化为字符串
function specStr(str) {
  return JSON.stringify(str, ['index']).match(/\d/g).toString().replace(/,/g, '');
}

//  保存密码
function savePwd(key, p) {
  window.localStorage.setItem(key, p);
  return true;
}

// 读取密码
function getPwd(key) {
  return window.localStorage.getItem(key);
}

window.onload = function () {
  var count = 0;          // 当前输入密码次数
  var key = 'unlocker';   // localStorage 保存键名
  var firstData = '';     // 第一次输入的密码
  var type = 1;           // 当前操作类型  输入/验证
  var timer = 1000;       // 通知延迟触发时间

  var setBtn = document.querySelector('#settingPwd');
  var checkBtn = document.querySelector('#checkPwd');
  var tip = document.querySelector('#tip');

  // 若从未设置密码，初始化为空
  if (!getPwd(key)) {
    count = 0;
    type = 1;
    savePwd(key, '');
    tip.innerHTML = '请输入密码';
  } else {
    count = 2;
    type = 2;
    checkBtn.checked = true;
    tip.innerHTML = '密码已设置';
  }

  setBtn.addEventListener('click', function () {
    if (getPwd(key) !== '') {
      type = 2;
      tip.innerHTML = '密码已设置';
      checkBtn.checked = true;
      setTimeout("tip.innerHTML = '请输入密码'", timer);
    } else {
      type = 1;
      tip.innerHTML = '请输入密码';
    }
  });

  checkBtn.addEventListener('click', function () {
    if (getPwd(key) === '') {
      type = 1;
      tip.innerHTML = '尚未设置密码';
      setBtn.checked = true;
      setTimeout("tip.innerHTML = '请设置密码'", timer);
    } else {
      type = 2;
      tip.innerHTML = '请输入密码';
    }
  });

  PhoneLock.init({
    chooseType: 3
  }).initEvent(function (data) {
    data = specStr(data);
    if (type === 1) {
      // 输入密码
      if (count === 0) {
        if (data.length < 5) {
          // 密码长度太短
          tip.innerHTML = '密码长度不可少于5位';
          setTimeout("tip.innerHTML = '请输入密码'", timer);
          return false;
        }
        // 第一次输入
        setBtn.checked = true;
        firstData = data;
        count ++;
        tip.innerHTML = '请再次输入密码';
      } else if (count === 1) {
        // 确认第一次输入的密码
        if (data === firstData) {
          // 与第一次相同
          tip.innerHTML = '已保存密码';
          savePwd(key, data);
          count ++;
          type = 2;
        } else {
          // 与第一次不同
          tip.innerHTML = '两次密码不一致';
          setBtn.checked = true;
          setTimeout("tip.innerHTML = '请再次输入密码'", timer);
        }
      } else {
        // 密码已存在
        type = 2;
        tip.innerHTML = '密码已设置';
        checkBtn.checked = true;
        setTimeout("tip.innerHTML = '请验证密码'", timer);
      }
    } else if (type === 2) {
      // 验证密码
      if (data === getPwd(key)) {
        // 验证通过
        tip.innerHTML = '密码正确';
        setTimeout("tip.innerHTML = '请验证密码'", timer);
      } else {
        // 验证失败
        tip.innerHTML = '密码错误';
        setTimeout("tip.innerHTML = '请验证密码'", timer);
      }
    }
  });
};