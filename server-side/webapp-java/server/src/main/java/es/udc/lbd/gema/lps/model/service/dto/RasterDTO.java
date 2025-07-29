package es.udc.lbd.gema.lps.model.service.dto;

import es.udc.lbd.gema.lps.model.domain.*;

public class RasterDTO {

  private Long id;
  private Integer level;

  public RasterDTO() {}

  public RasterDTO(Raster raster) {
    this.id = raster.getId();
    this.level = raster.getLevel();
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
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
    raster.setLevel(this.getLevel());
    return raster;
  }
}
