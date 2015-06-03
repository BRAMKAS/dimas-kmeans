module.exports = {
	getClusters : getClusters
}

function getClusters(data, numberOfClusters) {

	var numberOfDimensions = getNumnerOfDimensions(data);

	if (!numberOfClusters) { numberOfClusters = getNumberOfClusters(data.length) };

	minMaxValues = getMinAndMaxValues(data, numberOfDimensions);


	var maxIterations = 1000;

	var means = createRandomMeans(numberOfDimensions, numberOfClusters, minMaxValues);

	var clusters = createClusters(means);

	var prevMeansDistance = 999999;

	var numOfInterations = 0;

	while(numOfInterations < maxIterations) {

		initClustersData(clusters);

		assignDataToClusters(data, clusters)

		updateMeans(clusters);

		var meansDistance = getMeansDistance(clusters);

		numOfInterations++;
	}

	return clusters;
}

function getNumnerOfDimensions(data) {
	if (data[0]) { return data[0].length};

	return 0;
}

function getNumberOfClusters(n) {
	return Math.ceil(Math.sqrt(n/2));
}

function getMinAndMaxValues(data, numberOfDimensions) {

	var minMaxValues = initMinAndMaxValues(numberOfDimensions);

	data.forEach(function (vector) {

		for (var i = 0; i < numberOfDimensions; i++) {
			

			if (vector[i] < minMaxValues.minValue[i]) {
				minMaxValues.minValue[i] = vector[i];
			}

			if(vector[i] > minMaxValues.maxValue[i]) {
				minMaxValues.maxValue[i] = vector[i];
			}
		};
	});


	return minMaxValues;
}


function initMinAndMaxValues(numberOfDimensions) {

	var result = { minValue : [], maxValue : [] }

	for (var i = 0; i < numberOfDimensions; i++) {
		result.minValue.push(9999);
		result.maxValue.push(-9999);
	};

	return result;
}


function printMeans(clusters) {
	var means = '';

	clusters.forEach(function (cluster) {
		means = means + ' [' + cluster.mean + ']'
	});

	console.log(means);
}

function getMeansDistance(clusters) {

	var meansDistance = 0;

	clusters.forEach(function (cluster) {

		cluster.data.forEach(function (vector) {

			meansDistance = meansDistance + Math.pow(getDistance(cluster.mean, vector), 2)
		});
	});


	return meansDistance;
}

function updateMeans(clusters) {

	clusters.forEach(function (cluster) {
		updateMean(cluster);

	});
}


function updateMean(cluster) {

	var newMean = [];

	for (var i = 0; i < cluster.mean.length; i++) {
		newMean.push(getMean(cluster.data, i));
	};


	cluster.mean = newMean;

}

function getMean(data, index) {
	var sum =  0;
	var total = data.length;

	if(total == 0) return 0;

	data.forEach(function (vector) {

			sum = sum + vector[index];
	});


	return sum / total;
}

function assignDataToClusters(data, clusters) {


	data.forEach(function (vector) {
		var cluster = findClosestCluster(vector, clusters)
		cluster.data.push(vector);
	});
}


function findClosestCluster(vector, clusters) {

	var closest = {};
	var minDistance = 9999999;

	clusters.forEach(function (cluster) {

		var distance = getDistance(cluster.mean, vector);
		if (distance < minDistance) {
			minDistance = distance;
			closest = cluster;
		};
	});

	return closest;
}

function initClustersData(clusters) {
	clusters.forEach(function (cluster) {
		cluster.data = [];
	});
}

function createClusters(means) {
	var clusters = [];

	means.forEach(function (mean) {
		var cluster = { mean : mean, data : []};

		clusters.push(cluster);
	});

	return clusters;
}

function createRandomMeans(numberOfDimensions, numberOfClusters, minMaxValues) {
	
	var means = [];

	for (var i = 0; i < numberOfClusters; i++) {
		means.push(createRandomPoint(numberOfDimensions, minMaxValues.minValue[i], minMaxValues.maxValue[i]));
	};

	return means;
}

function createRandomPoint(numberOfDimensions, minValue, maxValue) {
	var point = [];

	for (var i = 0; i < numberOfDimensions; i++) {
		point.push(random(minValue, maxValue));
	};

	return point;
}

function random (low, high) {

    return Math.random() * (high - low) + low;
}

function getDistance(vector1, vector2) {
	var sum = 0;

	for (var i = 0; i < vector1.length; i++) {
		sum = sum + Math.pow(vector1[i] - vector2[i],2)
	};

	return Math.sqrt(sum);

}

