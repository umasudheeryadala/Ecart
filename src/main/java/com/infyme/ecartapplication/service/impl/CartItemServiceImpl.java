package com.infyme.ecartapplication.service.impl;

import com.infyme.ecartapplication.domain.CartItem;
import com.infyme.ecartapplication.repository.CartItemRepository;
import com.infyme.ecartapplication.service.CartItemService;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link CartItem}.
 */
@Service
@Transactional
public class CartItemServiceImpl implements CartItemService {

    private final Logger log = LoggerFactory.getLogger(CartItemServiceImpl.class);

    private final CartItemRepository cartItemRepository;

    public CartItemServiceImpl(CartItemRepository cartItemRepository) {
        this.cartItemRepository = cartItemRepository;
    }

    @Override
    public CartItem save(CartItem cartItem) {
        log.debug("Request to save CartItem : {}", cartItem);
        return cartItemRepository.save(cartItem);
    }

    @Override
    public CartItem update(CartItem cartItem) {
        log.debug("Request to update CartItem : {}", cartItem);
        return cartItemRepository.save(cartItem);
    }

    @Override
    public Optional<CartItem> partialUpdate(CartItem cartItem) {
        log.debug("Request to partially update CartItem : {}", cartItem);

        return cartItemRepository
            .findById(cartItem.getId())
            .map(existingCartItem -> {
                if (cartItem.getOrderItemId() != null) {
                    existingCartItem.setOrderItemId(cartItem.getOrderItemId());
                }
                if (cartItem.getProductName() != null) {
                    existingCartItem.setProductName(cartItem.getProductName());
                }
                if (cartItem.getPrice() != null) {
                    existingCartItem.setPrice(cartItem.getPrice());
                }
                if (cartItem.getQuantity() != null) {
                    existingCartItem.setQuantity(cartItem.getQuantity());
                }

                return existingCartItem;
            })
            .map(cartItemRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CartItem> findAll() {
        log.debug("Request to get all CartItems");
        return cartItemRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<CartItem> findOne(Long id) {
        log.debug("Request to get CartItem : {}", id);
        return cartItemRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete CartItem : {}", id);
        cartItemRepository.deleteById(id);
    }

    @Override
    public List<CartItem> getCartItems(Long id) {
        return cartItemRepository.findByUserId(id);
    }

    @Override
    public Optional<CartItem> getCartItemByOrderId(Long id, Long userId) {
        return cartItemRepository.findByOrderIdAndUser(id, userId);
    }
}
