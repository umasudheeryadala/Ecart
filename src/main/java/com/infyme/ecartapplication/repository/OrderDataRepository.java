package com.infyme.ecartapplication.repository;

import com.infyme.ecartapplication.domain.OrderData;
import java.util.List;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the OrderData entity.
 */
@SuppressWarnings("unused")
@Repository
public interface OrderDataRepository extends JpaRepository<OrderData, Long> {
    @Query("select orderdata from OrderData orderdata where orderdata.order.id=?1")
    List<OrderData> findByUserId(Long Id);
}
