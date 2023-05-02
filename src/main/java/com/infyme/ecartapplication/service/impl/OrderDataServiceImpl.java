package com.infyme.ecartapplication.service.impl;

import com.infyme.ecartapplication.domain.Order;
import com.infyme.ecartapplication.domain.OrderData;
import com.infyme.ecartapplication.repository.OrderDataRepository;
import com.infyme.ecartapplication.service.OrderDataService;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link OrderData}.
 */
@Service
@Transactional
public class OrderDataServiceImpl implements OrderDataService {

    private final Logger log = LoggerFactory.getLogger(OrderDataServiceImpl.class);

    private final OrderDataRepository orderDataRepository;

    public OrderDataServiceImpl(OrderDataRepository orderDataRepository) {
        this.orderDataRepository = orderDataRepository;
    }

    @Override
    public OrderData save(OrderData orderData) {
        log.debug("Request to save OrderData : {}", orderData);
        return orderDataRepository.save(orderData);
    }

    @Override
    public OrderData update(OrderData orderData) {
        log.debug("Request to update OrderData : {}", orderData);
        return orderDataRepository.save(orderData);
    }

    @Override
    public Optional<OrderData> partialUpdate(OrderData orderData) {
        log.debug("Request to partially update OrderData : {}", orderData);

        return orderDataRepository
            .findById(orderData.getId())
            .map(existingOrderData -> {
                if (orderData.getQuantity() != null) {
                    existingOrderData.setQuantity(orderData.getQuantity());
                }
                if (orderData.getProductName() != null) {
                    existingOrderData.setProductName(orderData.getProductName());
                }
                if (orderData.getPrice() != null) {
                    existingOrderData.setPrice(orderData.getPrice());
                }

                return existingOrderData;
            })
            .map(orderDataRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public List<OrderData> findAll() {
        log.debug("Request to get all OrderData");
        return orderDataRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<OrderData> findOne(Long id) {
        log.debug("Request to get OrderData : {}", id);
        return orderDataRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete OrderData : {}", id);
        orderDataRepository.deleteById(id);
    }

    @Override
    public List<OrderData> getOrderData(List<Order> orders) {
        List<OrderData> orderData = new ArrayList<>();
        for (Order order : orders) {
            List<OrderData> orderData2 = orderDataRepository.findByUserId(order.getId());
            orderData.addAll(orderData2);
        }
        return orderData;
    }
}
