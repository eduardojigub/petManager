const fs = require('fs');
const path = require('path');
const { AndroidConfig, withAndroidManifest, withDangerousMod, withMainApplication } = require('@expo/config-plugins');

/**
 * Expo SDK 53 does not expose `android.predictiveBackGestureEnabled`
 * (that app.json field arrived in SDK 54). On Android 16 with targetSdk 36,
 * predictive back is on by default and `Activity.onBackPressed()` is not called.
 *
 * This app uses the JavaScript stack from `@react-navigation/stack`. React Native
 * 0.79 delivers the system back button and gesture to JavaScript only through
 * `onBackPressed()` → `BackHandler`. If that call is skipped, a stacked screen
 * or a modal finishes the activity instead of popping or closing.
 *
 * `android:enableOnBackInvokedCallback="false"` is the supported opt-out for
 * targetSdk 36. Root screens still exit when nothing is left to pop, because
 * React Navigation's BackHandler falls through to `BackHandler.exitApp()`.
 *
 * The same plugin pads the image-crop activity. `expo-image-picker` 16 launches
 * `com.canhub.cropper.CropImageActivity` with `Base.Theme.AppCompat`. That
 * activity's action bar (back, rotate, crop) draws under the status bar once
 * edge-to-edge is enforced, and the SDK 53 package has no inset fix (the Expo
 * fix landed in expo-image-picker 55, which is not compatible with this SDK).
 */
function withPredictiveBackDisabled(config) {
  return withAndroidManifest(config, (config) => {
    const app = AndroidConfig.Manifest.getMainApplicationOrThrow(config.modResults);
    app.$['android:enableOnBackInvokedCallback'] = 'false';
    return config;
  });
}

function cropperSource(packageName) {
  return `package ${packageName}

import android.app.Activity
import android.app.Application
import android.graphics.Color
import android.os.Bundle
import androidx.core.view.ViewCompat
import androidx.core.view.WindowCompat
import androidx.core.view.WindowInsetsCompat

/**
 * Pads the CanHub crop activity below the status bar and above the navigation bar.
 * Edge-to-edge is enforced for targetSdk 36, and this activity does not apply insets.
 */
object CropperInsets {
  private const val CROPPER = "com.canhub.cropper.CropImageActivity"

  fun register(application: Application) {
    application.registerActivityLifecycleCallbacks(callbacks)
  }

  private val callbacks = object : Application.ActivityLifecycleCallbacks {
    override fun onActivityCreated(activity: Activity, savedInstanceState: Bundle?) {
      if (activity.javaClass.name != CROPPER) return

      val window = activity.window
      WindowCompat.setDecorFitsSystemWindows(window, false)
      val decor = window.decorView
      val barColor = actionBarColor(activity)
      decor.setBackgroundColor(barColor)
      val lightBars = isColorLight(barColor)
      val controller = WindowCompat.getInsetsController(window, decor)
      controller.isAppearanceLightStatusBars = lightBars
      controller.isAppearanceLightNavigationBars = lightBars

      ViewCompat.setOnApplyWindowInsetsListener(decor) { view, insets ->
        val bars = insets.getInsets(
          WindowInsetsCompat.Type.systemBars() or WindowInsetsCompat.Type.displayCutout()
        )
        view.setPadding(bars.left, bars.top, bars.right, bars.bottom)
        WindowInsetsCompat.CONSUMED
      }
      ViewCompat.requestApplyInsets(decor)
    }

    override fun onActivityStarted(activity: Activity) = Unit
    override fun onActivityResumed(activity: Activity) = Unit
    override fun onActivityPaused(activity: Activity) = Unit
    override fun onActivityStopped(activity: Activity) = Unit
    override fun onActivitySaveInstanceState(activity: Activity, outState: Bundle) = Unit
    override fun onActivityDestroyed(activity: Activity) = Unit
  }

  private fun actionBarColor(activity: Activity): Int {
    val typed = activity.obtainStyledAttributes(intArrayOf(androidx.appcompat.R.attr.colorPrimary))
    val color = typed.getColor(0, Color.BLACK)
    typed.recycle()
    return color
  }

  private fun isColorLight(color: Int): Boolean {
    val luminance =
      (0.299 * Color.red(color) + 0.587 * Color.green(color) + 0.114 * Color.blue(color)) / 255.0
    return luminance > 0.5
  }
}
`;
}

function withCropperInsets(config) {
  const packageName = config.android?.package;
  if (!packageName) {
    throw new Error('android.package is required to install cropper inset handling');
  }

  config = withDangerousMod(config, [
    'android',
    async (config) => {
      const dir = path.join(
        config.modRequest.platformProjectRoot,
        'app/src/main/java',
        ...packageName.split('.')
      );
      await fs.promises.mkdir(dir, { recursive: true });
      await fs.promises.writeFile(path.join(dir, 'CropperInsets.kt'), cropperSource(packageName));
      return config;
    },
  ]);

  config = withMainApplication(config, (config) => {
    if (config.modResults.contents.includes('CropperInsets.register')) {
      return config;
    }
    config.modResults.contents = config.modResults.contents.replace(
      'super.onCreate()',
      'super.onCreate()\n    CropperInsets.register(this)'
    );
    return config;
  });

  return config;
}

module.exports = function withAndroidEdgeToEdgeFixes(config) {
  config = withPredictiveBackDisabled(config);
  config = withCropperInsets(config);
  return config;
};
