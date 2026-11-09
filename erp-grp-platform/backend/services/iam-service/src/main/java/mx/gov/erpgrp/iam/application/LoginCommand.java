package mx.gov.erpgrp.iam.application;

public record LoginCommand(String companyCode, String username, String password) {}
