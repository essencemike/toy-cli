module.exports = function loadCommand (commandName, moduleName) {
  const isNotFoundError = err => {
    return err.message.match(/Cannot find module/);
  };

  try {
    return require(moduleName);
  } catch (error) {
    if (isNotFoundError(error)) {
      try {
        return require('import-global')(moduleName);
      } catch (error2) {
        if (isNotFoundError(error2)) {
          const chalk = require('chalk');
          const { hasYarn, hasPnpm3OrLater } = require('@vue/cli-shared-utils');
          let installCommand = 'npm install -g';

          if (hasYarn()) {
            installCommand = 'yarn global add';
          } else if (hasPnpm3OrLater) {
            installCommand = 'pnpm install -g';
          }
          console.log();
          console.log(
            ` Command ${chalk.cyan(`toy ${commandName}`)} requires a global addon to be installed.\n` +
            ` Please run ${chalk.cyan(`${installCommand} ${moduleName}`)} and try again.`
          );
          console.log();
          process.exit(1);
        } else {
          throw error2;
        }
      }
    } else {
      throw error;
    }
  }
};
