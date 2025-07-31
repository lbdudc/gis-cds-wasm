package es.udc.lbd.gema.lps.web.rest.specifications;

import es.udc.lbd.gema.lps.model.domain.Raster;
import es.udc.lbd.gema.lps.web.rest.util.specification_utils.SpecificationUtil;
import jakarta.persistence.criteria.*;
import jakarta.persistence.criteria.Path;
import java.util.ArrayList;
import java.util.List;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.web.bind.annotation.*;

public class RasterSpecification {
  public static Specification<Raster> searchAll(String search) {
    return new Specification<Raster>() {
      @Override
      public Predicate toPredicate(
          Root<Raster> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) {
        List<Predicate> predicates = new ArrayList<>();
        String stringToFind = ("%" + search + "%").toLowerCase();
        Path path = SpecificationUtil.getPath(root, null);
        predicates.add(
            criteriaBuilder.like(
                criteriaBuilder.lower(path.get("id").as(String.class)), stringToFind));
        predicates.add(
            criteriaBuilder.like(
                criteriaBuilder.lower(path.get("level").as(String.class)), stringToFind));
        return criteriaBuilder.or(predicates.toArray(new Predicate[0]));
      }
    };
  }
}
