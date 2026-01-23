package com.mock.mocktrademarkapi.model.main;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "trademark")
@Getter @Setter @ToString
public class TradeMarkEntity {

    @Id
    private String id;

    private String markName;
    private LocalDate filingDate;
    private String statusCode;
    private String drawingCode;
    private Boolean standardCharacters;

    @ManyToMany(cascade = { CascadeType.PERSIST, CascadeType.MERGE })
    @JoinTable(
            name = "trademark_owner",
            joinColumns = @JoinColumn(name = "trademark_id"),
            inverseJoinColumns = @JoinColumn(name="owner_id")
    )
    private Set<OwnerEntity> owners;

    @OneToMany(mappedBy = "tradeMarkEntity",cascade = CascadeType.ALL)
    private Set<InternationalClassEntity> internationalClasses;

    @OneToMany(mappedBy = "tradeMarkEntity",cascade=CascadeType.ALL)
    private Set<GoodsAndServiceEntity> goodsAndServices;
}
