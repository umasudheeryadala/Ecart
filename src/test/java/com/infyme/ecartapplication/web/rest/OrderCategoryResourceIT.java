package com.infyme.ecartapplication.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.infyme.ecartapplication.IntegrationTest;
import com.infyme.ecartapplication.domain.OrderCategory;
import com.infyme.ecartapplication.repository.OrderCategoryRepository;
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
import org.springframework.util.Base64Utils;

/**
 * Integration tests for the {@link OrderCategoryResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class OrderCategoryResourceIT {

    private static final String DEFAULT_CATEGORY_NAME = "Tqgkuqt Jwvcji Nbppk Qp";
    private static final String UPDATED_CATEGORY_NAME = "Ove Jkk Hmdoz Xs Hkq";

    private static final byte[] DEFAULT_CATEGORY_IMAGE = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_CATEGORY_IMAGE = TestUtil.createByteArray(1, "1");
    private static final String DEFAULT_CATEGORY_IMAGE_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_CATEGORY_IMAGE_CONTENT_TYPE = "image/png";

    private static final String ENTITY_API_URL = "/api/order-categories";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private OrderCategoryRepository orderCategoryRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restOrderCategoryMockMvc;

    private OrderCategory orderCategory;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static OrderCategory createEntity(EntityManager em) {
        OrderCategory orderCategory = new OrderCategory()
            .categoryName(DEFAULT_CATEGORY_NAME)
            .categoryImage(DEFAULT_CATEGORY_IMAGE)
            .categoryImageContentType(DEFAULT_CATEGORY_IMAGE_CONTENT_TYPE);
        return orderCategory;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static OrderCategory createUpdatedEntity(EntityManager em) {
        OrderCategory orderCategory = new OrderCategory()
            .categoryName(UPDATED_CATEGORY_NAME)
            .categoryImage(UPDATED_CATEGORY_IMAGE)
            .categoryImageContentType(UPDATED_CATEGORY_IMAGE_CONTENT_TYPE);
        return orderCategory;
    }

    @BeforeEach
    public void initTest() {
        orderCategory = createEntity(em);
    }

    @Test
    @Transactional
    void createOrderCategory() throws Exception {
        int databaseSizeBeforeCreate = orderCategoryRepository.findAll().size();
        // Create the OrderCategory
        restOrderCategoryMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(orderCategory)))
            .andExpect(status().isCreated());

        // Validate the OrderCategory in the database
        List<OrderCategory> orderCategoryList = orderCategoryRepository.findAll();
        assertThat(orderCategoryList).hasSize(databaseSizeBeforeCreate + 1);
        OrderCategory testOrderCategory = orderCategoryList.get(orderCategoryList.size() - 1);
        assertThat(testOrderCategory.getCategoryName()).isEqualTo(DEFAULT_CATEGORY_NAME);
        assertThat(testOrderCategory.getCategoryImage()).isEqualTo(DEFAULT_CATEGORY_IMAGE);
        assertThat(testOrderCategory.getCategoryImageContentType()).isEqualTo(DEFAULT_CATEGORY_IMAGE_CONTENT_TYPE);
    }

    @Test
    @Transactional
    void createOrderCategoryWithExistingId() throws Exception {
        // Create the OrderCategory with an existing ID
        orderCategory.setId(1L);

        int databaseSizeBeforeCreate = orderCategoryRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restOrderCategoryMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(orderCategory)))
            .andExpect(status().isBadRequest());

        // Validate the OrderCategory in the database
        List<OrderCategory> orderCategoryList = orderCategoryRepository.findAll();
        assertThat(orderCategoryList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkCategoryNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = orderCategoryRepository.findAll().size();
        // set the field null
        orderCategory.setCategoryName(null);

        // Create the OrderCategory, which fails.

        restOrderCategoryMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(orderCategory)))
            .andExpect(status().isBadRequest());

        List<OrderCategory> orderCategoryList = orderCategoryRepository.findAll();
        assertThat(orderCategoryList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllOrderCategories() throws Exception {
        // Initialize the database
        orderCategoryRepository.saveAndFlush(orderCategory);

        // Get all the orderCategoryList
        restOrderCategoryMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(orderCategory.getId().intValue())))
            .andExpect(jsonPath("$.[*].categoryName").value(hasItem(DEFAULT_CATEGORY_NAME)))
            .andExpect(jsonPath("$.[*].categoryImageContentType").value(hasItem(DEFAULT_CATEGORY_IMAGE_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].categoryImage").value(hasItem(Base64Utils.encodeToString(DEFAULT_CATEGORY_IMAGE))));
    }

    @Test
    @Transactional
    void getOrderCategory() throws Exception {
        // Initialize the database
        orderCategoryRepository.saveAndFlush(orderCategory);

        // Get the orderCategory
        restOrderCategoryMockMvc
            .perform(get(ENTITY_API_URL_ID, orderCategory.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(orderCategory.getId().intValue()))
            .andExpect(jsonPath("$.categoryName").value(DEFAULT_CATEGORY_NAME))
            .andExpect(jsonPath("$.categoryImageContentType").value(DEFAULT_CATEGORY_IMAGE_CONTENT_TYPE))
            .andExpect(jsonPath("$.categoryImage").value(Base64Utils.encodeToString(DEFAULT_CATEGORY_IMAGE)));
    }

    @Test
    @Transactional
    void getNonExistingOrderCategory() throws Exception {
        // Get the orderCategory
        restOrderCategoryMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingOrderCategory() throws Exception {
        // Initialize the database
        orderCategoryRepository.saveAndFlush(orderCategory);

        int databaseSizeBeforeUpdate = orderCategoryRepository.findAll().size();

        // Update the orderCategory
        OrderCategory updatedOrderCategory = orderCategoryRepository.findById(orderCategory.getId()).get();
        // Disconnect from session so that the updates on updatedOrderCategory are not directly saved in db
        em.detach(updatedOrderCategory);
        updatedOrderCategory
            .categoryName(UPDATED_CATEGORY_NAME)
            .categoryImage(UPDATED_CATEGORY_IMAGE)
            .categoryImageContentType(UPDATED_CATEGORY_IMAGE_CONTENT_TYPE);

        restOrderCategoryMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedOrderCategory.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedOrderCategory))
            )
            .andExpect(status().isOk());

        // Validate the OrderCategory in the database
        List<OrderCategory> orderCategoryList = orderCategoryRepository.findAll();
        assertThat(orderCategoryList).hasSize(databaseSizeBeforeUpdate);
        OrderCategory testOrderCategory = orderCategoryList.get(orderCategoryList.size() - 1);
        assertThat(testOrderCategory.getCategoryName()).isEqualTo(UPDATED_CATEGORY_NAME);
        assertThat(testOrderCategory.getCategoryImage()).isEqualTo(UPDATED_CATEGORY_IMAGE);
        assertThat(testOrderCategory.getCategoryImageContentType()).isEqualTo(UPDATED_CATEGORY_IMAGE_CONTENT_TYPE);
    }

    @Test
    @Transactional
    void putNonExistingOrderCategory() throws Exception {
        int databaseSizeBeforeUpdate = orderCategoryRepository.findAll().size();
        orderCategory.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restOrderCategoryMockMvc
            .perform(
                put(ENTITY_API_URL_ID, orderCategory.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(orderCategory))
            )
            .andExpect(status().isBadRequest());

        // Validate the OrderCategory in the database
        List<OrderCategory> orderCategoryList = orderCategoryRepository.findAll();
        assertThat(orderCategoryList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchOrderCategory() throws Exception {
        int databaseSizeBeforeUpdate = orderCategoryRepository.findAll().size();
        orderCategory.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOrderCategoryMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(orderCategory))
            )
            .andExpect(status().isBadRequest());

        // Validate the OrderCategory in the database
        List<OrderCategory> orderCategoryList = orderCategoryRepository.findAll();
        assertThat(orderCategoryList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamOrderCategory() throws Exception {
        int databaseSizeBeforeUpdate = orderCategoryRepository.findAll().size();
        orderCategory.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOrderCategoryMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(orderCategory)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the OrderCategory in the database
        List<OrderCategory> orderCategoryList = orderCategoryRepository.findAll();
        assertThat(orderCategoryList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateOrderCategoryWithPatch() throws Exception {
        // Initialize the database
        orderCategoryRepository.saveAndFlush(orderCategory);

        int databaseSizeBeforeUpdate = orderCategoryRepository.findAll().size();

        // Update the orderCategory using partial update
        OrderCategory partialUpdatedOrderCategory = new OrderCategory();
        partialUpdatedOrderCategory.setId(orderCategory.getId());

        restOrderCategoryMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedOrderCategory.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedOrderCategory))
            )
            .andExpect(status().isOk());

        // Validate the OrderCategory in the database
        List<OrderCategory> orderCategoryList = orderCategoryRepository.findAll();
        assertThat(orderCategoryList).hasSize(databaseSizeBeforeUpdate);
        OrderCategory testOrderCategory = orderCategoryList.get(orderCategoryList.size() - 1);
        assertThat(testOrderCategory.getCategoryName()).isEqualTo(DEFAULT_CATEGORY_NAME);
        assertThat(testOrderCategory.getCategoryImage()).isEqualTo(DEFAULT_CATEGORY_IMAGE);
        assertThat(testOrderCategory.getCategoryImageContentType()).isEqualTo(DEFAULT_CATEGORY_IMAGE_CONTENT_TYPE);
    }

    @Test
    @Transactional
    void fullUpdateOrderCategoryWithPatch() throws Exception {
        // Initialize the database
        orderCategoryRepository.saveAndFlush(orderCategory);

        int databaseSizeBeforeUpdate = orderCategoryRepository.findAll().size();

        // Update the orderCategory using partial update
        OrderCategory partialUpdatedOrderCategory = new OrderCategory();
        partialUpdatedOrderCategory.setId(orderCategory.getId());

        partialUpdatedOrderCategory
            .categoryName(UPDATED_CATEGORY_NAME)
            .categoryImage(UPDATED_CATEGORY_IMAGE)
            .categoryImageContentType(UPDATED_CATEGORY_IMAGE_CONTENT_TYPE);

        restOrderCategoryMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedOrderCategory.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedOrderCategory))
            )
            .andExpect(status().isOk());

        // Validate the OrderCategory in the database
        List<OrderCategory> orderCategoryList = orderCategoryRepository.findAll();
        assertThat(orderCategoryList).hasSize(databaseSizeBeforeUpdate);
        OrderCategory testOrderCategory = orderCategoryList.get(orderCategoryList.size() - 1);
        assertThat(testOrderCategory.getCategoryName()).isEqualTo(UPDATED_CATEGORY_NAME);
        assertThat(testOrderCategory.getCategoryImage()).isEqualTo(UPDATED_CATEGORY_IMAGE);
        assertThat(testOrderCategory.getCategoryImageContentType()).isEqualTo(UPDATED_CATEGORY_IMAGE_CONTENT_TYPE);
    }

    @Test
    @Transactional
    void patchNonExistingOrderCategory() throws Exception {
        int databaseSizeBeforeUpdate = orderCategoryRepository.findAll().size();
        orderCategory.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restOrderCategoryMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, orderCategory.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(orderCategory))
            )
            .andExpect(status().isBadRequest());

        // Validate the OrderCategory in the database
        List<OrderCategory> orderCategoryList = orderCategoryRepository.findAll();
        assertThat(orderCategoryList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchOrderCategory() throws Exception {
        int databaseSizeBeforeUpdate = orderCategoryRepository.findAll().size();
        orderCategory.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOrderCategoryMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(orderCategory))
            )
            .andExpect(status().isBadRequest());

        // Validate the OrderCategory in the database
        List<OrderCategory> orderCategoryList = orderCategoryRepository.findAll();
        assertThat(orderCategoryList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamOrderCategory() throws Exception {
        int databaseSizeBeforeUpdate = orderCategoryRepository.findAll().size();
        orderCategory.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOrderCategoryMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(orderCategory))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the OrderCategory in the database
        List<OrderCategory> orderCategoryList = orderCategoryRepository.findAll();
        assertThat(orderCategoryList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteOrderCategory() throws Exception {
        // Initialize the database
        orderCategoryRepository.saveAndFlush(orderCategory);

        int databaseSizeBeforeDelete = orderCategoryRepository.findAll().size();

        // Delete the orderCategory
        restOrderCategoryMockMvc
            .perform(delete(ENTITY_API_URL_ID, orderCategory.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<OrderCategory> orderCategoryList = orderCategoryRepository.findAll();
        assertThat(orderCategoryList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
