package es.udc.lbd.gema.lps.component.logger;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

public class Log {

  @NotNull private String message;

  @NotNull private Level level;

  public Log() {}

  public Log(String message, Level level) {
    this.message = message;
    this.level = level;
  }

  public String getMessage() {
    return message;
  }

  public void setMessage(String message) {
    this.message = message;
  }

  public Level getLevel() {
    return level;
  }

  public void setLevel(Level level) {
    this.level = level;
  }
}
