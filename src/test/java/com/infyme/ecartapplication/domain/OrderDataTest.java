package com.infyme.ecartapplication.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.infyme.ecartapplication.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class OrderDataTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(OrderData.class);
        OrderData orderData1 = new OrderData();
        orderData1.setId(1L);
        OrderData orderData2 = new OrderData();
        orderData2.setId(orderData1.getId());
        assertThat(orderData1).isEqualTo(orderData2);
        orderData2.setId(2L);
        assertThat(orderData1).isNotEqualTo(orderData2);
        orderData1.setId(null);
        assertThat(orderData1).isNotEqualTo(orderData2);
    }
}
