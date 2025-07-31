package es.udc.lbd.gema.lps.model.repository;

import es.udc.lbd.gema.lps.model.domain.Raster;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface RasterRepository
    extends JpaRepository<Raster, Long>, JpaSpecificationExecutor<Raster> {

  Optional<Raster> findById(Long pk);

  Page<Raster> findByIdIn(List<Long> pk, Pageable pageable);

  @Query(
      value =
          "select * from t_raster a where a.level = :level and ST_Intersects(a.geometry, ST_MakeEnvelope(:xmin, :ymin, :xmax, :ymax, 4326))",
      nativeQuery = true)
  List<Raster> getDataByBoundingBox(
      @Param("xmin") Double xmin,
      @Param("xmax") Double xmax,
      @Param("ymin") Double ymin,
      @Param("ymax") Double ymax,
      @Param("level") Integer level);
}
