(function () {
  'use strict';

  var EventEmitter = /** @class */ (function () {
      function EventEmitter() {
          var _this = this;
          this._listeners = {};
          this.on = function (eventName, handler) {
              if (!_this._listeners.hasOwnProperty(eventName)) {
                  _this._listeners[eventName] = [handler];
              }
              else {
                  _this._listeners[eventName].push(handler);
              }
          };
          this.off = function (eventName, handler) {
              _this._listeners[eventName] = _this._listeners[eventName].filter(function (currentHandler) {
                  return currentHandler !== handler;
              });
          };
          this.emit = function (eventName, payload) {
              var listeners = _this._listeners[eventName];
              if (listeners) {
                  listeners.forEach(function (listener) { return listener(payload); });
              }
          };
      }
      return EventEmitter;
  }());
  //# sourceMappingURL=EventEmitter.js.map

  var _animations = [];
  var _generateFinishResult = function (target, animationDelta) {
      var result = {};
      Object.keys(animationDelta).forEach(function (key) {
          result[key] = target[key] + animationDelta[key];
      });
      return result;
  };
  var Animator = /** @class */ (function () {
      function Animator() {
      }
      Animator.update = function (time) {
          for (var _i = 0, _animations_1 = _animations; _i < _animations_1.length; _i++) {
              var animation = _animations_1[_i];
              var timeDelta = time - animation.lastUpdate;
              animation.lastUpdate = time;
              for (var key in animation.animationDelta) {
                  var paramDelta = timeDelta / animation.duration;
                  animation.target[key] += paramDelta * animation.animationDelta[key];
              }
              if (time >= animation.start + animation.duration) {
                  Object.assign(animation.target, animation.finishResult);
                  animation.handler();
                  return;
              }
              animation.onUpdate((time - animation.start) / animation.duration);
          }
      };
      Animator.to = function (target, params, duration, onUpdate) {
          var animationDelta = {};
          for (var key in params) {
              if (!target.hasOwnProperty(key)) {
                  throw new Error("Target does not have property \"" + key + "\"!");
              }
              animationDelta[key] = params[key] - target[key];
          }
          return Animator.animate(target, animationDelta, duration, onUpdate);
      };
      Animator.animate = function (target, animationDelta, duration, onUpdate) {
          return new Promise(function (resolve) {
              var finishResult = _generateFinishResult(target, animationDelta);
              var animation = {
                  target: target, duration: duration, animationDelta: animationDelta, finishResult: finishResult,
                  onUpdate: onUpdate || null,
                  lastUpdate: performance.now(),
                  start: performance.now(),
                  handler: function () {
                      var animationIndex = _animations.indexOf(animation);
                      _animations.splice(animationIndex, 1);
                      resolve();
                  }
              };
              _animations.push(animation);
          });
      };
      return Animator;
  }());
  //# sourceMappingURL=Animator.js.map

  var IMAGE_FORMATS = ['jpg', 'png'];
  var VIDEO_FORMATS = ['mp4', 'webm'];
  var _loadedMedia = {};
  var _loadListeners = {};
  var _loadImage = function (source) {
      var image = new Image();
      image.src = source;
      _loadListeners[source] = [];
      image.addEventListener('load', function () {
          _loadedMedia[source] = { loaded: true, media: image };
          _loadListeners[source].forEach(function (handler) {
              handler(image);
          });
          delete _loadListeners[source];
      }, false);
  };
  var _loadVideo = function (source) {
      var video = document.createElement('video');
      video.src = source;
      video.muted = true;
      video.autoplay = true;
      _loadListeners[source] = [];
      video.addEventListener('load', function () {
          _loadedMedia[source] = { loaded: true, media: video };
          _loadListeners[source].forEach(function (handler) {
              handler(video);
          });
          delete _loadListeners[source];
      }, false);
  };
  var _loadFromCache = function (source) {
      return new Promise(function (resolve) {
          resolve(_loadedMedia[source].media);
      });
  };
  var _loadBySource = function (source) {
      if (_loadedMedia.hasOwnProperty(source)) {
          if (_loadedMedia[source].loaded)
              return _loadFromCache(source);
          return new Promise(function (resolve) {
              _loadListeners[source].push(function (media) { return resolve(media); });
          });
      }
      var isImage = IMAGE_FORMATS.some(function (imageFormat) { return source.endsWith("." + imageFormat); });
      if (isImage) {
          _loadImage(source);
          return new Promise(function (resolve) {
              _loadListeners[source].push(function (media) {
                  resolve(media);
              });
          });
      }
      var isVideo = VIDEO_FORMATS.some(function (videoFormat) { return source.endsWith("." + videoFormat); });
      if (isVideo) {
          _loadVideo(source);
          return new Promise(function (resolve) {
              _loadListeners[source].push(function (media) {
                  resolve(media);
              });
          });
      }
      throw new Error('MediaLoader._loadBySource(): Unknown media type!');
  };
  var MediaLoader = /** @class */ (function () {
      function MediaLoader() {
      }
      MediaLoader.load = function (source) {
          return _loadBySource(source);
      };
      return MediaLoader;
  }());
  //# sourceMappingURL=MediaLoader.js.map

  /*! *****************************************************************************
  Copyright (c) Microsoft Corporation. All rights reserved.
  Licensed under the Apache License, Version 2.0 (the "License"); you may not use
  this file except in compliance with the License. You may obtain a copy of the
  License at http://www.apache.org/licenses/LICENSE-2.0

  THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
  KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
  WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
  MERCHANTABLITY OR NON-INFRINGEMENT.

  See the Apache Version 2.0 License for specific language governing permissions
  and limitations under the License.
  ***************************************************************************** */
  /* global Reflect, Promise */

  var extendStatics = function(d, b) {
      extendStatics = Object.setPrototypeOf ||
          ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
          function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
      return extendStatics(d, b);
  };

  function __extends(d, b) {
      extendStatics(d, b);
      function __() { this.constructor = d; }
      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  }

  var __assign = function() {
      __assign = Object.assign || function __assign(t) {
          for (var s, i = 1, n = arguments.length; i < n; i++) {
              s = arguments[i];
              for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
          }
          return t;
      };
      return __assign.apply(this, arguments);
  };

  function __awaiter(thisArg, _arguments, P, generator) {
      return new (P || (P = Promise))(function (resolve, reject) {
          function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
          function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
          function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
          step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
  }

  function __generator(thisArg, body) {
      var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
      return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
      function verb(n) { return function (v) { return step([n, v]); }; }
      function step(op) {
          if (f) throw new TypeError("Generator is already executing.");
          while (_) try {
              if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
              if (y = 0, t) op = [op[0] & 2, t.value];
              switch (op[0]) {
                  case 0: case 1: t = op; break;
                  case 4: _.label++; return { value: op[1], done: false };
                  case 5: _.label++; y = op[1]; op = [0]; continue;
                  case 7: op = _.ops.pop(); _.trys.pop(); continue;
                  default:
                      if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                      if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                      if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                      if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                      if (t[2]) _.ops.pop();
                      _.trys.pop(); continue;
              }
              op = body.call(thisArg, _);
          } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
          if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
      }
  }

  var Component = /** @class */ (function () {
      function Component(game) {
          this._game = game;
          this._eventEmitter = game.eventEmitter;
      }
      return Component;
  }());
  //# sourceMappingURL=Component.js.map

  var DIRECTION_KEY_CODES = {
      'KeyW': 'up', 'ArrowUp': 'up',
      'KeyA': 'left', 'ArrowLeft': 'left',
      'KeyD': 'right', 'ArrowRight': 'right',
      'KeyS': 'down', 'ArrowDown': 'down'
  };
  var KeyboardManager = /** @class */ (function (_super) {
      __extends(KeyboardManager, _super);
      function KeyboardManager(game) {
          var _this = _super.call(this, game) || this;
          _this._currentDirection = null;
          _this._bindWindowEvents = function () {
              window.addEventListener('keydown', _this._handleKeyDownEvent, false);
              window.addEventListener('keyup', _this._handleKeyUpEvent, false);
          };
          _this._handleKeyDownEvent = function (event) {
              var code = event.code;
              if (!DIRECTION_KEY_CODES.hasOwnProperty(code))
                  return;
              var keyDirection = DIRECTION_KEY_CODES[code];
              _this._currentDirection = keyDirection;
              _this._eventEmitter.emit('KeyboardManager:changeDirection', keyDirection);
          };
          _this._handleKeyUpEvent = function (event) {
              var code = event.code;
              if (!DIRECTION_KEY_CODES.hasOwnProperty(code))
                  return;
              var keyDirection = DIRECTION_KEY_CODES[code];
              if (_this._currentDirection === keyDirection) {
                  _this._currentDirection = null;
                  _this._eventEmitter.emit('KeyboardManager:changeDirection', null);
              }
          };
          _this.getDirection = function () {
              return _this._currentDirection;
          };
          _this._bindWindowEvents();
          return _this;
      }
      return KeyboardManager;
  }(Component));
  //# sourceMappingURL=KeyboardManager.js.map

  var Game = /** @class */ (function () {
      function Game() {
          var _this = this;
          /* UTILS */
          this.eventEmitter = new EventEmitter();
          /* COMPONENTS */
          this.renderer = new Renderer(this);
          this.loader = new Loader(this);
          this.ground = new Ground(this);
          this.character = new Character(this, { x: 5, y: 3, mediaSource: 'img/example-outfit.png' });
          this.keyboardManager = new KeyboardManager(this);
          this.ground.load('img/example-map.png').then(function (test) {
              _this.loader.hide();
              _this.renderer.setGround(_this.ground);
              _this.renderer.setCentralPoint(_this.character);
              _this.renderer.show();
              _this.renderer.startRender();
          });
      }
      return Game;
  }());
  //# sourceMappingURL=Game.js.map

  var GRID_SIZE = 32;
  var STEP_TIME = 1000 / 6.5;
  //# sourceMappingURL=config.js.map

  var Renderer = /** @class */ (function (_super) {
      __extends(Renderer, _super);
      function Renderer(game) {
          var _this = _super.call(this, game) || this;
          _this._isRendering = false;
          _this._canvas = document.body.appendChild(document.createElement('canvas'));
          _this._context = _this._canvas.getContext('2d');
          _this._ground = null;
          _this._centralPoint = null;
          _this._drawableList = [];
          _this._width = window.innerWidth;
          _this._height = window.innerHeight;
          _this._bindCanvasEvents = function () {
              window.addEventListener('resize', _this._fitCanvasToWindow, false);
              _this._canvas.addEventListener('click', _this._handleCanvasClick, false);
          };
          _this._getOrderedDrawObjects = function () {
              var _a = _this, _drawableList = _a._drawableList, _centralPoint = _a._centralPoint;
              var drawObjects = _drawableList.concat([_centralPoint]).map(function (drawableObject) { return drawableObject.getDrawData(); });
              return drawObjects.sort(function (a, b) { return a.zIndex > b.zIndex ? 1 : -1; });
          };
          _this._handleCanvasClick = function (_a) {
              var x = _a.clientX, y = _a.clientY;
              var drawObjects = _this._getOrderedDrawObjects();
              var _b = _this.getMapPosition(), mapX = _b.x, mapY = _b.y;
              for (var _i = 0, drawObjects_1 = drawObjects; _i < drawObjects_1.length; _i++) {
                  var object = drawObjects_1[_i];
                  var startX = object.x + mapX;
                  var endX = startX + object.width;
                  var startY = object.y + mapY;
                  var endY = startY + object.height;
                  if (x >= startX && x <= endX && y >= startY && y <= endY) {
                      if (object.onClick) {
                          object.onClick({ x: x, y: y });
                      }
                      return;
                  }
              }
              _this._eventEmitter.emit('renderer:canvasClick');
          };
          _this._fitCanvasToWindow = function () {
              _this._canvas.width = _this._width = window.innerWidth;
              _this._canvas.height = _this._height = window.innerHeight;
              _this._eventEmitter.emit('renderer:canvasResize');
          };
          _this.hide = function () {
              _this._canvas.style.display = 'none';
              _this._eventEmitter.emit('renderer:canvasHide');
          };
          _this.show = function () {
              _this._canvas.removeAttribute('style');
              _this._eventEmitter.emit('renderer:canvasShow');
          };
          _this.addDrawable = function (drawableObject) {
              _this._drawableList.push(drawableObject);
          };
          _this.removeDrawable = function (drawableObject) {
              _this._drawableList = _this._drawableList.filter(function (item) { return item !== drawableObject; });
          };
          _this.setGround = function (ground) {
              _this._ground = ground;
          };
          _this.setCentralPoint = function (centralPoint) {
              _this._centralPoint = centralPoint;
          };
          _this.startRender = function () {
              _this._isRendering = true;
              requestAnimationFrame(_this._render);
          };
          _this.getMapPosition = function () {
              var _a = _this, _ground = _a._ground, _centralPoint = _a._centralPoint, _width = _a._width, _height = _a._height;
              var drawableCentralPoint = _centralPoint.getDrawData();
              var drawableGround = _ground.getDrawData();
              var offsetX = Math.max(0, (_width - drawableGround.width) / 2);
              var offsetY = Math.max(0, (_height - drawableGround.height) / 2);
              var centralPointAverageX = drawableCentralPoint.x * GRID_SIZE + drawableCentralPoint.width / 2;
              var centralPointAverageY = drawableCentralPoint.y * GRID_SIZE + drawableCentralPoint.height / 2;
              var x = -Math.min(Math.max(0, centralPointAverageX - _width / 2), (drawableGround.width - _width + offsetX));
              var y = -Math.min(Math.max(0, centralPointAverageY - _height / 2), drawableGround.height - _height + offsetY);
              return { x: x, y: y };
          };
          _this._render = function (time) {
              if (_this._isRendering) {
                  requestAnimationFrame(_this._render);
              }
              Animator.update(time);
              var _a = _this, _width = _a._width, _height = _a._height, _context = _a._context, _ground = _a._ground;
              var drawableGround = _ground.getDrawData();
              var _b = _this.getMapPosition(), mapX = _b.x, mapY = _b.y;
              var orderedDrawObjects = _this._getOrderedDrawObjects();
              _context.clearRect(0, 0, _width, _height);
              _context.drawImage(drawableGround.background, mapX, mapY);
              for (var _i = 0, orderedDrawObjects_1 = orderedDrawObjects; _i < orderedDrawObjects_1.length; _i++) {
                  var drawableObject = orderedDrawObjects_1[_i];
                  var defaults = {
                      backgroundPosition: { x: 0, y: 0 },
                      backgroundSize: { width: drawableObject.width, height: drawableObject.height }
                  };
                  var _c = __assign({}, defaults, drawableObject), x = _c.x, y = _c.y, width = _c.width, height = _c.height, background = _c.background, backgroundPosition = _c.backgroundPosition, backgroundSize = _c.backgroundSize;
                  _context.drawImage(background, backgroundPosition.x, backgroundPosition.y, backgroundSize.width, backgroundSize.height, (GRID_SIZE - width) + GRID_SIZE * x + mapX, (GRID_SIZE - height) + GRID_SIZE * y + mapY, width, height);
              }
          };
          _this.hide();
          _this._bindCanvasEvents();
          _this._fitCanvasToWindow();
          return _this;
      }
      return Renderer;
  }(Component));
  //# sourceMappingURL=Renderer.js.map

  var Loader = /** @class */ (function (_super) {
      __extends(Loader, _super);
      function Loader(game) {
          var _this = _super.call(this, game) || this;
          _this.hide = function () {
              _this._ref.classList.add('loader--hidden');
              _this._eventEmitter.emit('loader:hide');
          };
          _this.show = function () {
              _this._ref.classList.remove('loader-hidden');
              _this._eventEmitter.emit('loader:show');
          };
          _this._ref = document.getElementById('loader');
          return _this;
      }
      return Loader;
  }(Component));
  //# sourceMappingURL=Loader.js.map

  var Ground = /** @class */ (function (_super) {
      __extends(Ground, _super);
      function Ground(game) {
          var _this = _super.call(this, game) || this;
          _this.loaded = false;
          _this.load = function (mediaSource) {
              return MediaLoader.load(mediaSource).then(function (media) {
                  _this._media = media;
                  _this.loaded = true;
                  return Promise.resolve(media);
              });
          };
          _this.getDrawData = function () {
              var width = Number(_this._media.width);
              var height = Number(_this._media.height);
              var data = { width: width, height: height, background: _this._media };
              return data;
          };
          return _this;
      }
      Object.defineProperty(Ground.prototype, "width", {
          get: function () {
              return Number(this._media.width) / GRID_SIZE;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(Ground.prototype, "height", {
          get: function () {
              return Number(this._media.height) / GRID_SIZE;
          },
          enumerable: true,
          configurable: true
      });
      return Ground;
  }(Component));
  //# sourceMappingURL=Ground.js.map

  // temporary fix for the unloaded objects
  var _unloadedCharacter = document.createElement('canvas');
  var _unloadedCharacterContext = _unloadedCharacter.getContext('2d');
  _unloadedCharacterContext.fillStyle = '#000';
  _unloadedCharacterContext.fillRect(0, 0, 32, 32);
  var Character = /** @class */ (function (_super) {
      __extends(Character, _super);
      function Character(game, data) {
          var _this = _super.call(this, game) || this;
          _this._loaded = false;
          _this._zIndex = 1;
          _this._backgroundSize = { width: 32, height: 48 };
          _this._backgroundPosition = { x: 0, y: 0 };
          _this._currentSteps = { up: 0, left: 0, right: 0, down: 0 };
          _this._currentDirection = null;
          _this._walkLock = false;
          _this._parseDirection = function (direction) {
              _this._currentDirection = direction;
              var _a = _this, x = _a.x, y = _a.y;
              var backgroundPositionY;
              switch (direction) {
                  case 'up':
                      y -= 1;
                      backgroundPositionY = 144;
                      break;
                  case 'down':
                      y += 1;
                      backgroundPositionY = 0;
                      break;
                  case 'left':
                      x -= 1;
                      backgroundPositionY = 48;
                      break;
                  case 'right':
                      backgroundPositionY = 96;
                      x += 1;
                      break;
                  default:
                      return;
              }
              _this._goTowards(x, y, backgroundPositionY, direction);
          };
          _this._goTowards = function (x, y, backgroundPositionY, direction) { return __awaiter(_this, void 0, void 0, function () {
              var currentStep, currentPosition;
              var _this = this;
              return __generator(this, function (_a) {
                  switch (_a.label) {
                      case 0:
                          if (!this._walkLock) {
                              this._backgroundPosition.y = backgroundPositionY;
                          }
                          if (this._walkLock || x < 0 || y < 0 || x >= this._game.ground.width || y >= this._game.ground.height) {
                              return [2 /*return*/];
                          }
                          this._walkLock = true;
                          currentStep = this._currentSteps[direction];
                          currentPosition = currentStep * 64;
                          return [4 /*yield*/, Animator.to(this, { x: x, y: y }, STEP_TIME, function (percentage) {
                                  if (percentage > .75) {
                                      _this._backgroundPosition.x = (currentPosition + 64) % 128;
                                  }
                                  else if (percentage > .25) {
                                      _this._backgroundPosition.x = (currentPosition + 32) % 128;
                                  }
                              })];
                      case 1:
                          _a.sent();
                          this._currentSteps[direction] = (this._currentSteps[direction] + 1) % 2;
                          this._backgroundPosition.x = this._currentSteps[direction] * 64;
                          this._walkLock = false;
                          this._parseDirection(this._currentDirection);
                          return [2 /*return*/];
                  }
              });
          }); };
          _this._loadImage = function (source) { return __awaiter(_this, void 0, void 0, function () {
              var _a;
              return __generator(this, function (_b) {
                  switch (_b.label) {
                      case 0:
                          _a = this;
                          return [4 /*yield*/, MediaLoader.load(source)];
                      case 1:
                          _a._background = _b.sent();
                          this._loaded = true;
                          this._width = Number(this._background.width) / 4;
                          this._height = Number(this._background.height) / 4;
                          return [2 /*return*/];
                  }
              });
          }); };
          _this.getDrawData = function () {
              var _a = _this, x = _a.x, y = _a.y, _width = _a._width, _height = _a._height, _zIndex = _a._zIndex, _background = _a._background, _loaded = _a._loaded, _backgroundSize = _a._backgroundSize, _backgroundPosition = _a._backgroundPosition;
              if (!_loaded) {
                  return { x: x, y: y, zIndex: _zIndex, width: 32, height: 48, background: _unloadedCharacter };
              }
              return { x: x, y: y, zIndex: _zIndex, width: _width, height: _height, background: _background, backgroundSize: _backgroundSize, backgroundPosition: _backgroundPosition, onClick: function (e) { return console.log(e); } };
          };
          _this.x = _this.realX = data.x;
          _this.y = _this.realY = data.y;
          _this._loadImage(data.mediaSource);
          _this._eventEmitter.on('KeyboardManager:changeDirection', _this._parseDirection);
          return _this;
      }
      return Character;
  }(Component));

  new Game();
  //# sourceMappingURL=index.js.map

}());
//# sourceMappingURL=index.js.map
