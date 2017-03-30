(function () {
  var PhoneLock = function () {
  };
  PhoneLock.prototype = {
    init: function (obj) {
      // x * x 方格
      this.chooseType = obj.chooseType || 3;
      this.canvas = document.getElementById("canvas");
      this.ctx = this.canvas.getContext("2d");
      this.flag = false;
      this.createCirle();
      return this;
    },
    // 相应事件
    initEvent: function (fn) {
      var self = this;
      this.canvas.addEventListener("touchstart", function (e) {
        e.preventDefault();
        var po = self.getPosition(e);
        for (var i = 0; i < self.arr.length; i++) {
          if (Math.abs(po.x - self.arr[i].x) < self.r && Math.abs(po.y - self.arr[i].y) < self.r) {
            self.flag = true;
            self.drawPoint(self.arr[i].x, self.arr[i].y);
            self.restPoint.splice();
            break;
          }
        }

      }, false);
      this.canvas.addEventListener("touchmove", function (e) {
        e.preventDefault();
        if (self.flag) {
          self.update(self.getPosition(e));
        }
      }, false);
      this.canvas.addEventListener("touchend", function (e) {
        e.preventDefault();
        if (self.flag) {
          self.flag = false;
          fn(self.lastPoint);
          setTimeout(function () {
            self.drawCle();
          }, 500);
        }
        self.clearAll();
      }, false);
    },
    update: function (po) {
      this.drawCle();
      for (var i = 0; i < this.restPoint.length; i++) {
        if (Math.abs(po.x - this.restPoint[i].x) < this.r && Math.abs(po.y - this.restPoint[i].y) < this.r) {
          this.lastPoint.push(this.restPoint[i]);
          this.drawPoint();
          this.restPoint.splice(i, 1);
          break;
        }
      }

      this.drawPoint();
      this.drawLine(po);
    },
    drawPoint: function () {
      this.ctx.fillStyle = "#cfe6ff";
      for (var i = 0; i < this.lastPoint.length; i++) {
        this.ctx.beginPath();
        this.ctx.arc(this.lastPoint[i].x, this.lastPoint[i].y, this.r - 10, 0, Math.PI * 2, true);
        this.ctx.closePath();
        this.ctx.fill();
      }
    },
    drawLine: function (po) {
      this.ctx.strokeStyle = "#cfe6ff";
      this.ctx.lineWidth = 3;
      this.ctx.beginPath();
      this.ctx.moveTo(this.lastPoint[0].x, this.lastPoint[0].y);
      for (var i = 1; i < this.lastPoint.length; i++) {
        this.ctx.lineTo(this.lastPoint[i].x, this.lastPoint[i].y);
      }
      this.ctx.lineTo(po.x, po.y);
      this.ctx.stroke();
      this.ctx.closePath();
    },
    // 获得鼠标位置
    getPosition: function (e) {
      var rect = e.currentTarget.getBoundingClientRect();
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top
      }
    },
    // 画圆
    createCirle: function () {
      var n = this.chooseType;
      var count = 0;
      this.r = this.ctx.canvas.width / (2 + 4 * n);
      this.lastPoint = [];
      this.arr = [];
      this.restPoint = [];
      var r = this.r;
      for (var i = 0; i < n; i++) {
        for (var j = 0; j < n; j++) {
          count++;
          var obj = {
            x: j * 4 * r + 3 * r,
            y: i * 4 * r + 3 * r,
            index: count
          };
          this.arr.push(obj);
          this.restPoint.push(obj);
        }
      }
      this.drawCle();
    },
    drawCle: function () {
      this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
      this.ctx.strokeStyle = "#cfe6ff";
      this.ctx.lineWidth = 2;
      for (var i = 0; i < this.arr.length; i++) {
        this.ctx.beginPath();
        this.ctx.arc(this.arr[i].x, this.arr[i].y, this.r, 0, Math.PI * 2, true);
        this.ctx.closePath();
        this.ctx.stroke();
      }
    },
    // 清空画布并重置
    clearAll: function () {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.createCirle();
    }
  };

  // 注册为全局变量
  window.PhoneLock = new PhoneLock;
})();
