package com.mock.mocktrademarkapi.model.main;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter @Setter
public class GoodsAndServiceEntity {

    @Id
    @GeneratedValue(strategy =GenerationType.IDENTITY)
    private Long id;

    @Lob
    private String description;

    @ManyToOne
    @JoinColumn(name = "trademark_id")
    private TradeMarkEntity tradeMarkEntity;
}
