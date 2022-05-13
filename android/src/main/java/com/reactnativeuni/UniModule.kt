package com.reactnativeuni

import android.util.Log
import com.alibaba.fastjson.JSONObject
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule.RCTDeviceEventEmitter
import io.dcloud.feature.sdk.DCSDKInitConfig
import io.dcloud.feature.sdk.DCUniMPSDK
import io.dcloud.feature.sdk.Interface.IDCUniMPOnCapsuleCloseButtontCallBack
import io.dcloud.feature.sdk.Interface.IUniMP
import io.dcloud.feature.sdk.MenuActionSheetItem
import org.json.JSONArray
import org.json.JSONException
import java.util.*
import io.dcloud.feature.unimp.config.UniMPOpenConfiguration
import java.lang.ref.SoftReference


class UniModule(private val reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
  private var unimp: IUniMP? = null
  var mUniMPCaches = HashMap<String, IUniMP>()

  private fun sendEvent(eventName: String, params: Any) {
    if (params is JSONObject) {
      reactContext
        .getJSModule(RCTDeviceEventEmitter::class.java)
        .emit(eventName, params.toString())
    } else {
      reactContext
        .getJSModule(RCTDeviceEventEmitter::class.java)
        .emit(eventName, params)
    }
  }
  @Throws(JSONException::class)
  private fun convertMapToJson(readableMap: ReadableMap?): JSONObject? {
    if (readableMap == null) {
      return null
    }
    val jsonObject = JSONObject()
    val iterator = readableMap.keySetIterator()
    while (iterator.hasNextKey()) {
      val key = iterator.nextKey()
      when (readableMap.getType(key)) {//        ReadableType.Null -> jsonObject.put(key, JSONObject.NULL)
        ReadableType.Boolean -> jsonObject.put(key, readableMap.getBoolean(key))
        ReadableType.Number -> jsonObject.put(key, readableMap.getDouble(key))
        ReadableType.String -> jsonObject.put(key, readableMap.getString(key))
        ReadableType.Map -> jsonObject.put(key, convertMapToJson(readableMap.getMap(key)))
        ReadableType.Array -> jsonObject.put(key, convertArrayToJson(readableMap.getArray(key)))
      }
    }
    return jsonObject
  }

  @Throws(JSONException::class)
  private fun convertArrayToJson(readableArray: ReadableArray?): JSONArray? {
    if (readableArray == null) {
      return null
    }
    val array = JSONArray()
    for (i in 0 until readableArray.size()) {
      when (readableArray.getType(i)) {
        ReadableType.Null -> Unit
        ReadableType.Boolean -> array.put(readableArray.getBoolean(i))
        ReadableType.Number -> array.put(readableArray.getDouble(i))
        ReadableType.String -> array.put(readableArray.getString(i))
        ReadableType.Map -> array.put(convertMapToJson(readableArray.getMap(i)))
        ReadableType.Array -> array.put(convertArrayToJson(readableArray.getArray(i)))
      }
    }
    return array
  }





  override fun getName(): String {
    return "Uni"
  }



  @ReactMethod
  fun initialize(params: ReadableMap, promise: Promise) {
    try {
      val items = params.getArray("items")
      val capsule = params.getBoolean("capsule")
      val fontSize = params.getString("fontSize")
      val fontColor = params.getString("fontColor")
      val fontWeight = params.getString("fontWeight")
      val sheetItems: MutableList<MenuActionSheetItem> = ArrayList()
      for (i in 0 until items!!.size()) {
        val item = items.getMap(i)
        sheetItems.add(MenuActionSheetItem(item!!.getString("title"), item.getString("key")))
      }
      val config = DCSDKInitConfig.Builder()
        .setCapsule(capsule)
        .setMenuDefFontSize(fontSize)
        .setMenuDefFontColor(fontColor)
        .setMenuDefFontWeight(fontWeight)
        .setMenuActionSheetItems(sheetItems)
        .setEnableBackground(false).setUniMPFromRecents(false).build()
      DCUniMPSDK.getInstance().initialize(reactContext, config) { b -> promise.resolve(b) }
    } catch (e: Exception) {
      promise.reject(e)
    }
  }

  @ReactMethod
  fun launch(config: ReadableMap, promise: Promise) {
    try {
      var path: String? = null
      var params: String? = null
      val appid = config.getString("appid")
      if (config.hasKey("path")) {
        path = config.getString("path")
      }
      if (config.hasKey("params")) {
        params = config.getString("params")
      }
      DCUniMPSDK.getInstance().setDefMenuButtonClickCallBack { appid, key -> sendEvent("MenuItemClick", key) }
      DCUniMPSDK.getInstance().setOnUniMPEventCallBack { appid, event, data, callback ->
        var params : Event = Event();
        params.event = event;
        params.res = data;
        sendEvent("UniMPEventReceive", JSONObject.toJSON(params))
      }
      val uniMPOpenConfiguration = UniMPOpenConfiguration()
      uniMPOpenConfiguration.splashClass = UniSplashView::class.java
      uniMPOpenConfiguration.arguments = org.json.JSONObject(params)
      uniMPOpenConfiguration.redirectPath = path
      DCUniMPSDK.getInstance().setUniMPOnCloseCallBack { appid -> sendEvent("UniMPOnClose", appid) }
      DCUniMPSDK.getInstance().setCapsuleCloseButtonClickCallBack{ appid ->
        if (mUniMPCaches.containsKey(appid)) {
          val mIUniMP = mUniMPCaches[appid]
          if (mIUniMP != null && mIUniMP.isRuning) {
            mIUniMP.closeUniMP()
            mUniMPCaches.remove(appid)
          }
        } }

      unimp = DCUniMPSDK.getInstance().openUniMP(this.currentActivity, appid, uniMPOpenConfiguration)
      val uniMP = unimp
      mUniMPCaches[uniMP!!.appid] = uniMP

//      unimp =  DCUniMPSDK.getInstance().openUniMP(this.currentActivity, appid, UniSplashView::class.java, path, if (params == null) null else org.json.JSONObject(params))

      promise.resolve(null)
    } catch (e: Exception) {
      e.printStackTrace()
      promise.reject(e)
    }
  }

  @ReactMethod
  fun getAppBasePath(promise: Promise) {
    try {
      val path = DCUniMPSDK.getInstance().getAppBasePath(this.currentActivity)
      promise.resolve(path)
    } catch (e: Exception) {
      promise.reject(e)
    }
  }

  @ReactMethod
  fun isExistsApp(appid: String?, promise: Promise) {
    try {
      promise.resolve(DCUniMPSDK.getInstance().isExistsApp(appid))
    } catch (e: Exception) {
      promise.reject(e)
    }
  }

  @ReactMethod
  fun getRuningAppid(promise: Promise) {
    try {
      promise.resolve(unimp!!.appid)
    } catch (e: Exception) {
      promise.reject(e)
    }
  }

  @ReactMethod
  fun getCurrentPageUrl(promise: Promise) {
    try {
      promise.resolve(unimp!!.currentPageUrl)
    } catch (e: Exception) {
      promise.reject(e)
    }
  }

  @ReactMethod
  fun getAppVersionInfo(appid: String?, promise: Promise) {
    try {
      val info = DCUniMPSDK.getInstance().getAppVersionInfo(appid)
      if (info === null) {
        promise.resolve(null)
        return
      }
      val map = Arguments.createMap()
      map.putString("name", info.getString("name"))
      map.putInt("code", info.getString("code").toInt())
      promise.resolve(map)
    } catch (e: Exception) {
      promise.reject(e)
    }
  }

  @ReactMethod
  fun closeCurrentApp(promise: Promise) {
    try {
      unimp!!.closeUniMP()
      promise.resolve(true)
    } catch (e: Exception) {
      promise.reject(e)
    }
  }
  

  @ReactMethod
  fun sendEvent(name: String?, data: ReadableMap?, promise: Promise) {
    try {
      promise.resolve(unimp!!.sendUniMPEvent(name, convertMapToJson(data)))
    } catch (e: Exception) {
      promise.reject(e)
    }
  }

  @ReactMethod
  fun releaseWgtToRunPathFromPath(path: String?, promise: Promise) {
    try {
      val name = path.toString();
      DCUniMPSDK.getInstance().releaseWgtToRunPathFromePath(name.substring(name.lastIndexOf("/") + 1, name.lastIndexOf(".")), path) { code, pArgs ->
        promise.resolve(code == 1)
      }
    } catch (e: Exception) {
      promise.reject(e)
    }
  }

}
