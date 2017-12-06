node {
    checkout scm
    stage('Build') {
        echo 'Building..'
        dir('./Week_01/Day_3/provisioning')
        {
            sh './create-new-aws-docker-host-instance.sh'
        }
    }
    stage('Test') {
        echo 'Testing..'
    }
    stage('Deploy') {
        echo 'Deploying....'
    }
}
