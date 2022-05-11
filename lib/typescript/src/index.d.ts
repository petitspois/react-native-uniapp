/**
 * User: puti.
 * @flow
 * Time: 2020/6/16 21:25 下午.
 */
import { ComponentType } from 'react';
declare type Config = {
    items?: {
        title: string;
        key: string;
    }[];
    capsule?: boolean;
    fontSize?: string;
    fontColor?: string;
    fontWeight?: string;
};
/**
 * 设置小程序启动屏
 * @param component
 */
export declare function setSplashView(component: ComponentType<{
    appid: string;
}>): void;
/**
 * 初始化框架
 * @param params
 */
export declare function initialize(params?: Config): Promise<boolean>;
declare type LaunchArgs = {
    appid: string;
    params?: Object;
    path?: string;
};
/**
 * 启动参数
 * @param arg
 * @returns {*}
 */
export declare function launch(arg: LaunchArgs): Promise<boolean>;
/**
 * 是否存在小程序
 * @param appid
 * @returns {*}
 */
export declare function isExistsApp(appid: string): Promise<boolean>;
/**
 * 获取真正运行的小程序id
 * @returns {*}
 */
export declare function getRuningAppid(): Promise<string | null>;
/**
 * 获取小程序版本信息
 * @param appid
 * @returns {*}
 */
export declare function getAppVersionInfo(appid: string): Promise<{
    name: string;
    code: number;
} | null>;
/**
 * 通讯小程序
 * @returns {*}
 */
export declare function sendEvent(event:string,data:any): Promise<string>;
/**
 * 获取小程序运行路径
 * @returns {*}
 */
export declare function getAppBasePath(appid: string): Promise<string>;
/**
 * 获取当前小程序的直连url
 * @returns {*}
 */
export declare function getCurrentPageUrl(): Promise<string>;
/**
 * 关闭当前小程序
 * @returns {*}
 */
export declare function closeCurrentApp(): Promise<boolean>;
/**
 * 释放wgt文件
 * @returns {*}
 */
export declare function releaseWgtToRunPathFromPath(path: string): Promise<boolean>;
/**
 * 监听胶囊自定义按键启动
 * @returns {EmitterSubscription}
 */
export declare function onMenuClick(cb: (key: any) => void): import("react-native").EmitterSubscription;
/**
 * 监听小程序向app发送的消息
 * @param cb
 * @return {EmitterSubscription}
 */
export declare function onEventReceive(cb: (data: any) => void): import("react-native").EmitterSubscription;
/**
 * 监听小程序关闭
 * @param cb
 * @returns {EmitterSubscription}
 */
export declare function onAppClose(cb: () => void): import("react-native").EmitterSubscription;
/**
 * 监听小程序隐藏
 * @param cb
 * @returns {EmitterSubscription}
 */
export declare function onAppCapsuleClose(cb: () => void): import("react-native").EmitterSubscription;
export {};
