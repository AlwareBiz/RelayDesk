# Terraform

This is a deliberately conservative AWS starting point. Configure remote state before a shared environment, provide `terraform.tfvars` outside version control, and add networking, IAM, compute, TLS, backups, and monitoring according to the project threat model.

The application expects the database URL and JWT secrets through the runtime environment. Terraform stores only the bootstrap secret values in Secrets Manager; the deployment mechanism that injects them is intentionally project-specific.
