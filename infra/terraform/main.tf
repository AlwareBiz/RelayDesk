resource "random_password" "database" {
  length  = 32
  special = true
}

resource "aws_secretsmanager_secret" "database" {
  name = "${var.project_name}/database"
}

resource "aws_secretsmanager_secret_version" "database" {
  secret_id     = aws_secretsmanager_secret.database.id
  secret_string = random_password.database.result
}

resource "aws_secretsmanager_secret" "application" {
  name = "${var.project_name}/application"
}

resource "aws_secretsmanager_secret_version" "application" {
  secret_id     = aws_secretsmanager_secret.application.id
  secret_string = var.app_secrets
}

resource "aws_s3_bucket" "storage" {
  bucket = "${var.project_name}-storage"
}

resource "aws_ecr_repository" "application" {
  name                 = var.project_name
  image_tag_mutability = "IMMUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }
}

# Add the EC2/VPC/SSM policy from your deployment environment here. This starter keeps
# stateful compute choices explicit instead of silently creating a public database.
