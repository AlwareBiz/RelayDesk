variable "aws_region" {
  type    = string
  default = "us-east-1"
}

variable "project_name" {
  type        = string
  description = "Lowercase name used for AWS resources."
}

variable "app_secrets" {
  type      = string
  sensitive = true
  default   = "{}"

  validation {
    condition     = can(jsondecode(var.app_secrets))
    error_message = "app_secrets must be valid JSON."
  }
}

variable "github_repository" {
  type        = string
  description = "owner/repository allowed to deploy."
}

variable "github_branch" {
  type    = string
  default = "main"
}
