pipeline {
    agent any

    environment {
        REMOTE_HOST = '13.219.77.142'
        REMOTE_USER = 'ubuntu'
        REMOTE_PATH = '/home/ubuntu/frontend'
        IMAGE_NAME = 'myapp'
        SSH_CREDENTIALS_ID = 'ubuntu'  // Change this to your Jenkins SSH credential ID
    }

    stages {
        stage('Checkout SCM') {
            steps {
                checkout scm
            }
        }

        stage('Test SSH Login') {
            steps {
                sshagent([env.SSH_CREDENTIALS_ID]) {
                    sh "ssh -o StrictHostKeyChecking=no ${env.REMOTE_USER}@${env.REMOTE_HOST} echo SSH login successful"
                }
            }
        }

        stage('Sync Source to Remote') {
            steps {
                sshagent([env.SSH_CREDENTIALS_ID]) {
                    // Sync workspace files to remote build context folder
                    sh "rsync -avz --delete -e 'ssh -o StrictHostKeyChecking=no' ./ ${env.REMOTE_USER}@${env.REMOTE_HOST}:${env.REMOTE_PATH}/"
                }
            }
        }

        stage('Remove Old Backup Image') {
            steps {
                sshagent([env.SSH_CREDENTIALS_ID]) {
                    sh """
                    ssh -o StrictHostKeyChecking=no ${env.REMOTE_USER}@${env.REMOTE_HOST} docker images -q ${env.IMAGE_NAME}:old_image | grep . && \
                    docker rmi ${env.IMAGE_NAME}:old_image || echo 'No old_image to remove'
                    """
                }
            }
        }

        stage('Tag Current Latest as Old') {
            steps {
                sshagent([env.SSH_CREDENTIALS_ID]) {
                    sh """
                    ssh -o StrictHostKeyChecking=no ${env.REMOTE_USER}@${env.REMOTE_HOST} docker images -q ${env.IMAGE_NAME}:latest | grep . && \
                    docker tag ${env.IMAGE_NAME}:latest ${env.IMAGE_NAME}:old_image || echo 'No latest image to tag'
                    """
                }
            }
        }

        stage('Build New Docker Image') {
            steps {
                sshagent([env.SSH_CREDENTIALS_ID]) {
                    sh """
                    ssh -o StrictHostKeyChecking=no ${env.REMOTE_USER}@${env.REMOTE_HOST} \
                    docker build --no-cache -t ${env.IMAGE_NAME}:latest -f ${env.REMOTE_PATH}/Dockerfile ${env.REMOTE_PATH}
                    """
                }
            }
        }

        stage('Restart Container') {
            steps {
                sshagent([env.SSH_CREDENTIALS_ID]) {
                    script {
                        def containerId = sh (
                            script: "ssh -o StrictHostKeyChecking=no ${env.REMOTE_USER}@${env.REMOTE_HOST} docker ps -q --filter name=beautiful_davinci",
                            returnStdout: true
                        ).trim()

                        if (containerId) {
                            echo "Stopping and removing running container: beautiful_davinci"
                            sh "ssh -o StrictHostKeyChecking=no ${env.REMOTE_USER}@${env.REMOTE_HOST} docker stop ${containerId}"
                            sh "ssh -o StrictHostKeyChecking=no ${env.REMOTE_USER}@${env.REMOTE_HOST} docker rm ${containerId}"
                        } else {
                            echo "No running container named beautiful_davinci found."
                        }

                        echo "Running new container from latest image..."
                        sh "ssh -o StrictHostKeyChecking=no ${env.REMOTE_USER}@${env.REMOTE_HOST} docker run -d -p 3000:3000 --name beautiful_davinci ${env.IMAGE_NAME}:latest"
                    }
                }
            }
        }
    }

    post {
        success {
            echo "Deployment completed successfully."
        }
        failure {
            echo "Deployment failed."
        }
    }
}





















// pipeline {
//     agent any

//     environment {
//         LATEST_IMAGE_TAG = 'myapp:latest'
//         OLD_IMAGE_TAG = 'myapp:old_image'
//         CONTAINER_NAME = 'beautiful_davinci'
//         DOCKERFILE_PATH = '/home/ubuntu/frontend/Dockerfile'
//         WORKDIR = '/home/ubuntu/frontend'
//         HOST_PORT = '3000'
//         CONTAINER_PORT = '3000'
//     }

//     stages {
//         stage('Test SSH Login') {
//             steps {
//                 sshagent(['my-ssh-key']) {
//                     sh 'ssh -o StrictHostKeyChecking=no ubuntu@13.219.77.142 "echo SSH login successful"'
//                 }
//             }
//         }

//         stage('Remove Old Backup Image') {
//             steps {
//                 script {
//                     def oldImageId = sh(script: "docker images -q ${OLD_IMAGE_TAG}", returnStdout: true).trim()
//                     if (oldImageId) {
//                         echo "Removing old image: ${OLD_IMAGE_TAG}"
//                         sh "docker rmi ${OLD_IMAGE_TAG}"
//                     } else {
//                         echo "No old image found."
//                     }
//                 }
//             }
//         }

//         stage('Tag Current Latest as Old') {
//             steps {
//                 script {
//                     def currentImageId = sh(script: "docker images -q ${LATEST_IMAGE_TAG}", returnStdout: true).trim()
//                     if (currentImageId) {
//                         echo "Tagging current latest as old_image"
//                         sh "docker tag ${LATEST_IMAGE_TAG} ${OLD_IMAGE_TAG}"
//                     } else {
//                         echo "No latest image found to tag."
//                     }
//                 }
//             }
//         }

//         stage('Build New Docker Image') {
//             steps {
//                 dir("${WORKDIR}") {
//                     sh "docker build -t ${LATEST_IMAGE_TAG} -f ${DOCKERFILE_PATH} ."
//                 }
//             }
//         }

//         stage('Restart Container') {
//             steps {
//                 script {
//                     def containerId = sh(script: "docker ps -q --filter name=${CONTAINER_NAME}", returnStdout: true).trim()
//                     if (containerId) {
//                         echo "Stopping and removing running container: ${CONTAINER_NAME}"
//                         sh "docker stop ${containerId}"
//                         sh "docker rm ${containerId}"
//                     } else {
//                         echo "No container is currently running."
//                     }

//                     echo "Running new container from latest image..."
//                     sh "docker run -d -p ${HOST_PORT}:${CONTAINER_PORT} --name ${CONTAINER_NAME} ${LATEST_IMAGE_TAG}"
//                 }
//             }
//         }
//     }

//     post {
//         failure {
//             echo 'Docker build or deployment failed. Check logs.'
//         }
//         success {
//             echo 'Deployment completed successfully.'
//         }
//     }
// }
