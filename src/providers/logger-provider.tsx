import { createContext, memo, PropsWithChildren, useContext } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

enum LogLevel {
  Info = 0,
  Warning = 1,
  Error = 2,
  Success = 3,
}

class Logger {
  // todo: can be personalized for user through user settings
  autoCloseTimout = 5000;

  error(msg: string | Error | unknown) {
    const error = msg instanceof Error ? msg.message : JSON.stringify(msg, null, 2);
    toast.error(error, {
      autoClose: this.autoCloseTimout,
    });
  }

  warning(msg: string) {
    toast.warn(msg, {
      autoClose: this.autoCloseTimout,
    });
  }

  info(msg: string) {
    toast.info(msg, {
      autoClose: this.autoCloseTimout,
    });
  }

  success(msg: string) {
    toast.success(msg, {
      autoClose: this.autoCloseTimout,
    });
  }

  show(msg: string, msgType: LogLevel = LogLevel.Info) {
    switch (msgType) {
      case LogLevel.Error:
        this.error(msg);
        break;
      case LogLevel.Warning:
        this.warning(msg);
        break;
      case LogLevel.Info:
        this.info(msg);
        break;
      case LogLevel.Success:
        this.success(msg);
        break;
      default:
        this.error("wrong message type");
    }
  }
}

export type MessengerContextType = {
  logger: Logger;
};

const logger = new Logger();

const LoggerContext = createContext<MessengerContextType>({ logger });

export const LoggerProvider = memo(function LoggerProvider({ children }: PropsWithChildren) {
  return (
    <LoggerContext.Provider value={{ logger }}>
      <ToastContainer />
      {children}
    </LoggerContext.Provider>
  );
});

export const useLoggerContext = () => useContext(LoggerContext);
