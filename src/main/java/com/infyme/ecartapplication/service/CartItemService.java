package com.infyme.ecartapplication.service;

import com.infyme.ecartapplication.domain.CartItem;
import java.util.List;
import java.util.Optional;

/**
 * Service Interface for managing {@link CartItem}.
 */
public interface CartItemService {
    /**
     * Save a cartItem.
     *
     * @param cartItem the entity to save.
     * @return the persisted entity.
     */
    CartItem save(CartItem cartItem);

    /**
     * Updates a cartItem.
     *
     * @param cartItem the entity to update.
     * @return the persisted entity.
     */
    CartItem update(CartItem cartItem);

    /**
     * Partially updates a cartItem.
     *
     * @param cartItem the entity to update partially.
     * @return the persisted entity.
     */
    Optional<CartItem> partialUpdate(CartItem cartItem);

    /**
     * Get all the cartItems.
     *
     * @return the list of entities.
     */
    List<CartItem> findAll();

    /**
     * Get the "id" cartItem.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<CartItem> findOne(Long id);

    /**
     * Delete the "id" cartItem.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);

    public List<CartItem> getCartItems(Long id);

    /**
     * Get the CartItem By using the order Id
     *
     * @param id the id of the entity.
     */
    Optional<CartItem> getCartItemByOrderId(Long id, Long userId);
}
