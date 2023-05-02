package com.infyme.ecartapplication.repository;

import com.infyme.ecartapplication.domain.Order;
import java.util.List;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Order entity.
 */
@SuppressWarnings("unused")
@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    @Query("select jhiOrder from Order jhiOrder where jhiOrder.user.login = ?#{principal.username}")
    List<Order> findByUserIsCurrentUser();

    @Query("select jhiOrder from Order jhiOrder where jhiOrder.user.id=?1")
    List<Order> findByUserId(Long Id);
}
