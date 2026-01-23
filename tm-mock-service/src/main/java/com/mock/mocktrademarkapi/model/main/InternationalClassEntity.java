package com.mock.mocktrademarkapi.model.main;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter @Setter
public class InternationalClassEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String classCode;

    @ManyToOne
    @JoinColumn(name = "trademark_id")
    private TradeMarkEntity tradeMarkEntity;
}
