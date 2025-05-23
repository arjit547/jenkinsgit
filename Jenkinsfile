pipeline {
    agent any

    environment {
        LATEST_IMAGE_TAG = 'myapp:latest'
        OLD_IMAGE_TAG = 'myapp:old_image'
        CONTAINER_NAME = 'beautiful_davinci'
        DOCKERFILE_PATH = '/home/ubuntu/frontend/Dockerfile'
        WORKDIR = '/home/ubuntu/frontend'
        HOST_PORT = '3000'
        CONTAINER_PORT = '3000'
    }

    stages {
        stage('Test SSH Login') {
            steps {
                sshagent(['my-ssh-key']) {
                    sh 'ssh -o StrictHostKeyChecking=no ubuntu@ec2-13-219-77-142 "echo SSH login successful"'
                }
            }
        }

        stage('Remove Old Backup Image') {
            steps {
                script {
                    def oldImageId = sh(script: "docker images -q ${OLD_IMAGE_TAG}", returnStdout: true).trim()
                    if (oldImageId) {
                        echo "Removing old image: ${OLD_IMAGE_TAG}"
                        sh "docker rmi ${OLD_IMAGE_TAG}"
                    } else {
                        echo "No old image found."
                    }
                }
            }
        }

        stage('Tag Current Latest as Old') {
            steps {
                script {
                    def currentImageId = sh(script: "docker images -q ${LATEST_IMAGE_TAG}", returnStdout: true).trim()
                    if (currentImageId) {
                        echo "Tagging current latest as old_image"
                        sh "docker tag ${LATEST_IMAGE_TAG} ${OLD_IMAGE_TAG}"
                    } else {
                        echo "No latest image found to tag."
                    }
                }
            }
        }

        stage('Build New Docker Image') {
            steps {
                dir("${WORKDIR}") {
                    sh "docker build -t ${LATEST_IMAGE_TAG} -f ${DOCKERFILE_PATH} ."
                }
            }
        }

        stage('Restart Container') {
            steps {
                script {
                    def containerId = sh(script: "docker ps -q --filter name=${CONTAINER_NAME}", returnStdout: true).trim()
                    if (containerId) {
                        echo "Stopping and removing running container: ${CONTAINER_NAME}"
                        sh "docker stop ${containerId}"
                        sh "docker rm ${containerId}"
                    } else {
                        echo "No container is currently running."
                    }

                    echo "Running new container from latest image..."
                    sh "docker run -d -p ${HOST_PORT}:${CONTAINER_PORT} --name ${CONTAINER_NAME} ${LATEST_IMAGE_TAG}"
                }
            }
        }
    }

    post {
        failure {
            echo 'Docker build or deployment failed. Check logs.'
        }
        success {
            echo 'Deployment completed successfully.'
        }
    }
}
