output "ecr_repository_url" {
  value = aws_ecr_repository.application.repository_url
}

output "storage_bucket" {
  value = aws_s3_bucket.storage.bucket
}

output "database_secret_arn" {
  value = aws_secretsmanager_secret.database.arn
}
