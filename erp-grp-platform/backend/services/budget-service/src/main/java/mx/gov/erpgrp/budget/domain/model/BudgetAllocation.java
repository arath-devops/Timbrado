package mx.gov.erpgrp.budget.domain.model;

import mx.gov.erpgrp.common.domain.AggregateRoot;
import mx.gov.erpgrp.common.domain.Money;
import mx.gov.erpgrp.common.domain.TenantId;
import mx.gov.erpgrp.budget.domain.event.BudgetCommitted;

import java.time.Instant;
import java.util.UUID;

public class BudgetAllocation extends AggregateRoot {
    private final UUID id;
    private final TenantId tenantId;
    private final UUID cycleId;
    private final String clave;
    private Money authorized;
    private Money committed;
    private Money accrued;
    private Money paid;
    private AllocationStatus status;

    private BudgetAllocation(UUID id, TenantId tenantId, UUID cycleId, String clave, Money authorized) {
        this.id = id;
        this.tenantId = tenantId;
        this.cycleId = cycleId;
        this.clave = clave;
        this.authorized = authorized;
        this.committed = Money.of("0", authorized.currency().getCurrencyCode());
        this.accrued = Money.of("0", authorized.currency().getCurrencyCode());
        this.paid = Money.of("0", authorized.currency().getCurrencyCode());
        this.status = AllocationStatus.ACTIVE;
    }

    public static BudgetAllocation create(TenantId tenantId, UUID cycleId, String clave, Money authorized) {
        return new BudgetAllocation(UUID.randomUUID(), tenantId, cycleId, clave, authorized);
    }

    public void commit(Money amount, String referenceType, UUID referenceId) {
        assertActive();
        var available = authorized.subtract(committed);
        if (amount.amount().compareTo(available.amount()) > 0) {
            throw new IllegalStateException("Insufficient budget availability for clave " + clave);
        }
        this.committed = this.committed.add(amount);
        registerEvent(new BudgetCommitted(
                UUID.randomUUID(), Instant.now(), tenantId, id, clave,
                amount.amount(), amount.currency().getCurrencyCode(),
                referenceType, referenceId
        ));
    }

    public void accrue(Money amount) {
        assertActive();
        if (amount.amount().compareTo(committed.subtract(accrued).amount()) > 0) {
            throw new IllegalStateException("Accrual exceeds committed balance");
        }
        this.accrued = this.accrued.add(amount);
    }

    public void pay(Money amount) {
        assertActive();
        if (amount.amount().compareTo(accrued.subtract(paid).amount()) > 0) {
            throw new IllegalStateException("Payment exceeds accrued balance");
        }
        this.paid = this.paid.add(amount);
    }

    private void assertActive() {
        if (status != AllocationStatus.ACTIVE) {
            throw new IllegalStateException("Allocation is not ACTIVE: " + status);
        }
    }

    public UUID id() { return id; }
    public TenantId tenantId() { return tenantId; }
    public UUID cycleId() { return cycleId; }
    public String clave() { return clave; }
    public Money authorized() { return authorized; }
    public Money committed() { return committed; }
    public Money accrued() { return accrued; }
    public Money paid() { return paid; }
    public AllocationStatus status() { return status; }
    public Money available() { return authorized.subtract(committed); }
}
