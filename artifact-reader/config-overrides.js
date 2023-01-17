export function webpack(config, env) {
  // set resolve.fallback
  config.resolve.fallback = {
    fs: false,
    path: false,
    crypto: false,
  };
  return config;
}
