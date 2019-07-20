(function () {
  'use strict';

  var Renderer = /** @class */ (function () {
      function Renderer() {
          var _this = this;
          this._isRendering = true;
          this._canvas = document.createElement('canvas');
          this._context = this._canvas.getContext('2d');
          this._ground = null;
          this._centralPoint = null;
          this._drawableList = [];
          this._width = window.innerWidth;
          this._height = window.innerHeight;
          this._bindCanvasEvents = function () {
              window.addEventListener('resize', _this._fitCanvasToWindow, false);
              _this._canvas.addEventListener('click', _this._handleCanvasClick, false);
          };
          this._getOrderedDrawObjects = function () {
              var _a = _this, _drawableList = _a._drawableList, _centralPoint = _a._centralPoint;
              var drawObjects = _drawableList.concat([_centralPoint]).map(function (drawableObject) { return drawableObject.getDrawData(); });
              return drawObjects.sort(function (a, b) { return a.zIndex > b.zIndex ? 1 : -1; });
          };
          this._handleCanvasClick = function (_a) {
              var x = _a.clientX, y = _a.clientY;
              var drawObjects = _this._getOrderedDrawObjects();
              for (var _i = 0, drawObjects_1 = drawObjects; _i < drawObjects_1.length; _i++) {
                  var object = drawObjects_1[_i];
                  var startX = object.x;
                  var endX = object.x + object.width;
                  var startY = object.y;
                  var endY = object.y + object.height;
                  if (x >= startX && x <= endX && y >= startY && y <= endY) {
                      if (object.onClick)
                          object.onClick();
                      return;
                  }
              }
          };
          this._fitCanvasToWindow = function () {
              _this._canvas.width = _this._width = window.innerWidth;
              _this._canvas.height = _this._height = window.innerHeight;
          };
          this.hide = function () {
              _this._canvas.style.display = 'none';
          };
          this.show = function () {
              _this._canvas.removeAttribute('style');
          };
          this.addDrawable = function (drawableObject) {
              _this._drawableList.push(drawableObject);
          };
          this.removeDrawable = function (drawableObject) {
              _this._drawableList = _this._drawableList.filter(function (item) { return item !== drawableObject; });
          };
          this.setGround = function (ground) {
              _this._ground = ground;
          };
          this.render = function () {
              if (!_this._isRendering)
                  return;
              requestAnimationFrame(_this.render);
              var _a = _this, _width = _a._width, _height = _a._height, _context = _a._context, _ground = _a._ground, _centralPoint = _a._centralPoint;
              var drawableCentralPoint = _centralPoint.getDrawData();
              var drawableGround = _ground.getDrawData();
              var centralPointAverageX = drawableCentralPoint.x + drawableCentralPoint.width / 2;
              var centralPointAverageY = drawableCentralPoint.y + drawableCentralPoint.height / 2;
              var mapX = -Math.min(Math.max(0, centralPointAverageX / 2), drawableGround.width - _width / 2);
              var mapY = -Math.min(Math.max(0, centralPointAverageY / 2), drawableGround.height - _height / 2);
              var orderedDrawObjects = _this._getOrderedDrawObjects();
              _context.clearRect(0, 0, _width, _height);
              _context.drawImage(drawableGround.background, mapX, mapY);
              for (var _i = 0, orderedDrawObjects_1 = orderedDrawObjects; _i < orderedDrawObjects_1.length; _i++) {
                  var drawableObject = orderedDrawObjects_1[_i];
                  var x = drawableObject.x, y = drawableObject.y, width = drawableObject.width, height = drawableObject.height, background = drawableObject.background, backgroundPosition = drawableObject.backgroundPosition, backgroundSize = drawableObject.backgroundSize;
                  _context.drawImage(background, backgroundPosition.x || 0, backgroundPosition.y || 0, backgroundSize.width || width, backgroundSize.height || height, x + mapX, y + mapY, width, height);
              }
          };
          this.hide();
          this._bindCanvasEvents();
      }
      return Renderer;
  }());
  //# sourceMappingURL=Renderer.js.map

  var Loader = /** @class */ (function () {
      function Loader() {
          var _this = this;
          this.hide = function () {
              _this.ref.classList.add('loader--hidden');
          };
          this.show = function () {
              _this.ref.classList.remove('loader-hidden');
          };
          this.ref = document.getElementById('loader');
      }
      return Loader;
  }());
  //# sourceMappingURL=Loader.js.map

  var Game = /** @class */ (function () {
      function Game() {
          var _this = this;
          this.renderer = new Renderer();
          this.loader = new Loader();
          setTimeout(function () {
              _this.loader.hide();
              _this.renderer.show();
          }, 250);
      }
      return Game;
  }());
  new Game();

}());
//# sourceMappingURL=index.js.map
