package mx.gov.erpgrp.budget.application.handler;

import mx.gov.erpgrp.budget.application.command.CommitBudgetCommand;
import mx.gov.erpgrp.budget.domain.model.BudgetAllocation;
import mx.gov.erpgrp.budget.domain.port.BudgetAllocationRepository;
import mx.gov.erpgrp.budget.infrastructure.messaging.BudgetEventPublisher;
import mx.gov.erpgrp.common.domain.Money;
import mx.gov.erpgrp.common.security.TenantContext;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CommitBudgetHandler {
    private final BudgetAllocationRepository repository;
    private final BudgetEventPublisher publisher;

    public CommitBudgetHandler(BudgetAllocationRepository repository, BudgetEventPublisher publisher) {
        this.repository = repository;
        this.publisher = publisher;
    }

    @Transactional
    public BudgetAllocation handle(CommitBudgetCommand command) {
        var tenantId = TenantContext.require();
        var allocation = repository.findById(tenantId, command.allocationId())
                .orElseThrow(() -> new IllegalArgumentException("Allocation not found"));
        allocation.commit(Money.of(command.amount().toPlainString(), command.currency()),
                command.referenceType(), command.referenceId());
        var saved = repository.save(allocation);
        publisher.publish(saved.pullDomainEvents());
        return saved;
    }
}
