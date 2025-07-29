package es.udc.lbd.gema.lps.config;

import java.net.URI;
import java.net.URISyntaxException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "properties", ignoreUnknownFields = false)
public class Properties {
  private String clientHost;
  private String clientURL;
  private String serverURL;

  public String getClientHost() {
    return clientHost;
  }

  public void setClientHost(String clientHost) {
    this.clientHost = clientHost;
  }

  public String getClientURL() {
    return clientURL;
  }

  public void setClientURL(String clientURL) {
    this.clientURL = clientURL;
    try {
      URI uri = new URI(clientURL);
      this.clientHost = String.format("%s://%s", uri.getScheme(), uri.getAuthority());
    } catch (URISyntaxException e) {
      //
    }
  }

  public String getServerURL() {
    return serverURL;
  }

  public void setServerURL(String serverURL) {
    this.serverURL = serverURL;
  }

  private String environment;

  public String getEnvironment() {
    return environment;
  }

  public void setEnvironment(String environment) {
    this.environment = environment;
  }

  private final Gis gis = new Gis();

  public Gis getGis() {
    return gis;
  }

  public static class Gis {
    @Value("${properties.gis.defaultSrid}")
    private int defaultSrid;

    public int getDefaultSrid() {
      return defaultSrid;
    }

    public void setDefaultSrid(int defaultSrid) {
      this.defaultSrid = defaultSrid;
    }
  }
}
