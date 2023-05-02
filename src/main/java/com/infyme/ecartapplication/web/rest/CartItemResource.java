package com.infyme.ecartapplication.web.rest;

import com.infyme.ecartapplication.domain.CartItem;
import com.infyme.ecartapplication.domain.OrderItem;
import com.infyme.ecartapplication.domain.User;
import com.infyme.ecartapplication.repository.CartItemRepository;
import com.infyme.ecartapplication.service.CartItemService;
import com.infyme.ecartapplication.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.infyme.ecartapplication.domain.CartItem}.
 */
@RestController
@RequestMapping("/api")
public class CartItemResource {

    private final Logger log = LoggerFactory.getLogger(CartItemResource.class);

    private static final String ENTITY_NAME = "cartItem";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final CartItemService cartItemService;

    private final CartItemRepository cartItemRepository;

    public CartItemResource(CartItemService cartItemService, CartItemRepository cartItemRepository) {
        this.cartItemService = cartItemService;
        this.cartItemRepository = cartItemRepository;
    }

    /**
     * {@code POST  /cart-items} : Create a new cartItem.
     *
     * @param cartItem the cartItem to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new cartItem, or with status {@code 400 (Bad Request)} if the cartItem has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/cart-items")
    public ResponseEntity<CartItem> createCartItem(@RequestBody CartItem cartItem, @RequestHeader(name = "Authorization") String token)
        throws URISyntaxException {
        log.debug("REST request to save CartItem : {}", cartItem);
        if (cartItem.getId() != null && cartItem.getId() != 0) {
            throw new BadRequestAlertException("A new cartItem cannot already have an ID", ENTITY_NAME, "idexists");
        }
        CartItem result;
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
        cartItem.setUser(responseEntity.getBody());
        Optional<CartItem> optional = cartItemService.getCartItemByOrderId(cartItem.getOrderItemId(), responseEntity.getBody().getId());
        if (optional.isEmpty()) {
            result = cartItemService.save(cartItem);
        } else {
            CartItem cartItem2 = optional.get();
            cartItem2.setQuantity(cartItem.getQuantity() + cartItem2.getQuantity());
            Long price = cartItem.getPrice() / cartItem.getQuantity();
            cartItem2.price(cartItem2.getQuantity() * price);
            result = cartItemService.update(cartItem2);
        }
        return ResponseEntity
            .created(new URI("/api/cart-items/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /cart-items/:id} : Updates an existing cartItem.
     *
     * @param id the id of the cartItem to save.
     * @param cartItem the cartItem to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated cartItem,
     * or with status {@code 400 (Bad Request)} if the cartItem is not valid,
     * or with status {@code 500 (Internal Server Error)} if the cartItem couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/cart-items/{id}")
    public ResponseEntity<CartItem> updateCartItem(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody CartItem cartItem,
        @RequestHeader(name = "Authorization") String token
    ) throws URISyntaxException {
        log.debug("REST request to update CartItem : {}, {}", id, cartItem);
        if (cartItem.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, cartItem.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!cartItemRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", token);
        HttpEntity<String> jwtEntity = new HttpEntity<String>(headers);
        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<OrderItem> responseEntity = restTemplate.exchange(
            "http://localhost:8080/api/order-items/" + cartItem.getOrderItemId(),
            HttpMethod.GET,
            jwtEntity,
            OrderItem.class
        );
        cartItem.setPrice(responseEntity.getBody().getPrice() * cartItem.getQuantity());
        CartItem result = cartItemService.update(cartItem);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, cartItem.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /cart-items/:id} : Partial updates given fields of an existing cartItem, field will ignore if it is null
     *
     * @param id the id of the cartItem to save.
     * @param cartItem the cartItem to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated cartItem,
     * or with status {@code 400 (Bad Request)} if the cartItem is not valid,
     * or with status {@code 404 (Not Found)} if the cartItem is not found,
     * or with status {@code 500 (Internal Server Error)} if the cartItem couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/cart-items/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<CartItem> partialUpdateCartItem(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody CartItem cartItem
    ) throws URISyntaxException {
        log.debug("REST request to partial update CartItem partially : {}, {}", id, cartItem);
        if (cartItem.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, cartItem.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!cartItemRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<CartItem> result = cartItemService.partialUpdate(cartItem);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, cartItem.getId().toString())
        );
    }

    /**
     * {@code GET  /cart-items} : get all the cartItems.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of cartItems in body.
     */
    @GetMapping("/cart-items")
    public List<CartItem> getAllCartItems(@RequestHeader(name = "Authorization") String token) {
        log.debug("REST request to get all CartItems");
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
        return cartItemService.getCartItems(responseEntity.getBody().getId());
    }

    /**
     * {@code GET  /cart-items/:id} : get the "id" cartItem.
     *
     * @param id the id of the cartItem to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the cartItem, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/cart-items/{id}")
    public ResponseEntity<CartItem> getCartItem(@PathVariable Long id) {
        log.debug("REST request to get CartItem : {}", id);
        Optional<CartItem> cartItem = cartItemService.findOne(id);
        return ResponseUtil.wrapOrNotFound(cartItem);
    }

    /**
     * {@code DELETE  /cart-items/:id} : delete the "id" cartItem.
     *
     * @param id the id of the cartItem to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/cart-items/{id}")
    public ResponseEntity<Void> deleteCartItem(@PathVariable Long id) {
        log.debug("REST request to delete CartItem : {}", id);
        cartItemService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
