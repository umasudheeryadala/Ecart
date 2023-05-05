package com.infyme.ecartapplication.web.rest;

import com.infyme.ecartapplication.domain.OrderCategory;
import com.infyme.ecartapplication.repository.OrderCategoryRepository;
import com.infyme.ecartapplication.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.infyme.ecartapplication.domain.OrderCategory}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class OrderCategoryResource {

    private final Logger log = LoggerFactory.getLogger(OrderCategoryResource.class);

    private static final String ENTITY_NAME = "orderCategory";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final OrderCategoryRepository orderCategoryRepository;

    public OrderCategoryResource(OrderCategoryRepository orderCategoryRepository) {
        this.orderCategoryRepository = orderCategoryRepository;
    }

    /**
     * {@code POST  /order-categories} : Create a new orderCategory.
     *
     * @param orderCategory the orderCategory to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new orderCategory, or with status {@code 400 (Bad Request)} if the orderCategory has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/order-categories")
    public ResponseEntity<OrderCategory> createOrderCategory(@Valid @RequestBody OrderCategory orderCategory) throws URISyntaxException {
        log.debug("REST request to save OrderCategory : {}", orderCategory);
        if (orderCategory.getId() != null) {
            throw new BadRequestAlertException("A new orderCategory cannot already have an ID", ENTITY_NAME, "idexists");
        }
        OrderCategory result = orderCategoryRepository.save(orderCategory);
        return ResponseEntity
            .created(new URI("/api/order-categories/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /order-categories/:id} : Updates an existing orderCategory.
     *
     * @param id the id of the orderCategory to save.
     * @param orderCategory the orderCategory to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated orderCategory,
     * or with status {@code 400 (Bad Request)} if the orderCategory is not valid,
     * or with status {@code 500 (Internal Server Error)} if the orderCategory couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/order-categories/{id}")
    public ResponseEntity<OrderCategory> updateOrderCategory(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody OrderCategory orderCategory
    ) throws URISyntaxException {
        log.debug("REST request to update OrderCategory : {}, {}", id, orderCategory);
        if (orderCategory.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, orderCategory.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!orderCategoryRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        OrderCategory result = orderCategoryRepository.save(orderCategory);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, orderCategory.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /order-categories/:id} : Partial updates given fields of an existing orderCategory, field will ignore if it is null
     *
     * @param id the id of the orderCategory to save.
     * @param orderCategory the orderCategory to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated orderCategory,
     * or with status {@code 400 (Bad Request)} if the orderCategory is not valid,
     * or with status {@code 404 (Not Found)} if the orderCategory is not found,
     * or with status {@code 500 (Internal Server Error)} if the orderCategory couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/order-categories/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<OrderCategory> partialUpdateOrderCategory(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody OrderCategory orderCategory
    ) throws URISyntaxException {
        log.debug("REST request to partial update OrderCategory partially : {}, {}", id, orderCategory);
        if (orderCategory.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, orderCategory.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!orderCategoryRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<OrderCategory> result = orderCategoryRepository
            .findById(orderCategory.getId())
            .map(existingOrderCategory -> {
                if (orderCategory.getCategoryName() != null) {
                    existingOrderCategory.setCategoryName(orderCategory.getCategoryName());
                }
                if (orderCategory.getCategoryImage() != null) {
                    existingOrderCategory.setCategoryImage(orderCategory.getCategoryImage());
                }
                if (orderCategory.getCategoryImageContentType() != null) {
                    existingOrderCategory.setCategoryImageContentType(orderCategory.getCategoryImageContentType());
                }

                return existingOrderCategory;
            })
            .map(orderCategoryRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, orderCategory.getId().toString())
        );
    }

    /**
     * {@code GET  /order-categories} : get all the orderCategories.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of orderCategories in body.
     */
    @GetMapping("/order-categories")
    public List<OrderCategory> getAllOrderCategories() {
        log.debug("REST request to get all OrderCategories");
        return orderCategoryRepository.findAll();
    }

    /**
     * {@code GET  /order-categories/:id} : get the "id" orderCategory.
     *
     * @param id the id of the orderCategory to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the orderCategory, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/order-categories/{id}")
    public ResponseEntity<OrderCategory> getOrderCategory(@PathVariable Long id) {
        log.debug("REST request to get OrderCategory : {}", id);
        Optional<OrderCategory> orderCategory = orderCategoryRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(orderCategory);
    }

    /**
     * {@code DELETE  /order-categories/:id} : delete the "id" orderCategory.
     *
     * @param id the id of the orderCategory to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/order-categories/{id}")
    public ResponseEntity<Void> deleteOrderCategory(@PathVariable Long id) {
        log.debug("REST request to delete OrderCategory : {}", id);
        orderCategoryRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
