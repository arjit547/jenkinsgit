pipeline {
    agent any

    environment {
        LATEST_IMAGE_TAG = 'myapp:latest'
        OLD_IMAGE_TAG = 'myapp:old_image'
        CONTAINER_NAME = 'beautiful_davinci'
        WORKDIR = '/home/ubuntu/frontend'
        HOST_PORT = '3000'
        CONTAINER_PORT = '3000'
        REMOTE_HOST = 'ubuntu@44.211.217.170'
    }

    stages {
        stage('Test SSH Login') {
            steps {
                sshagent(['my-ssh-key']) {
                    sh "ssh -o StrictHostKeyChecking=no ${REMOTE_HOST} 'echo SSH login successful'"
                }
            }
        }

        stage('Sync Code to Remote Server') {
            steps {
                sshagent(['my-ssh-key']) {
                    sh """
                        rsync -avz --delete -e "ssh -o StrictHostKeyChecking=no" ./ ${REMOTE_HOST}:${WORKDIR}/
                    """
                }
            }
        }

        stage('Deploy Docker Image on Remote Server') {
            steps {
                sshagent(['my-ssh-key']) {
                    sh """
                        ssh -o StrictHostKeyChecking=no ${REMOTE_HOST} '
                            set -e

                            echo "Removing old backup image if exists..."
                            if docker images -q ${OLD_IMAGE_TAG} > /dev/null 2>&1; then
                                docker rmi ${OLD_IMAGE_TAG}
                            else
                                echo "No old image to remove."
                            fi

                            echo "Tagging latest image as old_image if latest exists..."
                            if docker images -q ${LATEST_IMAGE_TAG} > /dev/null 2>&1; then
                                docker tag ${LATEST_IMAGE_TAG} ${OLD_IMAGE_TAG}
                            else
                                echo "No latest image to tag."
                            fi

                            echo "Building new Docker image..."
                            cd ${WORKDIR}
                            docker build -t ${LATEST_IMAGE_TAG} -f Dockerfile .

                            echo "Stopping and removing existing container if running..."
                            CONTAINER_ID=\$(docker ps -q --filter name=${CONTAINER_NAME})
                            if [ ! -z "\$CONTAINER_ID" ]; then
                                docker stop \$CONTAINER_ID
                                docker rm \$CONTAINER_ID
                            else
                                echo "No running container to stop."
                            fi

                            echo "Running new container..."
                            docker run -d -p ${HOST_PORT}:${CONTAINER_PORT} --name ${CONTAINER_NAME} ${LATEST_IMAGE_TAG}

                            echo "Deployment completed successfully on remote host."
                        '
                    """
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


































// pipeline {
//     agent any

//     environment {
//         LATEST_IMAGE_TAG = 'myapp:latest'
//         OLD_IMAGE_TAG = 'myapp:old_image'
//         CONTAINER_NAME = 'beautiful_davinci'
//         WORKDIR = '/home/ubuntu/frontend'
//         HOST_PORT = '3000'
//         CONTAINER_PORT = '3000'
//         REMOTE_HOST = 'ubuntu@13.219.77.142'
//     }

//     stages {
//         stage('Test SSH Login') {
//             steps {
//                 sshagent(['my-ssh-key']) {
//                     sh "ssh -o StrictHostKeyChecking=no ${REMOTE_HOST} 'echo SSH login successful'"
//                 }
//             }
//         }

//         stage('Deploy Docker Image on Remote Server') {
//             steps {
//                 sshagent(['my-ssh-key']) {
//                     sh """
//                         ssh -o StrictHostKeyChecking=no ${REMOTE_HOST} '
//                             set -e

//                             echo "Removing old backup image if exists..."
//                             if docker images -q ${OLD_IMAGE_TAG} > /dev/null 2>&1; then
//                                 docker rmi ${OLD_IMAGE_TAG}
//                             else
//                                 echo "No old image to remove."
//                             fi

//                             echo "Tagging latest image as old_image if latest exists..."
//                             if docker images -q ${LATEST_IMAGE_TAG} > /dev/null 2>&1; then
//                                 docker tag ${LATEST_IMAGE_TAG} ${OLD_IMAGE_TAG}
//                             else
//                                 echo "No latest image to tag."
//                             fi

//                             echo "Building new Docker image..."
//                             cd ${WORKDIR}
//                             docker build -t ${LATEST_IMAGE_TAG} -f Dockerfile .

//                             echo "Stopping and removing existing container if running..."
//                             CONTAINER_ID=\$(docker ps -q --filter name=${CONTAINER_NAME})
//                             if [ ! -z "\$CONTAINER_ID" ]; then
//                                 docker stop \$CONTAINER_ID
//                                 docker rm \$CONTAINER_ID
//                             else
//                                 echo "No running container to stop."
//                             fi

//                             echo "Running new container..."
//                             docker run -d -p ${HOST_PORT}:${CONTAINER_PORT} --name ${CONTAINER_NAME} ${LATEST_IMAGE_TAG}

//                             echo "Deployment completed successfully on remote host."
//                         '
//                     """
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
