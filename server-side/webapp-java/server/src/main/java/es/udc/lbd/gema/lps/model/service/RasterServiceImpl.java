package es.udc.lbd.gema.lps.model.service;

import es.udc.lbd.gema.lps.model.domain.Raster;
import es.udc.lbd.gema.lps.model.repository.RasterRepository;
import es.udc.lbd.gema.lps.model.service.dto.RasterDTO;
import es.udc.lbd.gema.lps.model.service.dto.RasterFullDTO;
import es.udc.lbd.gema.lps.model.service.exceptions.NotFoundException;
import es.udc.lbd.gema.lps.model.service.exceptions.OperationNotAllowedException;
import es.udc.lbd.gema.lps.web.rest.custom.FeatureCollectionJSON;
import es.udc.lbd.gema.lps.web.rest.custom.FeatureJSON;
import es.udc.lbd.gema.lps.web.rest.specifications.RasterSpecification;
import es.udc.lbd.gema.lps.web.rest.util.specification_utils.*;
import jakarta.inject.Inject;
import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true, rollbackFor = Exception.class)
public class RasterServiceImpl implements RasterService {

  @Inject private RasterRepository rasterRepository;

  public Page<RasterDTO> getAll(Pageable pageable, List<String> filters, String search) {
    Page<Raster> page;
    if (search != null && !search.isEmpty()) {
      page = rasterRepository.findAll(RasterSpecification.searchAll(search), pageable);
    } else {
      page =
          rasterRepository.findAll(
              SpecificationUtil.getSpecificationFromFilters(filters, false), pageable);
    }
    return page.map(RasterDTO::new);
  }

  public FeatureCollectionJSON getGeometry(
      Double xmin, Double xmax, Double ymin, Double ymax, Integer level) {
    List<Raster> list = rasterRepository.getDataByBoundingBox(xmin, xmax, ymin, ymax, level);

    List<FeatureJSON> ret =
        list.stream()
            .map(
                e -> {
                  FeatureJSON geoJSON = new FeatureJSON();
                  geoJSON.setProperties(new HashMap());
                  geoJSON.setId(e.getId());
                  geoJSON.getProperties().put("displayString", "" + e.getId() + "");
                  geoJSON.setGeometry(e.getGeometry());
                  return geoJSON;
                })
            .filter(e -> e.getGeometry() != null)
            .collect(Collectors.toList());
    return new FeatureCollectionJSON(ret);
  }

  public RasterFullDTO get(Long id) throws NotFoundException {
    Raster raster = findById(id);
    return new RasterFullDTO(raster);
  }

  @Transactional(readOnly = false, rollbackFor = Exception.class)
  public RasterFullDTO create(RasterFullDTO rasterDto) throws OperationNotAllowedException {
    if (rasterDto.getId() != null) {
      throw new OperationNotAllowedException("raster.error.id-exists");
    }
    Raster rasterEntity = rasterDto.toRaster();
    Raster rasterSaved = rasterRepository.save(rasterEntity);
    return new RasterFullDTO(rasterSaved);
  }

  @Transactional(readOnly = false, rollbackFor = Exception.class)
  public RasterFullDTO update(Long id, RasterFullDTO rasterDto)
      throws OperationNotAllowedException {
    if (rasterDto.getId() == null) {
      throw new OperationNotAllowedException("raster.error.id-not-exists");
    }
    if (!id.equals(rasterDto.getId())) {
      throw new OperationNotAllowedException("raster.error.id-dont-match");
    }
    Raster raster =
        rasterRepository
            .findById(id)
            .orElseThrow(() -> new OperationNotAllowedException("raster.error.id-not-exists"));
    Raster rasterToUpdate = rasterDto.toRaster();
    Raster rasterUpdated = rasterRepository.save(rasterToUpdate);
    return new RasterFullDTO(rasterUpdated);
  }

  @Transactional(readOnly = false, rollbackFor = Exception.class)
  public void delete(Long id) {
    rasterRepository.deleteById(id);
  }

  /** PRIVATE METHODS * */
  private Raster findById(Long id) throws NotFoundException {
    return rasterRepository
        .findById(id)
        .orElseThrow(() -> new NotFoundException("Cannot find Raster with id " + id));
  }
}
