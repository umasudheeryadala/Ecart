package com.infyme.ecartapplication.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.infyme.ecartapplication.IntegrationTest;
import com.infyme.ecartapplication.domain.OrderData;
import com.infyme.ecartapplication.repository.OrderDataRepository;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link OrderDataResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class OrderDataResourceIT {

    private static final Long DEFAULT_QUANTITY = 1L;
    private static final Long UPDATED_QUANTITY = 2L;

    private static final String DEFAULT_PRODUCT_NAME = "Zft Pqxyt Snr Oohmz Gzdkxf";
    private static final String UPDATED_PRODUCT_NAME = "Yrucscg";

    private static final Long DEFAULT_PRICE = 1L;
    private static final Long UPDATED_PRICE = 2L;

    private static final String ENTITY_API_URL = "/api/order-data";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private OrderDataRepository orderDataRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restOrderDataMockMvc;

    private OrderData orderData;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static OrderData createEntity(EntityManager em) {
        OrderData orderData = new OrderData().quantity(DEFAULT_QUANTITY).productName(DEFAULT_PRODUCT_NAME).price(DEFAULT_PRICE);
        return orderData;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static OrderData createUpdatedEntity(EntityManager em) {
        OrderData orderData = new OrderData().quantity(UPDATED_QUANTITY).productName(UPDATED_PRODUCT_NAME).price(UPDATED_PRICE);
        return orderData;
    }

    @BeforeEach
    public void initTest() {
        orderData = createEntity(em);
    }

    @Test
    @Transactional
    void createOrderData() throws Exception {
        int databaseSizeBeforeCreate = orderDataRepository.findAll().size();
        // Create the OrderData
        restOrderDataMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(orderData)))
            .andExpect(status().isCreated());

        // Validate the OrderData in the database
        List<OrderData> orderDataList = orderDataRepository.findAll();
        assertThat(orderDataList).hasSize(databaseSizeBeforeCreate + 1);
        OrderData testOrderData = orderDataList.get(orderDataList.size() - 1);
        assertThat(testOrderData.getQuantity()).isEqualTo(DEFAULT_QUANTITY);
        assertThat(testOrderData.getProductName()).isEqualTo(DEFAULT_PRODUCT_NAME);
        assertThat(testOrderData.getPrice()).isEqualTo(DEFAULT_PRICE);
    }

    @Test
    @Transactional
    void createOrderDataWithExistingId() throws Exception {
        // Create the OrderData with an existing ID
        orderData.setId(1L);

        int databaseSizeBeforeCreate = orderDataRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restOrderDataMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(orderData)))
            .andExpect(status().isBadRequest());

        // Validate the OrderData in the database
        List<OrderData> orderDataList = orderDataRepository.findAll();
        assertThat(orderDataList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkQuantityIsRequired() throws Exception {
        int databaseSizeBeforeTest = orderDataRepository.findAll().size();
        // set the field null
        orderData.setQuantity(null);

        // Create the OrderData, which fails.

        restOrderDataMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(orderData)))
            .andExpect(status().isBadRequest());

        List<OrderData> orderDataList = orderDataRepository.findAll();
        assertThat(orderDataList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkProductNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = orderDataRepository.findAll().size();
        // set the field null
        orderData.setProductName(null);

        // Create the OrderData, which fails.

        restOrderDataMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(orderData)))
            .andExpect(status().isBadRequest());

        List<OrderData> orderDataList = orderDataRepository.findAll();
        assertThat(orderDataList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkPriceIsRequired() throws Exception {
        int databaseSizeBeforeTest = orderDataRepository.findAll().size();
        // set the field null
        orderData.setPrice(null);

        // Create the OrderData, which fails.

        restOrderDataMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(orderData)))
            .andExpect(status().isBadRequest());

        List<OrderData> orderDataList = orderDataRepository.findAll();
        assertThat(orderDataList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllOrderData() throws Exception {
        // Initialize the database
        orderDataRepository.saveAndFlush(orderData);

        // Get all the orderDataList
        restOrderDataMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(orderData.getId().intValue())))
            .andExpect(jsonPath("$.[*].quantity").value(hasItem(DEFAULT_QUANTITY.intValue())))
            .andExpect(jsonPath("$.[*].productName").value(hasItem(DEFAULT_PRODUCT_NAME)))
            .andExpect(jsonPath("$.[*].price").value(hasItem(DEFAULT_PRICE.intValue())));
    }

    @Test
    @Transactional
    void getOrderData() throws Exception {
        // Initialize the database
        orderDataRepository.saveAndFlush(orderData);

        // Get the orderData
        restOrderDataMockMvc
            .perform(get(ENTITY_API_URL_ID, orderData.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(orderData.getId().intValue()))
            .andExpect(jsonPath("$.quantity").value(DEFAULT_QUANTITY.intValue()))
            .andExpect(jsonPath("$.productName").value(DEFAULT_PRODUCT_NAME))
            .andExpect(jsonPath("$.price").value(DEFAULT_PRICE.intValue()));
    }

    @Test
    @Transactional
    void getNonExistingOrderData() throws Exception {
        // Get the orderData
        restOrderDataMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingOrderData() throws Exception {
        // Initialize the database
        orderDataRepository.saveAndFlush(orderData);

        int databaseSizeBeforeUpdate = orderDataRepository.findAll().size();

        // Update the orderData
        OrderData updatedOrderData = orderDataRepository.findById(orderData.getId()).get();
        // Disconnect from session so that the updates on updatedOrderData are not directly saved in db
        em.detach(updatedOrderData);
        updatedOrderData.quantity(UPDATED_QUANTITY).productName(UPDATED_PRODUCT_NAME).price(UPDATED_PRICE);

        restOrderDataMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedOrderData.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedOrderData))
            )
            .andExpect(status().isOk());

        // Validate the OrderData in the database
        List<OrderData> orderDataList = orderDataRepository.findAll();
        assertThat(orderDataList).hasSize(databaseSizeBeforeUpdate);
        OrderData testOrderData = orderDataList.get(orderDataList.size() - 1);
        assertThat(testOrderData.getQuantity()).isEqualTo(UPDATED_QUANTITY);
        assertThat(testOrderData.getProductName()).isEqualTo(UPDATED_PRODUCT_NAME);
        assertThat(testOrderData.getPrice()).isEqualTo(UPDATED_PRICE);
    }

    @Test
    @Transactional
    void putNonExistingOrderData() throws Exception {
        int databaseSizeBeforeUpdate = orderDataRepository.findAll().size();
        orderData.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restOrderDataMockMvc
            .perform(
                put(ENTITY_API_URL_ID, orderData.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(orderData))
            )
            .andExpect(status().isBadRequest());

        // Validate the OrderData in the database
        List<OrderData> orderDataList = orderDataRepository.findAll();
        assertThat(orderDataList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchOrderData() throws Exception {
        int databaseSizeBeforeUpdate = orderDataRepository.findAll().size();
        orderData.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOrderDataMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(orderData))
            )
            .andExpect(status().isBadRequest());

        // Validate the OrderData in the database
        List<OrderData> orderDataList = orderDataRepository.findAll();
        assertThat(orderDataList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamOrderData() throws Exception {
        int databaseSizeBeforeUpdate = orderDataRepository.findAll().size();
        orderData.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOrderDataMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(orderData)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the OrderData in the database
        List<OrderData> orderDataList = orderDataRepository.findAll();
        assertThat(orderDataList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateOrderDataWithPatch() throws Exception {
        // Initialize the database
        orderDataRepository.saveAndFlush(orderData);

        int databaseSizeBeforeUpdate = orderDataRepository.findAll().size();

        // Update the orderData using partial update
        OrderData partialUpdatedOrderData = new OrderData();
        partialUpdatedOrderData.setId(orderData.getId());

        partialUpdatedOrderData.quantity(UPDATED_QUANTITY).productName(UPDATED_PRODUCT_NAME);

        restOrderDataMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedOrderData.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedOrderData))
            )
            .andExpect(status().isOk());

        // Validate the OrderData in the database
        List<OrderData> orderDataList = orderDataRepository.findAll();
        assertThat(orderDataList).hasSize(databaseSizeBeforeUpdate);
        OrderData testOrderData = orderDataList.get(orderDataList.size() - 1);
        assertThat(testOrderData.getQuantity()).isEqualTo(UPDATED_QUANTITY);
        assertThat(testOrderData.getProductName()).isEqualTo(UPDATED_PRODUCT_NAME);
        assertThat(testOrderData.getPrice()).isEqualTo(DEFAULT_PRICE);
    }

    @Test
    @Transactional
    void fullUpdateOrderDataWithPatch() throws Exception {
        // Initialize the database
        orderDataRepository.saveAndFlush(orderData);

        int databaseSizeBeforeUpdate = orderDataRepository.findAll().size();

        // Update the orderData using partial update
        OrderData partialUpdatedOrderData = new OrderData();
        partialUpdatedOrderData.setId(orderData.getId());

        partialUpdatedOrderData.quantity(UPDATED_QUANTITY).productName(UPDATED_PRODUCT_NAME).price(UPDATED_PRICE);

        restOrderDataMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedOrderData.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedOrderData))
            )
            .andExpect(status().isOk());

        // Validate the OrderData in the database
        List<OrderData> orderDataList = orderDataRepository.findAll();
        assertThat(orderDataList).hasSize(databaseSizeBeforeUpdate);
        OrderData testOrderData = orderDataList.get(orderDataList.size() - 1);
        assertThat(testOrderData.getQuantity()).isEqualTo(UPDATED_QUANTITY);
        assertThat(testOrderData.getProductName()).isEqualTo(UPDATED_PRODUCT_NAME);
        assertThat(testOrderData.getPrice()).isEqualTo(UPDATED_PRICE);
    }

    @Test
    @Transactional
    void patchNonExistingOrderData() throws Exception {
        int databaseSizeBeforeUpdate = orderDataRepository.findAll().size();
        orderData.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restOrderDataMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, orderData.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(orderData))
            )
            .andExpect(status().isBadRequest());

        // Validate the OrderData in the database
        List<OrderData> orderDataList = orderDataRepository.findAll();
        assertThat(orderDataList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchOrderData() throws Exception {
        int databaseSizeBeforeUpdate = orderDataRepository.findAll().size();
        orderData.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOrderDataMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(orderData))
            )
            .andExpect(status().isBadRequest());

        // Validate the OrderData in the database
        List<OrderData> orderDataList = orderDataRepository.findAll();
        assertThat(orderDataList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamOrderData() throws Exception {
        int databaseSizeBeforeUpdate = orderDataRepository.findAll().size();
        orderData.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOrderDataMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(orderData))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the OrderData in the database
        List<OrderData> orderDataList = orderDataRepository.findAll();
        assertThat(orderDataList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteOrderData() throws Exception {
        // Initialize the database
        orderDataRepository.saveAndFlush(orderData);

        int databaseSizeBeforeDelete = orderDataRepository.findAll().size();

        // Delete the orderData
        restOrderDataMockMvc
            .perform(delete(ENTITY_API_URL_ID, orderData.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<OrderData> orderDataList = orderDataRepository.findAll();
        assertThat(orderDataList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
