package org.example.gestionare_bilete_avion.discount;

public enum Discount {
    TUR_RETUR(5),
    LAST_MINUTE(40);

    private final int discount;
    Discount(int discount)
    {
        this.discount = discount;
    }
}
