package com.infyme.ecartapplication.repository;

import com.infyme.ecartapplication.domain.OrderCategory;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the OrderCategory entity.
 */
@SuppressWarnings("unused")
@Repository
public interface OrderCategoryRepository extends JpaRepository<OrderCategory, Long> {}
