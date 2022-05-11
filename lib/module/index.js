function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * User: puti.
 * 
 * Time: 2020/6/16 21:25 下午.
 */
import React, { Component } from 'react';
import { AppRegistry, NativeEventEmitter, NativeModules, Platform, Text, View } from 'react-native';

class NormalSplashView extends Component {
  render() {
    return /*#__PURE__*/React.createElement(View, {
      style: {
        flex: 1,
        backgroundColor: '#ff0',
        alignItems: 'center',
        justifyContent: 'center'
      }
    }, /*#__PURE__*/React.createElement(Text, null, "\u542F\u52A8\u5C4F:", this.props.appid));
  }

}

let splashView;
AppRegistry.registerComponent('UniModules.uniSplashView', () => {
  return splashView || NormalSplashView;
});
const Uni = NativeModules.Uni;
const uniEmitter = new NativeEventEmitter(Uni);

/**
 * 设置小程序启动屏
 * @param component
 */
export function setSplashView(component) {
  splashView = component;
}
/**
 * 初始化框架
 * @param params
 */

export function initialize(params = {}) {
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
export function launch(arg) {
  if (arg.params && Platform.OS === 'android') {
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

export function isExistsApp(appid) {
  return Uni.isExistsApp(appid);
}
/**
 * 获取真正运行的小程序id
 * @returns {*}
 */

export function getRuningAppid() {
  return Uni.getRuningAppid();
}
/**
 * 获取小程序版本信息
 * @param appid
 * @returns {*}
 */

export function getAppVersionInfo(appid) {
  return Uni.getAppVersionInfo(appid);
}
/**
 * 获取小程序运行路径
 * @returns {*}
 */

export function getAppBasePath(appid) {
  return Platform.OS === 'android' ? Uni.getAppBasePath() : Uni.getAppBasePath(appid);
}
/**
 * 获取当前小程序的直连url
 * @returns {*}
 */

export function getCurrentPageUrl() {
  return Uni.getCurrentPageUrl();
}
/**
 * 关闭当前小程序
 * @returns {*}
 */

export function closeCurrentApp() {
  return Uni.closeCurrentApp();
}
/**
 * 释放wgt文件
 * @returns {*}
 */

export function releaseWgtToRunPathFromPath(path) {
  return Uni.releaseWgtToRunPathFromPath(path);
}
/**
 * 监听胶囊自定义按键启动
 * @returns {EmitterSubscription}
 */

export function onMenuClick(cb) {
  return uniEmitter.addListener('MenuItemClick', cb);
}
/**
 * 监听小程序向app发送的消息
 * @param cb
 * @return {EmitterSubscription}
 */

export function onEventReceive(cb) {
  return uniEmitter.addListener('UniMPEventReceive', data => {
    if (Platform.OS === 'android') {
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

export function onAppClose(cb) {
  return uniEmitter.addListener('UniMPOnClose', cb);
}

export function onAppCapsuleClose(cb) {
  return uniEmitter.addListener('UniMPOnCapsuleClose', cb);
}


//# sourceMappingURL=index.js.map