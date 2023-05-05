package com.infyme.ecartapplication.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A OrderCategory.
 */
@Entity
@Table(name = "order_category")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class OrderCategory implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @NotNull
    @Pattern(regexp = "([A-Z][a-z]+)( [A-Z][a-z]+)*")
    @Column(name = "category_name", nullable = false)
    private String categoryName;

    @Lob
    @Column(name = "category_image")
    private byte[] categoryImage;

    @Column(name = "category_image_content_type")
    private String categoryImageContentType;

    @OneToMany(mappedBy = "orderCategory")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "orderCategory" }, allowSetters = true)
    private Set<OrderItem> orderItems = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public OrderCategory id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCategoryName() {
        return this.categoryName;
    }

    public OrderCategory categoryName(String categoryName) {
        this.setCategoryName(categoryName);
        return this;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    public byte[] getCategoryImage() {
        return this.categoryImage;
    }

    public OrderCategory categoryImage(byte[] categoryImage) {
        this.setCategoryImage(categoryImage);
        return this;
    }

    public void setCategoryImage(byte[] categoryImage) {
        this.categoryImage = categoryImage;
    }

    public String getCategoryImageContentType() {
        return this.categoryImageContentType;
    }

    public OrderCategory categoryImageContentType(String categoryImageContentType) {
        this.categoryImageContentType = categoryImageContentType;
        return this;
    }

    public void setCategoryImageContentType(String categoryImageContentType) {
        this.categoryImageContentType = categoryImageContentType;
    }

    public Set<OrderItem> getOrderItems() {
        return this.orderItems;
    }

    public void setOrderItems(Set<OrderItem> orderItems) {
        if (this.orderItems != null) {
            this.orderItems.forEach(i -> i.setOrderCategory(null));
        }
        if (orderItems != null) {
            orderItems.forEach(i -> i.setOrderCategory(this));
        }
        this.orderItems = orderItems;
    }

    public OrderCategory orderItems(Set<OrderItem> orderItems) {
        this.setOrderItems(orderItems);
        return this;
    }

    public OrderCategory addOrderItem(OrderItem orderItem) {
        this.orderItems.add(orderItem);
        orderItem.setOrderCategory(this);
        return this;
    }

    public OrderCategory removeOrderItem(OrderItem orderItem) {
        this.orderItems.remove(orderItem);
        orderItem.setOrderCategory(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof OrderCategory)) {
            return false;
        }
        return id != null && id.equals(((OrderCategory) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "OrderCategory{" +
            "id=" + getId() +
            ", categoryName='" + getCategoryName() + "'" +
            ", categoryImage='" + getCategoryImage() + "'" +
            ", categoryImageContentType='" + getCategoryImageContentType() + "'" +
            "}";
    }
}
