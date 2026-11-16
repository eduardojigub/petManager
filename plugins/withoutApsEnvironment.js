const { withEntitlementsPlist } = require('@expo/config-plugins');

/**
 * Removes the `aps-environment` entitlement from the generated iOS project.
 *
 * Prebuild auto-applies the expo-notifications plugin, which always adds
 * `aps-environment` (remote push). Pet's Life only schedules local
 * notifications, which need no entitlement, and the App ID has no Push
 * Notifications capability. With the entitlement, the App Store provisioning
 * profile does not match and the EAS iOS build fails.
 *
 * Remove this plugin if the app starts using remote push. Then enable Push
 * Notifications on the App ID and regenerate the provisioning profile.
 */
module.exports = function withoutApsEnvironment(config) {
  return withEntitlementsPlist(config, (config) => {
    delete config.modResults['aps-environment'];
    return config;
  });
};
