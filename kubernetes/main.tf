# Require TF version to be same as or greater than 0.12.13
terraform {
  backend "s3" {
    region         = "eu-west-3"
    key            = "kubernetes.tfstate"
    dynamodb_table = "aws-locks"
    encrypt        = true
  }
}

data "terraform_remote_state" "core" {
  backend = "s3"
  config = {
    bucket = var.tf_state_bucket
    region = var.aws_region
    key    = "core.tfstate"
  }
}

module "k8s_infrastructure" {
  source                = "./modules/k8s_infrastructure"
  cluster_endpoint      = "${data.terraform_remote_state.core.outputs.eks_cluster.endpoint}:4433"
  cluster_ca            = data.terraform_remote_state.core.outputs.eks_cluster.certificate_authority.0.data
  cluster_name          = data.terraform_remote_state.core.outputs.eks_cluster.name
  aws_region            = var.aws_region
  vpc_id                = data.terraform_remote_state.core.outputs.eks_cluster.vpc_config[0].vpc_id
  deploy_metrics_server = false
}

module "k8s_database" {
  source           = "./modules/database"
  cluster_endpoint = "${data.terraform_remote_state.core.outputs.eks_cluster.endpoint}:4433"
  cluster_ca       = data.terraform_remote_state.core.outputs.eks_cluster.certificate_authority.0.data
  cluster_name     = data.terraform_remote_state.core.outputs.eks_cluster.name
}

module "k8s_api" {
  source           = "./modules/api"
  cluster_endpoint = "${data.terraform_remote_state.core.outputs.eks_cluster.endpoint}:4433"
  cluster_ca       = data.terraform_remote_state.core.outputs.eks_cluster.certificate_authority.0.data
  cluster_name     = data.terraform_remote_state.core.outputs.eks_cluster.name
}

module "k8s_client" {
  source           = "./modules/client"
  cluster_endpoint = "${data.terraform_remote_state.core.outputs.eks_cluster.endpoint}:4433"
  cluster_ca       = data.terraform_remote_state.core.outputs.eks_cluster.certificate_authority.0.data
  cluster_name     = data.terraform_remote_state.core.outputs.eks_cluster.name
}

module "k8s_secrets" {
  source             = "./modules/secrets"
  cluster_endpoint   = "${data.terraform_remote_state.core.outputs.eks_cluster.endpoint}:4433"
  cluster_ca         = data.terraform_remote_state.core.outputs.eks_cluster.certificate_authority.0.data
  cluster_name       = data.terraform_remote_state.core.outputs.eks_cluster.name
  tf_state_bucket    = var.tf_state_bucket
  aws_region         = var.aws_region
  allowed_account_id = var.allowed_account_id
}

module "k8s_ingress" {
  source             = "./modules/ingress"
  cluster_endpoint   = "${data.terraform_remote_state.core.outputs.eks_cluster.endpoint}:4433"
  cluster_ca         = data.terraform_remote_state.core.outputs.eks_cluster.certificate_authority.0.data
  cluster_name       = data.terraform_remote_state.core.outputs.eks_cluster.name
  allowed_account_id = var.allowed_account_id
  aws_region         = var.aws_region
}
