module.exports = function (api) {
  api.cache(true);

  return {
    presets: ["babel-preset-expo"],
    plugins: [
      "expo-router/babel",
      [
        "module-resolver",
        {
          root: ["./src"],
          alias: {
            components: "./src/components",
            config: "./src/config",
            hooks: "./src/hooks",
            localization: "./src/localization",
            modules: "./src/modules",
            store: "./src/store",
            theme: "./src/theme",
            utils: "./src/utils",
          },
        },
      ],
      [
        "module:react-native-dotenv",
        {
          moduleName: "@env",
          path: ".env",
          blacklist: null,
          whitelist: null,
          safe: false,
          allowUndefined: true,
        },
      ],
    ],
  };
};
