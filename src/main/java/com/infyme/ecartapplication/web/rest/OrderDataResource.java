package com.infyme.ecartapplication.web.rest;

import com.infyme.ecartapplication.domain.CartItem;
import com.infyme.ecartapplication.domain.Order;
import com.infyme.ecartapplication.domain.OrderData;
import com.infyme.ecartapplication.domain.OrderItem;
import com.infyme.ecartapplication.domain.User;
import com.infyme.ecartapplication.repository.OrderDataRepository;
import com.infyme.ecartapplication.service.OrderDataService;
import com.infyme.ecartapplication.service.OrderService;
import com.infyme.ecartapplication.web.rest.errors.BadRequestAlertException;
import java.net.URISyntaxException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.infyme.ecartapplication.domain.OrderData}.
 */
@RestController
@RequestMapping("/api")
public class OrderDataResource {

    private final Logger log = LoggerFactory.getLogger(OrderDataResource.class);

    private static final String ENTITY_NAME = "orderData";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final OrderDataService orderDataService;

    private final OrderDataRepository orderDataRepository;

    private final OrderService orderService;

    public OrderDataResource(OrderDataService orderDataService, OrderDataRepository orderDataRepository, OrderService orderService) {
        this.orderDataService = orderDataService;
        this.orderDataRepository = orderDataRepository;
        this.orderService = orderService;
    }

    /**
     * {@code POST  /order-data} : Create a new orderData.
     *
     * @param orderData the orderData to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new orderData, or with status {@code 400 (Bad Request)} if the orderData has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/order-data")
    public ResponseEntity<String> createOrderData(
        @Valid @RequestBody CartItem[] cartItems,
        @RequestHeader(name = "Authorization") String token
    ) throws URISyntaxException {
        log.debug("REST request to save OrderData : {}", cartItems);
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", token);
        HttpEntity<String> jwtEntity2 = new HttpEntity<String>(headers);
        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<User> responseEntity2 = restTemplate.exchange(
            "http://localhost:8080/api/userdetails",
            HttpMethod.GET,
            jwtEntity2,
            User.class
        );
        Order order = new Order();
        order.setOrderDate(LocalDate.now());
        order.setUser(responseEntity2.getBody());
        HttpEntity<Order> jwtEntity = new HttpEntity<Order>(order, headers);
        ResponseEntity<Order> responseEntity = restTemplate.exchange(
            "http://localhost:8080/api/orders",
            HttpMethod.POST,
            jwtEntity,
            Order.class
        );

        for (CartItem cartItem : cartItems) {
            OrderData orderData = new OrderData();
            orderData.setOrder(responseEntity.getBody());
            orderData.setPrice(cartItem.getPrice() * cartItem.getQuantity());
            orderData.setProductName(cartItem.getProductName());
            orderData.setQuantity(cartItem.getQuantity());
            orderDataService.save(orderData);
            HttpEntity<CartItem> jwtEntity1 = new HttpEntity<CartItem>(cartItem, headers);
            Long id = cartItem.getId();
            restTemplate.exchange("http://localhost:8080/api/cart-items/" + id, HttpMethod.DELETE, jwtEntity1, void.class);
            ResponseEntity<OrderItem> response = restTemplate.exchange(
                "http://localhost:8080/api/order-items/" + cartItem.getOrderItemId(),
                HttpMethod.GET,
                jwtEntity2,
                OrderItem.class
            );
            OrderItem orderItem = response.getBody();
            orderItem.setQuantity(orderItem.getQuantity() - cartItem.getQuantity());
            HttpEntity<OrderItem> jwtEntity3 = new HttpEntity<OrderItem>(orderItem, headers);
            restTemplate.exchange(
                "http://localhost:8080/api/order-items/" + orderItem.getId(),
                HttpMethod.PUT,
                jwtEntity3,
                OrderItem.class
            );
        }
        String value = "success";
        return new ResponseEntity<>(value, HttpStatus.OK);
    }

    /**
     * {@code PUT  /order-data/:id} : Updates an existing orderData.
     *
     * @param id the id of the orderData to save.
     * @param orderData the orderData to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated orderData,
     * or with status {@code 400 (Bad Request)} if the orderData is not valid,
     * or with status {@code 500 (Internal Server Error)} if the orderData couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/order-data/{id}")
    public ResponseEntity<OrderData> updateOrderData(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody OrderData orderData
    ) throws URISyntaxException {
        log.debug("REST request to update OrderData : {}, {}", id, orderData);
        if (orderData.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, orderData.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!orderDataRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        OrderData result = orderDataService.update(orderData);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, orderData.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /order-data/:id} : Partial updates given fields of an existing orderData, field will ignore if it is null
     *
     * @param id the id of the orderData to save.
     * @param orderData the orderData to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated orderData,
     * or with status {@code 400 (Bad Request)} if the orderData is not valid,
     * or with status {@code 404 (Not Found)} if the orderData is not found,
     * or with status {@code 500 (Internal Server Error)} if the orderData couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/order-data/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<OrderData> partialUpdateOrderData(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody OrderData orderData
    ) throws URISyntaxException {
        log.debug("REST request to partial update OrderData partially : {}, {}", id, orderData);
        if (orderData.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, orderData.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!orderDataRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<OrderData> result = orderDataService.partialUpdate(orderData);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, orderData.getId().toString())
        );
    }

    /**
     * {@code GET  /order-data} : get all the orderData.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of orderData in body.
     */
    @GetMapping("/order-data")
    public List<OrderData> getAllOrderData(@RequestHeader(name = "Authorization") String token) {
        log.debug("REST request to get all OrderData");
        List<Order> orders = new ArrayList<>();
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", token);
        HttpEntity<String> jwtEntity = new HttpEntity<String>(headers);
        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<User> responseEntity = restTemplate.exchange(
            "http://localhost:8080/api/userdetails",
            HttpMethod.GET,
            jwtEntity,
            User.class
        );
        User user = responseEntity.getBody();
        if (!user.getLogin().equals("admin")) {
            HttpEntity<Long> jwtEntity1 = new HttpEntity<Long>(user.getId(), headers);
            ResponseEntity<Order[]> responseEntity1 = restTemplate.exchange(
                "http://localhost:8080/api//orders/user/" + user.getId(),
                HttpMethod.GET,
                jwtEntity,
                Order[].class
            );
            for (Order order : responseEntity1.getBody()) {
                orders.add(order);
            }
            return orderDataService.getOrderData(orders);
        } else {
            return orderDataService.findAll();
        }
    }

    /**
     * {@code GET  /order-data/:id} : get the "id" orderData.
     *
     * @param id the id of the orderData to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the orderData, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/order-data/{id}")
    public ResponseEntity<OrderData> getOrderData(@PathVariable Long id) {
        log.debug("REST request to get OrderData : {}", id);
        Optional<OrderData> orderData = orderDataService.findOne(id);
        return ResponseUtil.wrapOrNotFound(orderData);
    }

    /**
     * {@code DELETE  /order-data/:id} : delete the "id" orderData.
     *
     * @param id the id of the orderData to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/order-data/{id}")
    public ResponseEntity<Void> deleteOrderData(@PathVariable Long id) {
        log.debug("REST request to delete OrderData : {}", id);
        orderDataService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
