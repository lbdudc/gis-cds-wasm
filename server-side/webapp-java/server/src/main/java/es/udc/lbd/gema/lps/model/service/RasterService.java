package es.udc.lbd.gema.lps.model.service;

import es.udc.lbd.gema.lps.model.service.dto.RasterDTO;
import es.udc.lbd.gema.lps.model.service.dto.RasterFullDTO;
import es.udc.lbd.gema.lps.model.service.exceptions.NotFoundException;
import es.udc.lbd.gema.lps.model.service.exceptions.OperationNotAllowedException;
import es.udc.lbd.gema.lps.web.rest.custom.FeatureCollectionJSON;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface RasterService {

  Page<RasterDTO> getAll(Pageable pageable, List<String> filters, String search);

  FeatureCollectionJSON getGeometry(
      Double xmin, Double xmax, Double ymin, Double ymax, Integer level);

  RasterFullDTO get(Long id) throws NotFoundException;

  RasterFullDTO create(RasterFullDTO raster) throws OperationNotAllowedException;

  RasterFullDTO update(Long id, RasterFullDTO raster) throws OperationNotAllowedException;

  void delete(Long id);
}
