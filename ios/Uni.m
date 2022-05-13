//
//  Uni.m
//
//  Created by puti on 2020/6/16.
//

#import <Foundation/Foundation.h>
#import "Uni.h"
#import <React/RCTRootView.h>
#import <React/RCTBundleURLProvider.h>
#define UNIErrorDomain @" An Error Has Occurred"





@implementation Uni{
   bool hasListeners;
   DCUniMPInstance *uniMPInstance;
}
RCT_EXPORT_MODULE();
- (dispatch_queue_t)methodQueue
{
  return dispatch_get_main_queue();
}
RCT_EXPORT_METHOD(initialize:(NSDictionary *)params  findEventsWithResolver:(RCTPromiseResolveBlock)resolve
rejecter:(RCTPromiseRejectBlock)reject)
{
  NSArray *items = params[@"items"];
  NSMutableArray *sheetItems = [NSMutableArray array];
    DCUniMPCapsuleButtonStyle *capsuleButtonStyle = [DCUniMPCapsuleButtonStyle new];
    // 胶囊按钮背景颜色
    capsuleButtonStyle.backgroundColor = @"rgba(255, 255, 255,0.1)";
    // 胶囊按钮 “···｜x” 的字体颜色
    capsuleButtonStyle.textColor = @"#5E565D";
    // 胶囊按钮按下状态背景颜色
    capsuleButtonStyle.highlightColor = @"rgba(255, 255, 255,0.1)";
    // 胶囊按钮边框颜色
    capsuleButtonStyle.borderColor = @"#DEE0E3";
    // 设置样式
    [DCUniMPSDKEngine configCapsuleButtonStyle:capsuleButtonStyle];
  for (int i=0; i<items.count; i++) {
      NSLog(@"-> %@",items[i]);
    [sheetItems addObject:[[DCUniMPMenuActionSheetItem alloc] initWithTitle:items[i][@"title"] identifier:items[i][@"key"]]];
  }
    
     [DCUniMPSDKEngine setDefaultMenuItems:sheetItems];
     [DCUniMPSDKEngine setCapsuleButtonHidden:!params[@"capsule"]];
     [DCUniMPSDKEngine setDelegate:self];
     resolve([NSNumber numberWithBool:true]);
}
RCT_EXPORT_METHOD(launch:(NSDictionary *)arg  findEventsWithResolver:(RCTPromiseResolveBlock)resolve
rejecter:(RCTPromiseRejectBlock)reject)
{
  DCUniMPConfiguration *configuration = [[DCUniMPConfiguration alloc] init];
  NSString *appid = arg[@"appid"];
  configuration.enableGestureClose = true;  //开启侧滑手势关闭小程序
  configuration.enableBackground = false;  //关闭后台运行
  configuration.showAnimated = true;
  configuration.openMode = DCUniMPOpenModePush;  // 使用push方式打开小程序
  configuration.path = arg[@"path"];
  configuration.extraData = arg[@"params"];
  
  if (![DCUniMPSDKEngine isExistsUniMP:appid]) {
      // 读取导入到工程中的wgt应用资源
      NSString *appResourcePath = [[NSBundle mainBundle] pathForResource:appid ofType:@"wgt"];
      if (!appResourcePath) {
        reject(@"-1",@"资源不存在",[NSError errorWithDomain:UNIErrorDomain code:-1 userInfo:@{}]);
          return;
      }
      
      // 将应用资源部署到运行路径中
      NSError *error;
      if (![DCUniMPSDKEngine installUniMPResourceWithAppid:appid resourceFilePath:appResourcePath password:nil error:&error]) {
       if (!appResourcePath) {
         reject(@"-1",@"部署不成功",[NSError errorWithDomain:UNIErrorDomain code:-1 userInfo:@{}]);
      
           return;
       }
      }
  }
    
  // 打开小程序
  [DCUniMPSDKEngine openUniMP:appid configuration:configuration completed:^(DCUniMPInstance * _Nullable uniMPInstance, NSError * _Nullable error) {

           if (uniMPInstance) {
               self.uniMPInstance = uniMPInstance;
               resolve([NSNumber numberWithBool:true]);
           } else {
               NSLog(@"打开小程序出错：%@",error);
           }
  }];
}

RCT_EXPORT_METHOD(getAppVersionInfo:(NSString *)appid  findEventsWithResolver:(RCTPromiseResolveBlock)resolve
rejecter:(RCTPromiseRejectBlock)reject)
{
  NSDictionary *info = [DCUniMPSDKEngine getUniMPVersionInfoWithAppid:appid];
  resolve(info);
}
RCT_EXPORT_METHOD(isExistsApp:(NSString *)appid  findEventsWithResolver:(RCTPromiseResolveBlock)resolve
rejecter:(RCTPromiseRejectBlock)reject)
{
  BOOL isExistsApp = [DCUniMPSDKEngine isExistsUniMP:appid];
  resolve([NSNumber numberWithBool:isExistsApp]);
}

