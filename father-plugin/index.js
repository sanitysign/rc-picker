module.exports = (api) => {
  // Compile break if export type without consistent
  api.onStart(() => {
    if (api.name !== 'build') {
      return;
    }

    const { execSync } = require('child_process');
    execSync(
      "npx eslint \"src/**/*.{ts,tsx}\" --rule \"@typescript-eslint/consistent-type-exports: error\"",
      {
        cwd: process.cwd(),
        env: process.env,
        stdio: [process.stdin, process.stdout, process.stderr],
        encoding: 'utf-8',
      },
    );
  });

  // modify default build config for all rc projects
  api.modifyDefaultConfig((memo) => {
    Object.assign(memo, {
      esm: {
        output: 'es',
        // transform all rc-xx/lib to rc-xx/es for esm build
        extraBabelPlugins: [require.resolve('./babelPluginImportLib2Es')],
      },
      cjs: {
        // specific platform to browser, father 4 build cjs for node by default
        platform: 'browser',
        output: 'lib',
      },
    });

    return memo;
  });
};
