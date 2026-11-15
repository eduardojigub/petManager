const fs = require('fs');
const path = require('path');
const { withDangerousMod, withMainApplication } = require('@expo/config-plugins');

/**
 * Pads the image-crop activity for edge-to-edge.
 *
 * `expo-image-picker` 17 (SDK 54) launches `com.canhub.cropper.CropImageActivity`
 * with `Base.Theme.AppCompat`. That activity's action bar (back, rotate, crop)
 * draws under the status bar once edge-to-edge is enforced, and this package
 * has no inset fix (the Expo fix landed in expo-image-picker 55, SDK 55).
 * Remove this plugin when the app moves to SDK 55 or later.
 *
 * Predictive back used to be disabled here too. Since SDK 54 that is the
 * `android.predictiveBackGestureEnabled: false` field in app.json.
 */

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
  config = withCropperInsets(config);
  return config;
};
