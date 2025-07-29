package es.udc.lbd.gema.lps.model.domain;

import jakarta.persistence.*;
import jakarta.persistence.Column;
import jakarta.persistence.SequenceGenerator;
import org.locationtech.jts.geom.Geometry;

@Entity(name = "t_raster")
@Table(name = "t_raster")
public class Raster {
  @Id
  @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "rasterid")
  @SequenceGenerator(
      name = "rasterid",
      sequenceName = "t_raster_id_seq",
      initialValue = 1,
      allocationSize = 1)
  @Column(name = "id")
  private Long id;

  @Column(name = "geometry", columnDefinition = "geometry(Geometry, 4326)")
  private Geometry geometry;

  @Column(name = "level")
  private Integer level;

  public Raster() {}

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
}
