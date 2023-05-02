package com.infyme.ecartapplication.service;

import com.infyme.ecartapplication.domain.OrderItem;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link OrderItem}.
 */
public interface OrderItemService {
    /**
     * Save a orderItem.
     *
     * @param orderItem the entity to save.
     * @return the persisted entity.
     */
    OrderItem save(OrderItem orderItem);

    /**
     * Updates a orderItem.
     *
     * @param orderItem the entity to update.
     * @return the persisted entity.
     */
    OrderItem update(OrderItem orderItem);

    /**
     * Partially updates a orderItem.
     *
     * @param orderItem the entity to update partially.
     * @return the persisted entity.
     */
    Optional<OrderItem> partialUpdate(OrderItem orderItem);

    /**
     * Get all the orderItems.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<OrderItem> findAll(Pageable pageable);

    /**
     * Get the "id" orderItem.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<OrderItem> findOne(Long id);

    /**
     * Delete the "id" orderItem.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
