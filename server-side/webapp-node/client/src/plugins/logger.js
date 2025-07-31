import Logger from "js-logger";
import RepositoryFactory from "@/repositories/RepositoryFactory";
const logRepository = RepositoryFactory.get("LogRepository");

/**
 * This method gets the stack trace and removes all the lines
 * except the one from where the logger has been called
 * @returns {string}: the line where the logger has been called
 */
const getStackTree = function () {
  try {
    throw new Error();
  } catch (ex) {
    const errTxt = ex.stack.split("\n")[5];
    return errTxt
      .substring(errTxt.indexOf("./node_modules/vue-loader") + 40)
      .trim();
  }
};

const logger = Logger.get("logger");
logger.setLevel(Logger.DEBUG);

/**
 * Available levels (sort by importance - asc)
 * OFF
 * TRACE
 * DEBUG
 * INFO
 * WARN <- sending this level logs (and below) to server
 * ERROR
 */

const levelsToSendToServer = [Logger.WARN, Logger.ERROR];

// Setting handlers
const defaultHandler = Logger.createDefaultHandler();
Logger.setHandler(function (messages, context) {
  defaultHandler(messages, context);
  if (levelsToSendToServer.indexOf(context.level) !== -1) {
    let message = (messages[0] || "No message") + " [" + getStackTree() + "]";
    for (let i = 1; i < messages.length; i++) {
      message += i === 1 ? ", params: \n" : ", \n";
      message += JSON.stringify(messages[i]);
    }
    logRepository.save({
      message: message,
      level: context.level.name,
    });
  }
});

export default logger;
