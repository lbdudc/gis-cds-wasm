package es.udc.lbd.gema.lps.model.service.dto;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import es.udc.lbd.gema.lps.model.domain.*;
import es.udc.lbd.gema.lps.model.util.jackson.CustomGeometryDeserializer;
import es.udc.lbd.gema.lps.model.util.jackson.CustomGeometrySerializer;
import org.locationtech.jts.geom.Geometry;

public class RasterFullDTO {
  private Long id;

  @JsonSerialize(using = CustomGeometrySerializer.class)
  @JsonDeserialize(using = CustomGeometryDeserializer.class)
  private Geometry geometry;

  private Integer level;

  public RasterFullDTO() {}

  public RasterFullDTO(Raster raster) {
    this.id = raster.getId();
    this.geometry = raster.getGeometry();
    this.level = raster.getLevel();
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public Geometry getGeometry() {
    return geometry;
  }

  public void setGeometry(Geometry geometry) {
    this.geometry = geometry;
  }

  public Integer getLevel() {
    return level;
  }

  public void setLevel(Integer level) {
    this.level = level;
  }

  public Raster toRaster() {
    Raster raster = new Raster();
    raster.setId(this.getId());
    raster.setGeometry(this.getGeometry());
    raster.setLevel(this.getLevel());
    return raster;
  }
}
