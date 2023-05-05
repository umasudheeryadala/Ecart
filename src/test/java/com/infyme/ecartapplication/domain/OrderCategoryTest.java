package com.infyme.ecartapplication.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.infyme.ecartapplication.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class OrderCategoryTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(OrderCategory.class);
        OrderCategory orderCategory1 = new OrderCategory();
        orderCategory1.setId(1L);
        OrderCategory orderCategory2 = new OrderCategory();
        orderCategory2.setId(orderCategory1.getId());
        assertThat(orderCategory1).isEqualTo(orderCategory2);
        orderCategory2.setId(2L);
        assertThat(orderCategory1).isNotEqualTo(orderCategory2);
        orderCategory1.setId(null);
        assertThat(orderCategory1).isNotEqualTo(orderCategory2);
    }
}
