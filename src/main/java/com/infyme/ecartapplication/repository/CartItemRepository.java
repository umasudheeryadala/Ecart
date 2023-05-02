package com.infyme.ecartapplication.repository;

import com.infyme.ecartapplication.domain.CartItem;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the CartItem entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    @Query("select cartItem from CartItem cartItem where cartItem.user.login = ?#{principal.username}")
    List<CartItem> findByUserIsCurrentUser();

    @Query("select cart from CartItem cart where cart.user.id=?1")
    List<CartItem> findByUserId(Long Id);

    @Query("select cart from CartItem cart where cart.orderItemId=?1 and cart.user.id=?2")
    Optional<CartItem> findByOrderIdAndUser(Long id, Long userid);
}
