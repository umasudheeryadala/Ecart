package com.infyme.ecartapplication.service;

import com.infyme.ecartapplication.domain.Order;
import com.infyme.ecartapplication.domain.OrderData;
import java.util.List;
import java.util.Optional;

/**
 * Service Interface for managing {@link OrderData}.
 */
public interface OrderDataService {
    /**
     * Save a orderData.
     *
     * @param orderData the entity to save.
     * @return the persisted entity.
     */
    OrderData save(OrderData orderData);

    /**
     * Updates a orderData.
     *
     * @param orderData the entity to update.
     * @return the persisted entity.
     */
    OrderData update(OrderData orderData);

    /**
     * Partially updates a orderData.
     *
     * @param orderData the entity to update partially.
     * @return the persisted entity.
     */
    Optional<OrderData> partialUpdate(OrderData orderData);

    /**
     * Get all the orderData.
     *
     * @return the list of entities.
     */
    List<OrderData> findAll();

    /**
     * Get the "id" orderData.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<OrderData> findOne(Long id);

    /**
     * Delete the "id" orderData.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);

    /**
     * Get the user orderData.
     *
     * @param orders the list of the orders that user have.
     */
    public List<OrderData> getOrderData(List<Order> orders);

    /**
     * Get the "order id" orderData .
     *
     * @param id the id of the entity.
     * @return the entity.
     */

    List<OrderData> findByOrderId(Long orderId);
}
