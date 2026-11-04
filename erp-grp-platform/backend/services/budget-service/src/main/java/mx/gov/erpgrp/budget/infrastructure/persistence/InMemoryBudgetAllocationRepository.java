package mx.gov.erpgrp.budget.infrastructure.persistence;

import mx.gov.erpgrp.budget.domain.model.BudgetAllocation;
import mx.gov.erpgrp.budget.domain.port.BudgetAllocationRepository;
import mx.gov.erpgrp.common.domain.TenantId;
import org.springframework.stereotype.Repository;

import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Placeholder adapter for local bootstrapping. Replace with JPA adapter + Flyway in implementation sprint.
 */
@Repository
public class InMemoryBudgetAllocationRepository implements BudgetAllocationRepository {
    private final Map<String, BudgetAllocation> store = new ConcurrentHashMap<>();

    private static String key(TenantId tenantId, UUID id) {
        return tenantId + ":" + id;
    }

    @Override
    public BudgetAllocation save(BudgetAllocation allocation) {
        store.put(key(allocation.tenantId(), allocation.id()), allocation);
        return allocation;
    }

    @Override
    public Optional<BudgetAllocation> findById(TenantId tenantId, UUID id) {
        return Optional.ofNullable(store.get(key(tenantId, id)));
    }
}
