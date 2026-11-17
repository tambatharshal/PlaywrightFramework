pipeline {
  agent any

  parameters {
    choice(
      name: 'ENV',
      choices: ['qa', 'staging', 'prod', 'local'],
      description: 'Target environment (maps to config/<ENV>.env.json)'
    )
    choice(
      name: 'SUITE',
      choices: ['all', 'ui', 'api'],
      description: 'Which suite to run'
    )
    booleanParam(
      name: 'HEADED',
      defaultValue: false,
      description: 'Run UI tests in headed mode (usually leave false on CI)'
    )
  }

  environment {
    CI = 'true'
    ENV = "${params.ENV}"
    // Optional DB secrets — configure in Jenkins → Credentials / Bindings:
    // DB_HOST = credentials('db-host')
    // DB_USER = credentials('db-user')
    // DB_PASSWORD = credentials('db-password')
    // DB_NAME = credentials('db-name')
  }

  options {
    timestamps()
    timeout(time: 60, unit: 'MINUTES')
    disableConcurrentBuilds()
    buildDiscarder(logRotator(numToKeepStr: '20', artifactNumToKeepStr: '10'))
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Install') {
      steps {
        sh '''
          node -v
          npm -v
          npm ci
        '''
        script {
          if (params.SUITE != 'api') {
            sh 'npx playwright install --with-deps chromium'
          }
        }
      }
    }

    stage('Test') {
      parallel {
        stage('UI - Chromium') {
          when {
            expression { params.SUITE == 'all' || params.SUITE == 'ui' }
          }
          steps {
            script {
              def headed = params.HEADED ? '--headed' : ''
              sh "npx playwright test --project=chromium ${headed}"
            }
          }
        }

        stage('API') {
          when {
            expression { params.SUITE == 'all' || params.SUITE == 'api' }
          }
          steps {
            sh 'npx playwright test --project=api'
          }
        }
      }
    }

    stage('Allure') {
      when {
        expression {
          return fileExists('allure-results')
        }
      }
      steps {
        sh '''
          if command -v java >/dev/null 2>&1; then
            npm run allure:generate || true
          else
            echo "Java not found — skipping Allure HTML generation (raw allure-results still archived)"
          fi
        '''
      }
    }
  }

  post {
    always {
      junit allowEmptyResults: true, testResults: 'test-results/junit-report.xml'

      archiveArtifacts artifacts: 'playwright-report/**,test-results/**,allure-results/**,allure-report/**',
                       allowEmptyArchive: true,
                       fingerprint: true

      publishHTML(target: [
        allowMissing         : true,
        alwaysLinkToLastBuild: true,
        keepAll              : true,
        reportDir            : 'playwright-report',
        reportFiles          : 'index.html',
        reportName           : 'Playwright HTML Report'
      ])

      publishHTML(target: [
        allowMissing         : true,
        alwaysLinkToLastBuild: true,
        keepAll              : true,
        reportDir            : 'allure-report',
        reportFiles          : 'index.html',
        reportName           : 'Allure Report'
      ])
    }

    success {
      echo "Playwright pipeline succeeded — ENV=${params.ENV}, SUITE=${params.SUITE}"
    }

    failure {
      echo "Playwright pipeline failed — check Playwright HTML Report / console log"
    }

    cleanup {
      cleanWs(deleteDirs: true, notFailBuild: true)
    }
  }
}
