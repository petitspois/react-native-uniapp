#import <React/RCTBridgeModule.h>
#import "DCUniMP.h"
#import <React/RCTEventEmitter.h>
#import <React/RCTBridgeDelegate.h>
@interface Uni : RCTEventEmitter <RCTBridgeModule,DCUniMPSDKEngineDelegate,RCTBridgeDelegate>
@property (nonatomic, weak) DCUniMPInstance *uniMPInstance; /**< 保存当前打开的小程序应用的引用 注意：请使用 weak 修辞，否则应在关闭小程序时置为 nil */

@end
