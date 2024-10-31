// train.js
const tf = require('@tensorflow/tfjs-node'); // Import TensorFlow.js Node.js backend
const fs = require('fs'); // Import the file system module
const path = require('path'); // Import the path module

// Sample data: features and corresponding prices
const features = [
    [10, 20, 1], // Feature 1: Title length, Feature 2: Description length, Feature 3: Base price
    [15, 25, 2],
    [20, 30, 1.5],
    [10, 15, 0.5],
    [30, 45, 3],
];

const labels = [
    100,  // Corresponding price for each set of features
    150,
    120,
    80,
    200,
];

// Convert data to tensors
const xs = tf.tensor2d(features); // Convert features to tensor
const ys = tf.tensor2d(labels, [labels.length, 1]); // Convert labels to tensor

// Create a simple model
const model = tf.sequential(); // Create a sequential model
model.add(tf.layers.dense({ units: 1, inputShape: [3] })); // Add a dense layer with 1 output

// Compile the model
model.compile({ optimizer: 'sgd', loss: 'meanSquaredError' }); // Use stochastic gradient descent optimizer and mean squared error loss

// Train the model
model.fit(xs, ys, { epochs: 100 }).then(() => {
    console.log('Model trained!');
    
    // Specify the directory to save the model
    const modelDir = path.join(__dirname, 'model');

    // Create the model directory if it does not exist
    if (!fs.existsSync(modelDir)) {
        fs.mkdirSync(modelDir);
    }

    // Save the model to the specified directory
    return model.save(`file://${path.join(modelDir, 'my-model')}`); // Save the model in the 'model' directory
}).then(() => {
    console.log('Model saved successfully!');
}).catch(err => {
    console.error('Error saving model:', err);
});

///Users/christian/Documents/GitHub/mobile-app/price_prediction/model/my-model/model.json