RCT_EXPORT_METHOD(getAppBasePath:(NSString *)appid  findEventsWithResolver:(RCTPromiseResolveBlock)resolve
rejecter:(RCTPromiseRejectBlock)reject)
{
  resolve([DCUniMPSDKEngine getUniMPRunPathWithAppid:appid]);
}
RCT_EXPORT_METHOD(getCurrentPageUrl:(RCTPromiseResolveBlock)resolve
rejecter:(RCTPromiseRejectBlock)reject)
{
  resolve([DCUniMPSDKEngine getCurrentPageUrl]);
}

RCT_EXPORT_METHOD(getRuningAppid:(RCTPromiseResolveBlock)resolve
rejecter:(RCTPromiseRejectBlock)reject)
{
  resolve([DCUniMPSDKEngine getActiveUniMPAppid]);
}
RCT_EXPORT_METHOD(closeCurrentApp:(RCTPromiseResolveBlock)resolve
rejecter:(RCTPromiseRejectBlock)reject)
{
    [self.uniMPInstance closeWithCompletion:^(BOOL success, NSError * _Nullable error) {
        if (success) {
            resolve([NSNumber numberWithBool:true]);
            NSLog(@"小程序被关闭了");
        }
  }];
//  [DCUniMPSDKEngine closeUniMP];
//  resolve([NSNumber numberWithBool:true]);
}

RCT_EXPORT_METHOD(hideCurrentApp:(RCTPromiseResolveBlock)resolve
rejecter:(RCTPromiseRejectBlock)reject)
{
    [self.uniMPInstance hideWithCompletion:^(BOOL success, NSError * _Nullable error) {
        if (success) {
            resolve([NSNumber numberWithBool:true]);
            NSLog(@"小程序隐藏了");
        }
  }];
}

RCT_EXPORT_METHOD(showCurrentApp:(RCTPromiseResolveBlock)resolve
rejecter:(RCTPromiseRejectBlock)reject)
{
    [self.uniMPInstance showWithCompletion:^(BOOL success, NSError * _Nullable error) {
        if (success) {
            resolve([NSNumber numberWithBool:true]);
            NSLog(@"小程序显示了");
        }
  }];
}



RCT_EXPORT_METHOD(releaseWgtToRunPathFromPath:(NSString *)path findEventsWithResolver:(RCTPromiseResolveBlock)resolve
rejecter:(RCTPromiseRejectBlock)reject)
{
  NSString *appid = [[path lastPathComponent] stringByDeletingPathExtension];
  NSError *error;
  BOOL success = [DCUniMPSDKEngine installUniMPResourceWithAppid:appid resourceFilePath:path password:nil error:&error];
  resolve([NSNumber numberWithBool:success]);
}

RCT_EXPORT_METHOD(sendEvent:(NSString *)name eventData:(NSDictionary *)data findEventsWithResolver:(RCTPromiseResolveBlock)resolve
rejecter:(RCTPromiseRejectBlock)reject)
{
  [DCUniMPSDKEngine sendUniMPEvent:name data:data];
  resolve([NSNumber numberWithBool:true]);
}

- (NSArray<NSString *> *)supportedEvents
{
    return @[@"MenuItemClick",@"UniMPEventReceive",@"UniMPOnClose",@"UniMPOnCapsuleClose"];
}
- (void)defaultMenuItemClicked:(NSString *)identifier {
  if(hasListeners){
     [self sendEventWithName:@"MenuItemClick" body:identifier];
  }
}
- (void)onUniMPEventReceive:(NSString *)event data:(id)data callback:(DCUniMPKeepAliveCallback)callback {

    NSLog(@"Receive UniMP event: %@ data: %@",event,data);
    if(hasListeners){
        [self sendEventWithName:@"UniMPEventReceive" body:@{@"event":event,@"res":data}];
    }
    // 回传数据给小程序
    // DCUniMPKeepAliveCallback 用法请查看定义说明
    if (callback) {
        callback(@"native callback message",NO);
    }
}

- (UIView *)splashViewForApp:(NSString *)appid{
  return [[RCTRootView alloc] initWithBridge: self.bridge moduleName:@"UniModules.uniSplashView" initialProperties:@{@"appid":appid}];
}
- (void)uniMPOnClose:(NSString *)appid{
  if(hasListeners){
   [self sendEventWithName:@"UniMPOnClose" body:appid];
  }
}

///  监听关闭按钮点击
- (void)closeButtonClicked:(NSString *)appid {
    if(hasListeners){
     [self sendEventWithName:@"UniMPOnCapsuleClose" body:appid];
    }
}


// 在添加第一个监听函数时触发
-(void)startObserving {
    hasListeners = YES;
    // Set up any upstream listeners or background tasks as necessary
}

// Will be called when this module's last listener is removed, or on dealloc.
-(void)stopObserving {
    hasListeners = NO;
    // Remove upstream listeners, stop unnecessary background tasks
}


@end
