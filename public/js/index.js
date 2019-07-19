(function () {
    'use strict';

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

    var Store = /** @class */ (function () {
        function Store() {
            var _this = this;
            this.components = {};
            this.eventHandlers = {};
            this.state = {};
            this.set = function (newState) {
                _this.state = __assign({}, _this.state, newState);
            };
            this.get = function (key) {
                var result = _this.state;
                if (key) {
                    result = _this.state[key];
                }
                if (typeof result === 'object')
                    return __assign({}, result);
                return result;
            };
            this.on = function (name, handler) {
                if (!_this.eventHandlers.hasOwnProperty(name)) {
                    _this.eventHandlers[name] = [handler];
                    return;
                }
                if (_this.eventHandlers[name].includes(handler)) {
                    throw new Error("Store.on(): This handler has been already registered!");
                }
                _this.eventHandlers[name].push(handler);
            };
            this.off = function (name, handler) {
                if (!_this.eventHandlers.hasOwnProperty(name)) {
                    throw new Error("Store.off(): Trying to remove handler from unknown type: " + name + "!");
                }
                if (!_this.eventHandlers[name].includes(handler)) {
                    throw new Error("Store.off(): Trying to remove unknown handler!");
                }
                _this.eventHandlers[name].splice(_this.eventHandlers[name].indexOf(handler), 1);
            };
            this.emit = function (name, payload) {
                if (!_this.eventHandlers.hasOwnProperty(name)) {
                    console.warn("Store.emit(): Any handler for event " + name + " does not exists!");
                    return;
                }
                _this.eventHandlers[name].forEach(function (handler) {
                    handler(payload);
                });
            };
            this.registerComponent = function (name, value) {
                if (_this.components.hasOwnProperty(name)) {
                    throw new Error("Store.register(): Component \"" + name + "\" is already registered!");
                }
                _this.components[name] = value;
            };
            this.getComponent = function (name) {
                if (Array.isArray(name)) {
                    return name.map(function (component) { return _this.get(component); });
                }
                if (!_this.components.hasOwnProperty(name)) {
                    throw new Error("Store.get(): Component " + name + " is not registered!");
                }
                return _this.components[name];
            };
        }
        return Store;
    }());
    //# sourceMappingURL=Store.js.map

    var Renderer = /** @class */ (function () {
        function Renderer() {
            var _this = this;
            this.drawableList = [
                { x: 50, y: 50, width: 100, height: 100, backgroundColor: 'red' }
            ];
            this.render = function () {
                requestAnimationFrame(_this.render);
                _this.context.clearRect(0, 0, window.innerWidth, window.innerHeight);
                for (var _i = 0, _a = _this.drawableList; _i < _a.length; _i++) {
                    var _b = _a[_i], x = _b.x, y = _b.y, width = _b.width, height = _b.height, backgroundColor = _b.backgroundColor, image = _b.image, zIndex = _b.zIndex, click = _b.click;
                    if (!backgroundColor && !image) {
                        console.error('Renderer.render(): There is nothing to render, ignoring...');
                        continue;
                    }
                    if (backgroundColor) {
                        _this.context.fillStyle = backgroundColor;
                        _this.context.fillRect(x, y, width, height);
                    }
                }
            };
            this._moveRect = function () {
                // :D
                setInterval(function () {
                    var random = Math.random();
                    var value = Math.random() >= .5 ? 10 : -10;
                    if (random < .25) {
                        _this.drawableList[0].x += value;
                    }
                    else if (random < .5) {
                        _this.drawableList[0].y += value;
                    }
                    else if (random < .75) {
                        _this.drawableList[0].width += value;
                    }
                    else {
                        _this.drawableList[0].height += value;
                    }
                }, 100);
            };
            this._bindResizeEvents = function () {
                var EVENT_NAMES = ['resize'];
                EVENT_NAMES.forEach(function (eventName) {
                    window.addEventListener(eventName, _this._fitCanvasToWindow, false);
                });
            };
            this._fitCanvasToWindow = function () {
                _this._resizeCanvas({
                    width: window.innerWidth,
                    height: window.innerHeight
                });
            };
            this._resizeCanvas = function (_a) {
                var width = _a.width, height = _a.height;
                Object.assign(_this.canvas, { width: width, height: height });
            };
            this._createCanvas = function () {
                var canvas = document.createElement('canvas');
                var context = canvas.getContext('2d');
                document.body.appendChild(canvas);
                Object.assign(_this, { canvas: canvas, context: context });
            };
            this._createCanvas();
            this._bindResizeEvents();
            this._fitCanvasToWindow();
            this._moveRect();
        }
        return Renderer;
    }());

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
            this.components = { Renderer: Renderer, Loader: Loader };
            this.store = new Store();
            this.registerComponents = function () {
                Object.entries(_this.components).forEach(function (_a) {
                    var name = _a[0], Component = _a[1];
                    _this.store.registerComponent(name, new Component(_this.store));
                });
            };
            this.registerComponents();
            this.store.getComponent('Loader').hide();
            this.store.getComponent('Renderer').render();
        }
        return Game;
    }());
    var game = new Game();
    //# sourceMappingURL=index.js.map

}());
//# sourceMappingURL=index.js.map
