"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setSplashView = setSplashView;
exports.initialize = initialize;
exports.launch = launch;
exports.isExistsApp = isExistsApp;
exports.getRuningAppid = getRuningAppid;
exports.getAppVersionInfo = getAppVersionInfo;
exports.getAppBasePath = getAppBasePath;
exports.getCurrentPageUrl = getCurrentPageUrl;
exports.closeCurrentApp = closeCurrentApp;
exports.releaseWgtToRunPathFromPath = releaseWgtToRunPathFromPath;
exports.onMenuClick = onMenuClick;
exports.onEventReceive = onEventReceive;
exports.onAppClose = onAppClose;
exports.onAppCapsuleClose = onAppCapsuleClose;

var _react = _interopRequireWildcard(require("react"));

var _reactNative = require("react-native");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class NormalSplashView extends _react.Component {
  render() {
    return /*#__PURE__*/_react.default.createElement(_reactNative.View, {
      style: {
        flex: 1,
        backgroundColor: '#ff0',
        alignItems: 'center',
        justifyContent: 'center'
      }
    }, /*#__PURE__*/_react.default.createElement(_reactNative.Text, null, "\u542F\u52A8\u5C4F:", this.props.appid));
  }

}

let splashView;

_reactNative.AppRegistry.registerComponent('UniModules.uniSplashView', () => {
  return splashView || NormalSplashView;
});

const Uni = _reactNative.NativeModules.Uni;
const uniEmitter = new _reactNative.NativeEventEmitter(Uni);

/**
 * 设置小程序启动屏
 * @param component
 */
function setSplashView(component) {
  splashView = component;
}
/**
 * 初始化框架
 * @param params
 */


function initialize(params = {}) {
  return Uni.initialize(_objectSpread({
    items: [],
    capsule: true,
    fontSize: '16px',
    fontColor: '#000',
    fontWeight: 'normal'
  }, params));
}

/**
 * 启动参数
 * @param arg
 * @returns {*}
 */
function launch(arg) {
  if (arg.params && _reactNative.Platform.OS === 'android') {
    //将参数转化为json字符串免得转化
    arg.params = JSON.stringify(arg.params);
  }

  return Uni.launch(arg);
}
/**
 * 是否存在小程序
 * @param appid
 * @returns {*}
 */


function isExistsApp(appid) {
  return Uni.isExistsApp(appid);
}
/**
 * 获取真正运行的小程序id
 * @returns {*}
 */


function getRuningAppid() {
  return Uni.getRuningAppid();
}
/**
 * 获取小程序版本信息
 * @param appid
 * @returns {*}
 */


function getAppVersionInfo(appid) {
  return Uni.getAppVersionInfo(appid);
}
/**
 * 获取小程序运行路径
 * @returns {*}
 */


function getAppBasePath(appid) {
  return _reactNative.Platform.OS === 'android' ? Uni.getAppBasePath() : Uni.getAppBasePath(appid);
}
/**
 * 获取当前小程序的直连url
 * @returns {*}
 */


function getCurrentPageUrl() {
  return Uni.getCurrentPageUrl();
}
/**
 * 关闭当前小程序
 * @returns {*}
 */


function closeCurrentApp() {
  return Uni.closeCurrentApp();
}
/**
 * 释放wgt文件
 * @returns {*}
 */


function releaseWgtToRunPathFromPath(path) {
  return Uni.releaseWgtToRunPathFromPath(path);
}
/**
 * 监听胶囊自定义按键启动
 * @returns {EmitterSubscription}
 */


function onMenuClick(cb) {
  return uniEmitter.addListener('MenuItemClick', cb);
}
/**
 * 监听小程序向app发送的消息
 * @param cb
 * @return {EmitterSubscription}
 */


function onEventReceive(cb) {
  return uniEmitter.addListener('UniMPEventReceive', data => {
    if (_reactNative.Platform.OS === 'android') {
      try {
        data = JSON.parse(data);
      } catch (e) {}
    }

    cb(data);
  });
}
/**
 * 监听小程序关闭
 * @param cb
 * @returns {EmitterSubscription}
 */


function onAppClose(cb) {
  return uniEmitter.addListener('UniMPOnClose', cb);
}

function onAppCapsuleClose(cb) {
  return uniEmitter.addListener('UniMPOnCapsuleClose', cb);
}


//# sourceMappingURL=index.js.map