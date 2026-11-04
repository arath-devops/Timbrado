package mx.gov.erpgrp.budget.interfaces.rest;

import jakarta.validation.Valid;
import mx.gov.erpgrp.budget.application.command.CommitBudgetCommand;
import mx.gov.erpgrp.budget.application.handler.CommitBudgetHandler;
import mx.gov.erpgrp.budget.interfaces.dto.AllocationResponse;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/movements")
public class BudgetController {
    private final CommitBudgetHandler commitBudgetHandler;

    public BudgetController(CommitBudgetHandler commitBudgetHandler) {
        this.commitBudgetHandler = commitBudgetHandler;
    }

    @PostMapping("/commit")
    @PreAuthorize("hasAnyRole('BUD_ANALYST','BUD_APPROVER','ADMIN')")
    public AllocationResponse commit(@Valid @RequestBody CommitBudgetCommand command) {
        var allocation = commitBudgetHandler.handle(command);
        return new AllocationResponse(
                allocation.id(),
                allocation.clave(),
                allocation.authorized().amount(),
                allocation.committed().amount(),
                allocation.available().amount(),
                allocation.authorized().currency().getCurrencyCode(),
                allocation.status().name()
        );
    }
}
