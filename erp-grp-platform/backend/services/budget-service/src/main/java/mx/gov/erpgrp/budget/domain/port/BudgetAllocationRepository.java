package mx.gov.erpgrp.budget.domain.port;

import mx.gov.erpgrp.budget.domain.model.BudgetAllocation;
import mx.gov.erpgrp.common.domain.TenantId;

import java.util.Optional;
import java.util.UUID;

public interface BudgetAllocationRepository {
    BudgetAllocation save(BudgetAllocation allocation);
    Optional<BudgetAllocation> findById(TenantId tenantId, UUID id);
}
